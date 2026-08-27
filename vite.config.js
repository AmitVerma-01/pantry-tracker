import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { handleRecipeRequest } from './server/recipeApiHandler.js'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'recipe-api-dev',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url !== '/api/generate-recipe') {
              next()
              return
            }

            await handleRecipeRequest(req, res, env)
          })
        },
      },
    ],
    server: {
      host: true,
    },
  }
})
