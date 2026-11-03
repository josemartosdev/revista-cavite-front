<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/799c43bc-45ed-44cb-a432-da9fed0fdd61

## Run Locally

**Prerequisites:** Node.js

## Publicaciones y backend PHP

El acceso de redacción y la publicación de artículos se conectan a una API PHP independiente. Configura `API_BASE_URL` en `.env.local` con la URL base de esa API. El contrato de autenticación, artículos, categorías y respuestas está descrito en [BACKEND_PHP.md](./BACKEND_PHP.md).

El modo visual para administradores también requiere `GET /site-config` y `PUT /site-config`; guarda en PHP/MySQL los estilos, textos e imágenes cambiados y el orden, visibilidad y tamaño de módulos. El usuario administrador debe incluir `role: "admin"` en las respuestas de autenticación.

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
