import type { Config } from 'tailwindcss';
import lineClamp from "@tailwindcss/line-clamp"

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [lineClamp],
} satisfies Config ;

export default config;
// export default