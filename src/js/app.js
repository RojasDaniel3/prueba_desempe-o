// === PLANTILLA SPA CURSOS ===
// Instrucciones: Este es el punto de entrada de la SPA.
// Aquí debes inicializar el enrutador y cualquier lógica global.

import './api.js'; // Implementa la API en js/api.js
import './auth.js'; // Implementa la autenticación en js/auth.js
import { router } from './router.js'; // Implementa el enrutador en js/router.js

// Inicializa el enrutador al cargar la página y al cambiar el hash
window.addEventListener('DOMContentLoaded', router);
window.addEventListener('hashchange', router);

// Puedes agregar aquí lógica global si lo necesitas
