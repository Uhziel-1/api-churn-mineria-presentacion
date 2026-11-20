# Presentación S15 — Reproducibilidad y Despliegue de API Churn

Presentación interactiva en formato diapositivas (**estilo PPT**, 9 slides, regla 10-20-30, sin desplazamiento vertical) separada del proyecto de la API para sustentar el funcionamiento y la reproducibilidad de `api-churn-mineria.onrender.com`.

## Controles durante la exposición
* **`→` / `Espacio` / `←`:** Avanzar o retroceder diapositiva.
* **`F`:** Activar o salir de pantalla completa.
* **`N`:** Mostrar u ocultar las **Notas del Orador** (guion breve para cada diapositiva).
* **`G`:** Abrir el mapa general de diapositivas para saltar directo a cualquiera.

## Despliegue rápido (100 % estático)
Como solo contiene `index.html`, `styles.css` y `app.js` (sin dependencias ni build):
1. **GitHub Pages:** Sube esta carpeta a un repositorio nuevo y activa *Settings → Pages → Deploy from branch (`main`)*.
2. **Netlify Drop / Vercel / Render Static Site:** Arrastra la carpeta `S15` o conecta el repositorio como *Static Site* con directorio raíz `.`.
