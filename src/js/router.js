import { auth } from './auth.js';
import {
  showLogin,
  showRegister,
  showDashboard,
  showEvents,
  showCreateEvent,
  showEditEvent,
  showDeleteEvent,
  renderNotFound
} from './views.js';

// Static routes (URL → view)
const routes = {
  '#/login': showLogin,
  '#/register': showRegister,
  '#/dashboard': showDashboard,
  '#/dashboard/events': showEvents,
  '#/dashboard/events/create': showCreateEvent,
  '#/dashboard/events/delete': showDeleteEvent,
};

// Main router function
export function router() {
  const path = location.hash || '#/login'; // Get current hash route
  const user = auth.getUser(); // Get current user

  // Protect private routes (only if logged in)
  if (path.startsWith('#/dashboard') && !auth.isAuthenticated()) {
    location.hash = '#/login'; // Redirect to login if not authenticated
    return;
  }

  // Prevent access to login/register if already logged in
  if ((path === '#/login' || path === '#/register') && auth.isAuthenticated()) {
    location.hash = '#/dashboard'; // Redirect to dashboard
    return;
  }

  // Dynamic route: edit event
  if (path.startsWith('#/dashboard/events/edit/')) {
    showEditEvent();
    return;
  }

  // Static route found
  const view = routes[path];
  if (view) {
    view(); // Show the correct view
  } else {
    renderNotFound(); // Show 404 if route not found
  }
}
