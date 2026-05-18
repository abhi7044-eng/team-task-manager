# 📋 Team Task Manager

A full-stack web application for managing team projects and tasks with role-based access control.
Built with **React + Vite** on the frontend and **Node.js + Express + MongoDB** on the backend.

---

## 🔗 Live Links

| | Link |
|--|------|
| 🌐 Live App | https://team-task-manager-1-57jt.onrender.com |
| 💻 GitHub Repo | https://github.com/abhi7044-eng/team-task-manager |
| 🎥 Demo Video | https://your-video-link-here |

---

## 👨‍💻 Developer

**Name:** Abhishek Kumar
**Email:** abhishekkumar727783@gmail.com
**GitHub:** https://github.com/abhi7044-eng

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 + Vite | UI framework and build tool |
| Tailwind CSS | Styling and responsive design |
| Axios | HTTP requests to backend API |
| React Router DOM v6 | Client-side routing |
| React Hot Toast | Toast notifications |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | JavaScript runtime |
| Express.js | Web framework for REST APIs |
| MongoDB Atlas | Cloud NoSQL database |
| Mongoose | MongoDB object modeling |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password encryption |

### Deployment
| Service | Purpose |
|---------|---------|
| Render.com | Backend + Frontend hosting |
| MongoDB Atlas | Cloud database (Cluster0) |
| GitHub | Source code repository |

---

## ✅ Features

### Authentication
- Signup with name, email, password, and role selection
- Login with JWT token — stored in browser localStorage
- Protected routes — redirects to login if not authenticated
- Passwords encrypted with bcryptjs — never stored as plain text

### Role-Based Access Control
| Feature | Admin | Member |
|---------|-------|--------|
| Create projects | ✅ | ❌ |
| Add members to projects | ✅ | ❌ |
| Create tasks | ✅ | ❌ |
| Assign tasks to members | ✅ | ❌ |
| Delete projects and tasks | ✅ | ❌ |
| View own projects | ✅ | ✅ |
| View assigned tasks | ✅ | ✅ |
| Update task status | ✅ | ✅ (own tasks only) |

### Dashboard
- Total tasks count
- To Do tasks count
- In Progress tasks count
- Done tasks count
- Overdue tasks alert
- Tasks per member with progress bar

### Project Management
- Create, edit, delete projects (Admin)
- Add and remove team members from projects
- Members see only their assigned projects

### Task Management
- Create tasks with title, description, project, assignee, priority, and due date
- Priority levels — Low, Medium, High (color coded)
- Status — To Do, In Progress, Done
- Overdue detection — highlighted in red with warning icon
- Members can only update status of their own tasks

---

## 📁 Project Structure

```
team-task-manager/
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # signup, login, getMe
│   │   ├── projectController.js    # CRUD for projects
│   │   ├── taskController.js       # CRUD for tasks + dashboard stats
│   │   └── userController.js       # get all users
│   │
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT verify + adminOnly check
│   │
│   ├── models/
│   │   ├── User.js                 # name, email, password, role
│   │   ├── Project.js              # title, description, members, createdBy
│   │   └── Task.js                 # title, description, priority, status, dueDate, assignedTo, projectId
│   │
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth
│   │   ├── projectRoutes.js        # /api/projects
│   │   ├── taskRoutes.js           # /api/tasks
│   │   └── userRoutes.js           # /api/users
│   │
│   ├── .env.example
│   ├── package.json
│   └── server.js                   # entry point
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js            # axios instance with token interceptor
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx     # global auth state
    │   │
    │   ├── components/
    │   │   └── Layout.jsx          # sidebar + mobile hamburger menu
    │   │
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Projects.jsx
    │   │   └── Tasks.jsx
    │   │
    │   ├── App.jsx                 # routes + protected route logic
    │   ├── main.jsx
    │   └── index.css
    │
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 📡 API Endpoints

### Auth Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/signup | Public | Register new user |
| POST | /api/auth/login | Public | Login and get JWT token |
| GET | /api/auth/me | Private | Get current logged in user |

### Project Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/projects | Private | Get all projects |
| POST | /api/projects | Admin only | Create new project |
| GET | /api/projects/:id | Private | Get single project |
| PUT | /api/projects/:id | Admin only | Update project |
| DELETE | /api/projects/:id | Admin only | Delete project |

### Task Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/tasks/dashboard | Private | Get dashboard stats |
| GET | /api/tasks | Private | Get all tasks |
| POST | /api/tasks | Admin only | Create new task |
| PUT | /api/tasks/:id | Private | Update task (member can only update status) |
| DELETE | /api/tasks/:id | Admin only | Delete task |

### User Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/users | Admin only | Get all users for assignment dropdown |

---

## ⚙️ Environment Variables

### Backend — `backend/.env`
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.rztjbgf.mongodb.net/teamtaskmanager?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
```

### Frontend — `frontend/.env` (only needed for production)
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

## 🚀 Local Setup Instructions

### Requirements
- Node.js v18 or above
- npm
- MongoDB Atlas account (free) or local MongoDB

### Step 1 — Clone the repository
```bash
git clone https://github.com/abhi7044-eng/team-task-manager.git
cd team-task-manager
```

### Step 2 — Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:
```
PORT=5000
MONGO_URI=mongodb+srv://taskuser:Task1234@cluster0.rztjbgf.mongodb.net/teamtaskmanager?retryWrites=true&w=majority
JWT_SECRET=mySuperSecretKey123
```

Start the backend:
```bash
npm run dev
```

Backend runs on: http://localhost:5000

### Step 3 — Setup Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

---

## 🚂 Deployment Steps (Render.com)

### Backend Deployment
1. Go to https://render.com and sign up with GitHub
2. Click **New** → **Web Service**
3. Connect your GitHub repo → select **team-task-manager**
4. Fill in:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add environment variables:
   - `MONGO_URI` → your MongoDB Atlas connection string
   - `JWT_SECRET` → your secret key
6. Click **Create Web Service**
7. Copy the backend URL after deployment

### Frontend Deployment
1. Click **New** → **Static Site**
2. Connect same GitHub repo
3. Fill in:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add environment variable:
   - `VITE_API_URL` → your backend URL + `/api`
5. Click **Create Static Site**

### MongoDB Atlas Setup
1. Go to https://cloud.mongodb.com
2. Create a free M0 cluster
3. Go to **Database Access** → create a database user
4. Go to **Network Access** → add `0.0.0.0/0` to allow all IPs
5. Click **Connect** → **Drivers** → copy the connection string

---

## 🗄️ Database Schema

### User
```json
{
  "name": "String - required",
  "email": "String - required, unique",
  "password": "String - required, hashed with bcryptjs",
  "role": "String - enum: admin, member - default: member"
}
```

### Project
```json
{
  "title": "String - required",
  "description": "String",
  "createdBy": "ObjectId - ref: User",
  "members": ["ObjectId - ref: User"]
}
```

### Task
```json
{
  "title": "String - required",
  "description": "String",
  "projectId": "ObjectId - ref: Project - required",
  "assignedTo": "ObjectId - ref: User - required",
  "priority": "String - enum: Low, Medium, High - default: Medium",
  "status": "String - enum: To Do, In Progress, Done - default: To Do",
  "dueDate": "Date - required"
}
```

---

## 📱 Mobile Responsive

The app is fully responsive and works on all screen sizes:
- Hamburger menu on mobile — tap 3 lines to open sidebar
- Sidebar slides in smoothly with overlay
- Dashboard cards show 2 per row on mobile
- Tables scroll horizontally on small screens

---

## 🔐 Security

- Passwords are hashed using **bcryptjs** before saving to database
- JWT tokens expire in **7 days**
- All private routes are protected by **authMiddleware**
- Admin-only routes have an additional **adminOnly** middleware check
- Environment variables are used for all sensitive data — never hardcoded

---

## 📝 Notes

- This project was built as a full-stack assignment
- Code is beginner-friendly with comments throughout
- No unnecessary features — kept simple and clean
- Proper error handling and loading states on all pages
- Toast notifications for all user actions
