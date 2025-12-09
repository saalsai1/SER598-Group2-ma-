import { MEALDB_BASE } from '@/lib/meal'
import React, { useEffect, useRef, useState } from 'react'

const API_BASE = MEALDB_BASE || "https://www.themealdb.com/api/json/v1/1"

interface MealSummary {
    id: string
    name: string
    area: string
    category: string
    thumb: string
}

interface MealDetail {
    idMeal: string
    strMeal: string
    strCategory: string | null
    strArea: string | null
    strInstruction: string | null
    strMealThumb: string | null
    strYoutube: string | null
    strTags: string | null
    strSource: string | null
    [key: string]: any | string | null
}

interface Ingredient {
    ingredient: string
    measure: string
}



// interafce defination 
function normaliseMeal(meal: { idMeal: any; strMeal: any; strArea: any; strCategory: any; strMealThumb: any }) {
    return {
        id: meal.idMeal,
        name: meal.strMeal || "unknow recipe",
        area: meal.strArea || "",
        category: meal.strCategory || "",
        thumb: meal.strMealThumb || "",
    }
}


// fetching the ingredient and building into structure
function buildIngredients(meal: MealDetail): Ingredient[] {
    const out = [];
    for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const meas = meal[`strMeasure${i}`];
        if (ing && String(ing).trim()) {
            out.push({
                ingredient: String(ing).trim(),
                measure: meas && String(meas).trim() ? String(meas).trim() : "to taste",
            });
        }
    }
    return out;
}


// getting yt url from the metadata 
function youtubeEmbedUrl(url: string | URL) {
    if (!url) return undefined;

    try {
        const urlObj = new URL(url);
        let id: string | null = null;

        // Handle youtube.com/watch?v=id
        if (urlObj.hostname.includes('youtube.com')) {
            id = urlObj.searchParams.get('v');
        }
        // Handle youtu.be/id
        else if (urlObj.hostname === 'youtu.be') {
            id = urlObj.pathname.slice(1);
        }
        return id ? `https://www.youtube.com/embed/${id}?rel=0` : undefined;
    } catch {
        return undefined;
    }

}

// parse the instructions from the recipe db 
function parseInstructions(text: any) {
    if (!text) return []

    // will spilt lines on CR/LF grps, then spit long lines into short phrase by (.)
    const lines = String(text).split(/\r?\n+/).map((s) => s.trim()).filter(Boolean)
    const steps = []
    for (const line of lines) {
        const parts = line.split('.')
        for (let p of parts) {
            p = String(p).trim()
            if (!p) continue
            // drop the trailing dot and any numeric list makers 
            if (p.endsWith('.')) p = p.slice(0, -1)
            p = p.replace(/^\s*\d+[\)\.]\s*/, '')
            steps.push(p)
        }
    }
    return steps

}





export default function RecipeSearch() {


    const [query, setQuery] = useState("")
    const [results, setResults] = useState<MealSummary[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [selected, setSelected] = useState<MealDetail | null>(null) // will show full meal detauls 
    const [detailLoading, setDetailLoading] = useState(false)
    const [detailError, setDetailError] = useState("")

    const [showAllSteps, setShowAllSteps] = useState(false)
    const [showIngredients, setShowIngredients] = useState(false)
    const [showVideo, setShowVideo] = useState(false)

    const controllerRef = useRef<AbortController | null>(null)
    const detailControllerRef = useRef<AbortController | null>(null)
    const AbortControllerRef = useRef<AbortController | null>(null)




    async function fetchByName(name: string) {
        if (controllerRef.current) controllerRef.current.abort();
        const controller = new AbortController();
        controllerRef.current = controller;


        setLoading(true);
        setError("");
        setResults([]);


        try {
            const url = `${API_BASE}/search.php?s=${encodeURIComponent(name.trim())}`;
            const res = await fetch(url, { signal: controller.signal });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const meals = Array.isArray(data?.meals) ? data.meals.map(normaliseMeal) : [];
            setResults(meals);
        } catch (err) {
            if ((err as Error).name !== "AbortError") {
                setError("Could not fetch recipes. Please try again.");
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    }


    async function fetchDetailsById(id: string) {
        if (detailControllerRef.current) detailControllerRef.current.abort();
        const controller = new AbortController();
        detailControllerRef.current = controller;

        setDetailLoading(true);
        setDetailError("");

        try {
            const url = `${API_BASE}/lookup.php?i=${encodeURIComponent(id)}`;
            const res = await fetch(url, { signal: controller.signal });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const meal = Array.isArray(data?.meals) ? data.meals[0] : null;
            setSelected(meal || null);

            setShowAllSteps(false);
            setShowIngredients(false);
            setShowVideo(false);
        } catch (err: any) {
            if (err.name !== "AbortError") {
                setDetailError("Could not load recipe details.");
                console.error(err);
            }
        } finally {
            setDetailLoading(false);
        }
    }

    // loading the featured selected 4 recipe on mount 
    useEffect(() => {
        const loadFeatured = async () => {
            try {
                const response = await fetch(`${API_BASE}/search.php?s=`);
                const data = await response.json();

                if (data.meals) {
                    const featured = data.meals.slice(0, 4).map(normaliseMeal);
                    setResults(featured);
                }
            } catch (err) {
                console.error('Failed to load featured recipes:', err);
            }
        };

        if (!query) {
            loadFeatured();
        }

        // handle with esc btn 
         if (selected) {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelected(null)
        }
        document.addEventListener('keydown', handleEscape)
        document.body.style.overflow = 'hidden'
        
        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }


    }, [selected, query]);





    function onSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault()
        const q = query.trim()
        if (!q) {
            setError("Type recipe name ( e.g. Chicken...")
            return
        }
        // other
        fetchByName(q)
    }

    function openDetails(id: any) {
        fetchDetailsById(id)
        if (window.innerWidth < 1024) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }






    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        🍳  Recipe Searchh
                    </h1>
                    <p className="text-gray-600">Discover delicious recipes from around the world</p>
                </header>

                <form onSubmit={onSubmit} className="max-w-2xl mx-auto mb-8">
                    <label htmlFor="recipe" className='sr-only'>Search Recipe by Name</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            id='recipe'
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder='Try: Chicken,..'
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                            type='submit'
                            disabled={loading}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>

                    </div>

                </form>

                {loading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                        <p className="mt-2 text-gray-600">Loading recipes...</p>
                    </div>
                )}
                {error && !loading && (
                    <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
                )}


                {/* result + layout for the recipe panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <section className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {results.length ? "Results" : "No Results"}
                            </h2>
                            <span className="text-xs text-neutral-600">
                                {results.length} item(s)
                            </span>
                        </div>

                        {results.length > 0 ? (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {results.map((r) => (
                                    <li key={r.id} className="bg-white rounded-2xl shadow-sm p-4 border border-neutral-200 hover:shadow transition">
                                        <h3 className="text-lg font-medium leading-tight mb-3 line-clamp-2" title={r.name}>
                                            {r.name}
                                        </h3>

                                        {r.thumb ? (
                                            <button
                                                onClick={() => openDetails(r.id)}
                                                className="block w-full text-left"
                                                aria-label={`Open DEtails for ${r.name}`}
                                            >
                                                <img
                                                    src={r.thumb}
                                                    alt={r.name}
                                                    loading='lazy'
                                                    className="w-full rounded-xl aspect-video object-cover bg-neutral-100"
                                                />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => openDetails(r.id)}
                                                className="block w-full text-left"
                                            >
                                                <div className="w-full rounded-xl aspect-video bg-neutral-100 grid place-items-center text-neutral-400 text-sm">
                                                    No image
                                                </div>

                                            </button>

                                        )}

                                        {/* fetch metadata  */}
                                        <div className="mt-3 text-xs text-neutral-600 flex items-center gap-2">
                                            {r.category && (
                                                <span className="inline-flex items-center rounded-full border border-green-500 text-green-700 px-2 py-0.5 font-medium">
                                                    {r.category}
                                                </span>
                                            )}
                                            {r.area && (
                                                <span className="inline-flex items-center rounded-full border border-neutral-300 text-neutral-700 px-2 py-0.5">
                                                    {r.area}</span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) :
                            (
                                !loading && <div className="text-sm text-neutral-600">No Results, try different name..</div>
                            )
                        }


                    </section>
                  
                    {selected && (
                        <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 z-40 bg-black/20 bg-opacity-50 backdrop-blur-sm backdrop-saturate-150"
                                onClick={() => setSelected(null)}
                            />

                            {/* Modal Container */}
                            <div className="fixed inset-0 z-50 overflow-y-auto">
                                <div className="flex min-h-screen items-center justify-center p-4">
                                   
                                    <div className="relative w-full max-w-2xl">
                                        {detailLoading && (
                                            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                                <div className="text-sm text-neutral-600 mt-2">Loading Details...</div>
                                            </div>
                                        )}

                                        {detailError && (
                                            <div className="bg-white rounded-2xl shadow-2xl p-6">
                                                <div className="text-sm text-red-600">{detailError}</div>
                                            </div>
                                        )}

                                        {selected && !detailLoading && (
                                            <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 p-6 max-h-[90vh] overflow-y-auto">
                                                {/* Close button */}
                                                <button
                                                    onClick={() => setSelected(null)}
                                                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>

                                                <div className="flex items-start justify-between gap-3 pr-8">
                                                    <h3 className="text-xl font-semibold leading-tight">
                                                        {selected.strMeal}
                                                    </h3>
                                                </div>

                                                {/* Tags */}
                                                <div className="mt-2 flex items-center gap-2 text-xs">
                                                    {selected.strCategory && (
                                                        <span className="inline-flex items-center rounded-full border border-green-500 text-green-700 px-2 py-0.5 font-medium">
                                                            {selected.strCategory}
                                                        </span>
                                                    )}

                                                    {selected.strArea && (
                                                        <span className="inline-flex items-center rounded-full border border-neutral-300 text-neutral-700 px-2 py-0.5">
                                                            {selected.strArea}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Thumbnail */}
                                                {selected.strMealThumb && (
                                                    <img
                                                        src={selected.strMealThumb}
                                                        alt={selected.strMeal}
                                                        loading='lazy'
                                                        className="w-full rounded-xl aspect-video object-cover bg-neutral-100 mt-3"
                                                    />
                                                )}

                                                {/* Instructions */}
                                                <div className="mt-4">
                                                    <h4 className="font-medium mb-2">Instructions</h4>
                                                    {(() => {
                                                        const steps = parseInstructions(selected.strInstructions)
                                                        const show = showAllSteps ? steps : steps.slice(0, 2)
                                                        return (
                                                            <>
                                                                <ol className="list-decimal pl-5 space-y-1 text-sm text-neutral-800">
                                                                    {show.map((s, idx) => (
                                                                        <li key={idx}>{s}</li>
                                                                    ))}
                                                                </ol>
                                                                {steps.length > 2 && (
                                                                    <button
                                                                        onClick={() => setShowAllSteps((v) => !v)}
                                                                        className="mt-2 text-sm underline decoration-neutral-400 hover:decoration-neutral-800"
                                                                    >
                                                                        {showAllSteps ? "Show less" : `Show ${steps.length - 2} more steps`}
                                                                    </button>
                                                                )}
                                                            </>
                                                        )
                                                    })()}
                                                </div>

                                                {/* YouTube video */}
                                                {selected.strYoutube && (
                                                    <div className="mt-4">
                                                        <button
                                                            onClick={() => setShowVideo((v) => !v)}
                                                            className="text-sm underline decoration-neutral-400 hover:decoration-neutral-800"
                                                        >
                                                            {showVideo ? "Hide Video" : "Watch on YouTube"}
                                                        </button>
                                                        {showVideo && youtubeEmbedUrl(selected.strYoutube) && (
                                                            <div className="mt-2 aspect-video rounded-xl overflow-hidden bg-black">
                                                                <iframe
                                                                    src={youtubeEmbedUrl(selected.strYoutube)}
                                                                    title="Recipe video"
                                                                    className="w-full h-full"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                                    allowFullScreen
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Ingredients */}
                                                <div className="mt-4">
                                                    <button
                                                        onClick={() => setShowIngredients((v) => !v)}
                                                        className="text-sm underline decoration-neutral-400 hover:decoration-neutral-800"
                                                    >
                                                        {showIngredients ? "Hide Ingredients" : "Show Ingredients"}
                                                    </button>
                                                    {showIngredients && (
                                                        <ul className="mt-2 divide-y divide-neutral-200 text-sm">
                                                            {buildIngredients(selected).map(({ ingredient, measure }, i) => (
                                                                <li key={i} className="py-1 flex items-center justify-between gap-3">
                                                                    <span className="text-neutral-800">{ingredient}</span>
                                                                    <span className="text-neutral-600">{measure}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Optional: Add this useEffect to handle Escape key and prevent body scroll */}
                    {/* 
useEffect(() => {
    if (selected) {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelected(null)
        }
        document.addEventListener('keydown', handleEscape)
        document.body.style.overflow = 'hidden'
        
        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }
}, [selected])
*/}


                </div>



            </div>
        </div>
    )

}

