# 📋 Team Task Manager

A full-stack web application for managing team projects and tasks with role-based access control.

Built with **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## 🚀 Features

- 🔐 **JWT Authentication** — Signup, Login, Protected routes
- 👑 **Role-Based Access** — Admin and Member roles with different permissions
- 📁 **Project Management** — Create projects, add team members
- ✅ **Task Management** — Assign tasks, track status (Pending / In Progress / Completed)
- 📊 **Dashboard** — Visual stats: total, pending, completed, overdue tasks
- 🔔 **Toast Notifications** — Real-time feedback on all actions

---

## 🗂️ Project Structure

```
team-task-manager/
├── backend/
│   ├── config/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT + role check
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js           # Axios instance with token interceptor
    │   ├── context/
    │   │   └── AuthContext.jsx    # Global auth state
    │   ├── components/
    │   │   └── Layout.jsx         # Sidebar layout
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Projects.jsx
    │   │   └── Tasks.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 📡 API Routes

### Auth
| Method | Endpoint         | Access  | Description    |
|--------|-----------------|---------|----------------|
| POST   | /api/auth/signup | Public  | Register user  |
| POST   | /api/auth/login  | Public  | Login user     |
| GET    | /api/auth/me     | Private | Get current user |

### Projects
| Method | Endpoint            | Access       | Description        |
|--------|--------------------|--------------|--------------------|
| GET    | /api/projects       | Private      | List projects      |
| POST   | /api/projects       | Admin only   | Create project     |
| GET    | /api/projects/:id   | Private      | Get one project    |
| PUT    | /api/projects/:id   | Admin only   | Update project     |
| DELETE | /api/projects/:id   | Admin only   | Delete project     |

### Tasks
| Method | Endpoint             | Access       | Description           |
|--------|---------------------|--------------|-----------------------|
| GET    | /api/tasks/dashboard | Private      | Dashboard stats       |
| GET    | /api/tasks           | Private      | List tasks            |
| POST   | /api/tasks           | Admin only   | Create task           |
| PUT    | /api/tasks/:id       | Private      | Update task (limited for member) |
| DELETE | /api/tasks/:id       | Admin only   | Delete task           |

### Users
| Method | Endpoint   | Access     | Description       |
|--------|-----------|------------|-------------------|
| GET    | /api/users | Admin only | List all users    |

---

## 🔐 Roles

| Feature                  | Admin | Member |
|--------------------------|-------|--------|
| Create projects          | ✅    | ❌     |
| Add members to projects  | ✅    | ❌     |
| Create & assign tasks    | ✅    | ❌     |
| View own projects        | ✅    | ✅     |
| View assigned tasks      | ✅    | ✅     |
| Update task status       | ✅    | ✅ (own tasks only) |

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/teamtaskmanager
JWT_SECRET=your_super_secret_jwt_key_here
```

### Frontend (`frontend/.env`) — only needed for production

```env
VITE_API_URL=https://your-backend.railway.app/api
```

---

## 🛠️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/team-task-manager.git
cd team-task-manager
```

### 2. Setup Backend

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET

npm run dev   # Starts on http://localhost:5000
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install

npm run dev   # Starts on http://localhost:5173
```

### 4. Open in Browser

Navigate to `http://localhost:5173`

---

## 🚂 Deploy on Railway

### Deploy Backend

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select the `backend` folder (or root if separate)
4. Add environment variables:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a random secret string
   - `PORT` — Railway sets this automatically
5. Click Deploy

### Deploy Frontend

1. In Railway, create a new service in the same project
2. Select the `frontend` folder
3. Add environment variable:
   - `VITE_API_URL` — your deployed backend URL + `/api`
4. Set build command: `npm run build`
5. Set start command: `npm run preview`

---

## 📝 License

MIT — Free to use for learning and projects.
