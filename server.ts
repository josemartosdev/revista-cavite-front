import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API: AI Assistant Route (Lazy Initialization of GoogleGenAI)
  app.post('/api/ai/assistant', async (req, res) => {
    const { task, title, content } = req.body;

    if (!task || !content) {
      return res.status(400).json({ error: 'Falta el parámetro task o content para el asistente de IA.' });
    }

    // Lazy initialization of API Key as requested in guidelines to prevent startup crashes
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'El asistente de IA no está configurado. Por favor, añade tu GEMINI_API_KEY en el panel de Settings > Secrets de AI Studio.' 
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      let systemPrompt = '';
      let prompt = '';

      if (task === 'SUMMARY') {
        systemPrompt = 'Eres un asistente editorial experto en arquitectura y diseño. Tu objetivo es resumir textos profesionales con precisión intelectual.';
        prompt = `Escribe un resumen ejecutivo pulido y conciso (de unas 3 a 4 líneas) del siguiente texto de libreta de arquitectura. Resalta las decisiones estructurales y estéticas de manera sobria. Devuelve ÚNICAMENTE el párrafo resumido, sin introducciones ni marcas de formato secundarias.\n\nTítulo: ${title || 'Sin título'}\n\nContenido:\n${content}`;
      } else if (task === 'SEO_TITLE') {
        systemPrompt = 'Eres un optimizador de SEO experto. Tu objetivo es redactar títulos atractivos, limpios y de alto impacto.';
        prompt = `Propón exactamente 3 títulos SEO sumamente elegantes, pulidos y de nivel profesional para esta publicación de libreta arquitectónica. El tono debe ser sobrio y técnico. Devuelve únicamente la lista numerada del 1 al 3 sin texto explicativo.\n\nTítulo Original: ${title || 'Sin título'}\n\nContenido:\n${content}`;
      } else if (task === 'LINKEDIN') {
        systemPrompt = 'Eres un redactor experto en redes profesionales y distribución de contenido técnico.';
        prompt = `Re-escribe esta entrada de libreta de arquitectura en una publicación sumamente atractiva y pulida para LinkedIn. Adapta el contenido para despertar el debate intelectual entre ingenieros y arquitectos. Utiliza párrafos cortos, viñetas de diseño y añade un par de hashtags de nicho al final (como #Tectonica, #Arquitectura). Sé sofisticado y evita el lenguaje artificial y sobre-vendedor.\n\nTítulo: ${title || 'Sin título'}\n\nContenido:\n${content}`;
      } else {
        return res.status(400).json({ error: 'La tarea solicitada no es válida.' });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error('La respuesta generada por Gemini fue vacía.');
      }

      return res.json({ result: text.trim() });
    } catch (error: any) {
      console.error('Error in AI Assistant Route:', error);
      return res.status(500).json({ 
        error: error.message || 'Error interno al procesar la solicitud con Gemini.' 
      });
    }
  });

  // Serve static site / mount Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT} with NODE_ENV=${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
