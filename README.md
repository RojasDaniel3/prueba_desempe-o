# 📅 Event Management SPA


#Name: Daniel Fernando Rojas Echeverria
#Clan: Ciénaga
#Email: dani-rojas0206@hotmail.com
#CC 1002210129



This is a Single Page Application (SPA) for managing events with authentication, protected routes, and role-based access. It uses **vanilla JavaScript**, **SweetAlert2**, and a fake REST API via **json-server**.

## 🚀 Features

- Login and register with roles (`admin`, `visitor`)
- Admin can:
  - Create, edit, delete events
- Visitors can:
  - View available events
  - Join or leave events
  - View their registered events
- Alerts with SweetAlert2
- SPA routing with `location.hash`
- Uses `localStorage` for session

## 📁 Project Structure

```
📦 /project-root
├── api.js
├── auth.js
├── router.js
├── views.js
├── db.json
└── index.html
```

## 🛠️ Setup

### 1. Install json-server

```bash
npm install -g json-server
```

### 2. Run the fake API

```bash
json-server --watch db.json --port 3000
```

### 3. Open index.html

Use Live Server (VS Code) or open manually in browser.

## 🧪 Test Users

| Role    | Email              | Password |
|---------|--------------------|----------|
| Admin   | dani@hotmail.com   | 123456   |
| Visitor | ruperto@hotmail.com   | 123456   |

More users in `db.json`.

## ✅ Dependencies

- SweetAlert2
- json-server


