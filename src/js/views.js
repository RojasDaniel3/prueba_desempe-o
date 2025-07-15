import { api } from './api.js';
import { auth } from './auth.js';
import { router } from './router.js';
import Swal from 'sweetalert2';

// Page not found
export function renderNotFound() {
  document.getElementById('app').innerHTML = `
    <h2>Page not found</h2>
    <button onclick="location.hash = '#/dashboard'">Back</button>
  `;
}

// Login page
export async function showLogin() {
  document.getElementById('app').innerHTML = `
    <section id="login">
      <div class="login-container">
        <form id="login-form" class="login-form card">
          <h2>Login</h2>
          <input type="email" id="e" placeholder="Email">
          <input type="password" id="p" placeholder="Password">
          <button>Log in</button>
          <p class="login-switch">No account? <a href="#/register" data-link>Create one</a></p>
        </form>
      </div>
    </section>`;

  // Handle login form submit
  document.getElementById('login-form').onsubmit = async e => {
    e.preventDefault();
    try {
      await auth.login(e.target.e.value, e.target.p.value);
      location.hash = '#/dashboard';
      router();
    } catch (err) {
      alert(err.message);
    }
  };
}

// Register page
export async function showRegister() {
  document.getElementById('app').innerHTML = `
    <section id="register">
      <div class="register-container">
        <form id="register-form" class="login-form card">
          <h2>Create Account</h2>
          <input placeholder="Name" id="name">
          <input placeholder="Email" id="email">
          <input type="password" placeholder="Password" id="password">
          <button>Create Account</button>
          <p class="register-switch">Already have an account? <a href="#/login" data-link>Log in</a></p>
        </form>
        <button onclick="location.hash = '#/dashboard'">Back</button>
      </div>
    </section>`;

  // Handle register form submit
  document.getElementById('register-form').onsubmit = async e => {
    e.preventDefault();
    try {
      await auth.register(e.target.name.value, e.target.email.value, e.target.password.value, "visitor");
      location.hash = '#/dashboard';
      router();
    } catch (err) {
      alert(err.message);
    }
  };
}

// Dashboard for both admin and visitor
export async function showDashboard() {
  const u = auth.getUser(); // Get current user

  document.getElementById('app').innerHTML = `
    <section class="dashboard">
      <div class="dashboard-header">
        <h2>Welcome, ${u.name} (${u.role})</h2>
        <button id="out">Logout</button>
      </div>
      <nav id="crud">
        <a href="#/dashboard/events" data-link>Show events</a>
        ${u.role === 'admin' ? `
          <a href="#/dashboard/events/create" data-link>Create an event</a>
          <a href="#/dashboard/events/delete" data-link>Delete an event</a>
        ` : ''}
      </nav>
    </section>
  `;

  // Logout action
  document.getElementById('out').onclick = auth.logout;

  // Handle internal links
  document.querySelectorAll('[data-link]').forEach(a => {
    a.onclick = e => {
      e.preventDefault();
      location.hash = a.getAttribute('href');
      router();
    };
  });
}

// Show all events and registration
export async function showEvents() {
  const user = auth.getUser(); // Get current user
  const events = await api.get('/events'); // Get all events

  // Filter events where the visitor is already registered
  const registeredEvents = events.filter(e => e.enrolled && e.enrolled.includes(user.email));

  document.getElementById('app').innerHTML = `
    <h2>Available Events</h2>
    <ul>
      ${events.map(e => `
        <li>
          ${e.title || 'Untitled'} (${e.capacity || 0} slots) — Host: ${e.instructor || 'N/A'}
          ${user.role === 'admin' ? `
            <button onclick="location.hash = '#/dashboard/events/edit/${e.id}'">Edit</button>
          ` : ''}
          ${user.role === 'visitor' || user.role === 'student' ? `
            <button class="enroll-btn" data-id="${e.id}">Join</button>
          ` : ''}
        </li>
      `).join('')}
    </ul>

    ${user.role !== 'admin' ? `
      <h3 class="centered-header">Your Registered Events</h3>
      <ul>
        ${registeredEvents.length > 0 ? 
          registeredEvents.map(e => `
            <li>
              ${e.title || 'Untitled'} — Host: ${e.instructor || 'N/A'}
              <button class="unregister-btn" data-id="${e.id}">Unregister</button>
            </li>
          `).join('') 
          : '<li>No events registered.</li>'}
      </ul>
    ` : ''}

    <button onclick="location.hash = '#/dashboard'">Back</button>
  `;

  // If the user is a visitor
  if (user.role === 'visitor') {
    // Join an event
    document.querySelectorAll('.enroll-btn').forEach(btn => {
      btn.onclick = async () => {
        const eventId = btn.dataset.id;
        const event = await api.get('/events/' + eventId);

        // If the event is full
        if (event.enrolled && event.enrolled.length >= event.capacity) {
          Swal.fire({
            title: "Full!",
            icon: "error",
            draggable: true
          });
          return;
        }

        // If there is space, join
        if (!event.enrolled) event.enrolled = [];
        event.enrolled.push(user.email);
        event.capacity -= 1;
        await api.put('/events/' + eventId, event);

        Swal.fire({
          title: "Join in!",
          icon: "success",
          draggable: true
        });
        showEvents();
      };
    });

    // Unregister from an event
    document.querySelectorAll('.unregister-btn').forEach(btn => {
      btn.onclick = async () => {
        const eventId = btn.dataset.id;
        const event = await api.get('/events/' + eventId);

        if (!event.enrolled || !event.enrolled.includes(user.email)) {
          alert('You are not registered for this event.');
          return;
        }

        // Remove visitor
        event.enrolled = event.enrolled.filter(email => email !== user.email);
        event.capacity += 1;
        await api.put('/events/' + eventId, event);

        Swal.fire({
          title: "Delete it!",
          icon: "success",
          draggable: true
        });
        showEvents();
      };
    });
  }
}

// Create new event (admin only)
export function showCreateEvent() {
  document.getElementById('app').innerHTML = `
    <h2>Create Event</h2>
    <form id="f">
      <input placeholder="Title" id="title">
      <input placeholder="Host" id="instructor">
      <input type="number" placeholder="Capacity" id="capacity">
      <button>Save</button>
    </form>
    <button onclick="location.hash = '#/dashboard'">Back</button>
  `;

  // Save event
  document.getElementById('f').onsubmit = async e => {
    e.preventDefault();
    const data = {
      title: e.target.title.value,
      instructor: e.target.instructor.value,
      capacity: parseInt(e.target.capacity.value)
    };
    await api.post('/events', data);
    location.hash = '#/dashboard/events';
    router();
  };
}

// Edit event (admin only)
export async function showEditEvent() {
  const user = auth.getUser();
  if (user.role !== 'admin') return renderNotFound();

  const eventId = location.hash.split('/').pop();
  const event = await api.get('/events/' + eventId);
  if (!event) return renderNotFound();

  document.getElementById('app').innerHTML = `
    <h2>Edit Event</h2>
    <form id="f">
      <input id="title" placeholder="Title" value="${event.title}">
      <input id="instructor" placeholder="Host" value="${event.instructor}">
      <input type="number" id="capacity" placeholder="Capacity" value="${event.capacity}">
      <button>Save</button>
    </form>
    <button onclick="location.hash = '#/dashboard'">Back</button>
  `;

  // Save updated event
  document.getElementById('f').onsubmit = async e => {
    e.preventDefault();
    const updated = {
      title: e.target.title.value,
      instructor: e.target.instructor.value,
      capacity: parseInt(e.target.capacity.value)
    };
    await api.put('/events/' + eventId, updated);
    location.hash = '#/dashboard/events';
    router();
  };
}

// Delete event (admin only)
export async function showDeleteEvent() {
  const user = auth.getUser();
  if (user.role !== 'admin') return renderNotFound();

  const events = await api.get('/events');

  document.getElementById('app').innerHTML = `
    <h2>Delete Event</h2>
    <ul>
      ${events.map(e => `
        <li>
          ${e.title} —
          <button data-id="${e.id}" class="delete-btn">Delete</button>
        </li>
      `).join('')}
    </ul>
    <button onclick="location.hash = '#/dashboard'">Back</button>
  `;

  // Confirm and delete event
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;

      const result = await Swal.fire({
        title: 'Are u sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        await api.delete('/events/' + id);
        await Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success'
        });
        showDeleteEvent();
      }
    };
  });
}
