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
          const featured = data.meals.slice(0, 6).map(normaliseMeal);
          setResults(featured);
        }
      } catch (err) {
        console.error('Failed to load featured recipes:', err);
      }
    };
    
    if (!query) {
      loadFeatured();
    }
  }, [query]);





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
        <div>
            <div>
                <header>
                    <h1> Recipe Searchh</h1>

                </header>

                <form onSubmit={onSubmit}>
                    <label htmlFor="recipe">Search Recipe by Name</label>
                    <input
                        type="text"
                        id='recipe'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='Try: Chicken,..'
                    />
                    <button
                        type='submit'

                    >
                        Search
                    </button>



                </form>

                {loading && (
                    <div>Searching...</div>
                )}
                {error && !loading && (
                    <div>{error}</div>
                )}


                {/* result + layout for the recipe panel */}
                <div>
                    <section>
                        <div>
                            <h2>
                                {results.length ? "Results" : "No Results"}
                            </h2>
                            <span>
                                {results.length} item(s)
                            </span>
                        </div>

                        {results.length > 0 ? (
                            <ul>
                                {results.map((r) => (
                                    <li key={r.id}>
                                        <h3 title={r.name}>
                                            {r.name}
                                        </h3>

                                        {r.thumb ? (
                                            <button
                                                onClick={() => openDetails(r.id)}
                                                aria-label={`Open DEtails for ${r.name}`}
                                            >
                                                <img
                                                    src={r.thumb}
                                                    alt={r.name}
                                                    loading='lazy'
                                                />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => openDetails(r.id)}
                                            >
                                                <div>
                                                    No IMage Found
                                                </div>

                                            </button>

                                        )}

                                        {/* fetch metadata  */}
                                        <div>
                                            {r.category && (
                                                <span>
                                                    {r.category}
                                                </span>
                                            )}
                                            {r.area && (
                                                <span>{r.area}</span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) :
                            (
                                !loading && <div>No Results, try different name..</div>
                            )
                        }


                    </section>
                    {/* detailed pane  */}
                    <aside>
                        <div>
                            {!selected && (
                                <div>Select Recipe to view Details.</div>
                            )}

                            {detailLoading && (
                                <div> Loading Detail...</div>
                            )}

                            {detailError && (
                                <div>{detailError}</div>
                            )}

                            {selected && !detailLoading && (
                                <div>
                                    <div>
                                        <h3>{selected.strMeal}</h3>
                                    </div>

                                    {/* ring tags  */}

                                    <div>
                                        {selected.strCategory && (
                                            <span>
                                                {selected.strCategory}
                                            </span>
                                        )}

                                        {selected.strArea && (
                                            <span>
                                                {selected.strArea}
                                            </span>
                                        )}
                                    </div>

                                    {/* thumbb */}
                                    {selected.strMealThumb && (
                                        <img
                                            src={selected.strMealThumb}
                                            alt={selected.strMeal}
                                            loading='lazy'

                                        />
                                    )}

                                    {/* instructions ( this i=s collapse optionkl) */}
                                    <div>
                                        <h4>Instructions </h4>
                                        {/* we will parse the instructions from the recipe db here ( from the functin) */}
                                        {(() => {
                                            const steps = parseInstructions(selected.strInstructions)
                                            const show = showAllSteps ? steps : steps.slice(0, 2)
                                            return (
                                                <>
                                                    <ol>
                                                        {show.map((s, idx) => (
                                                            <li key={idx}>{s}</li>
                                                        ))}
                                                    </ol>
                                                    {steps.length > 2 && (
                                                        <button
                                                            onClick={() => setShowAllSteps((v) => !v)}
                                                        >
                                                            {showAllSteps ? "show less" : `Show ${steps.length - 2} more steps`}
                                                        </button>
                                                    )}
                                                </>
                                            )
                                        })()}
                                    </div>

                                    {/* yt toggle space  */}
                                    {selected.strYoutube && (
                                        <div>
                                            <button
                                                onClick={() => setShowVideo((v) => !v)}
                                            >
                                                {showVideo ? "Hide Video" : "Watch on YouTube"}
                                            </button>
                                            {showVideo && youtubeEmbedUrl(selected.strYoutube) && (
                                                <div>
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

                                    {/* ingredient fetch  */}
                                    <div>
                                        <button
                                            onClick={() => setShowIngredients((v) => !v)}
                                        >
                                            {showIngredients ? "Hide Ingredient" : "Show Ingredient"}
                                        </button>
                                        {showIngredients && (
                                            <ul>
                                                {buildIngredients(selected).map(({ ingredient, measure }, i) => (
                                                    <li key={i}>
                                                        <span>{ingredient}</span>
                                                        <span>{measure}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>


                                </div>
                            )}

                        </div>
                    </aside>


                </div>



            </div>
        </div>
    )

}
