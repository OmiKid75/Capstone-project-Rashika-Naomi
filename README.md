# 🔄 SkillSwap

> **Trade skills, not money.**
> A full-stack MERN platform where people exchange what they know — "I'll teach you JavaScript if you teach me Guitar."

---

## 💡 What Is SkillSwap?

SkillSwap is a peer-to-peer skill exchange platform that removes money from the equation. Users create profiles listing skills they can teach and skills they want to learn. The platform matches them with compatible partners, and they send exchange requests to connect.

**Example flow:**
- Alice lists: *Offers → Python* | *Wants → Spanish*
- Bob lists: *Offers → Spanish* | *Wants → Python*
- SkillSwap surfaces this match → they connect and trade knowledge

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS, Axios, React Router |
| Backend | Node.js, Express.js |
| Auth | JWT, bcrypt |
| Database | MongoDB Atlas, Mongoose |

---

## 📁 Project Structure

```
SkillSwap/
│
├── client/                     → React frontend (Vite)
│   └── src/
│       ├── pages/              → Route-level page components
│       ├── components/         → Reusable UI components
│       ├── services/
│       │   └── api.js          → Axios instance & API calls
│       ├── App.jsx
│       └── main.jsx
│
└── server/                     → Node/Express backend
    ├── config/
    │   └── db.js               → MongoDB connection
    ├── models/
    │   └── User.js             → Mongoose user schema
    ├── routes/
    │   └── auth.routes.js      → Auth route definitions
    ├── controllers/
    │   └── auth.controller.js  → Route handler logic
    ├── middleware/
    │   └── auth.middleware.js  → JWT verification
    └── server.js               → Entry point
```

---

## 🛠️ Setup & Installation

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (free tier works)
- Git

---

### Step 1 — Clone & create root folder

```bash
git clone https://github.com/your-username/skillswap.git
cd skillswap
```

Or start from scratch:

```bash
mkdir SkillSwap && cd SkillSwap
```

---

### Step 2 — Backend setup

```bash
mkdir server && cd server
npm init -y
```

Install dependencies:

```bash
npm install express mongoose dotenv cors bcryptjs jsonwebtoken
npm install --save-dev nodemon
```

Create folder structure:

```bash
mkdir config models routes controllers middleware
touch server.js config/db.js models/User.js \
      routes/auth.routes.js controllers/auth.controller.js \
      middleware/auth.middleware.js
```

Update `server/package.json` scripts:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

---

### Step 3 — Frontend setup

```bash
cd ..
npm create vite@latest client
# Select: React → JavaScript
cd client && npm install
```

Install frontend packages:

```bash
npm install axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

### Step 4 — Configure Tailwind CSS

`tailwind.config.js`:

```js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

`src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### Step 5 — Create frontend folders

```bash
cd src
mkdir pages components services
touch services/api.js
```

---

### Step 6 — Environment variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key_here
```

> ⚠️ **Never commit `.env` to GitHub.**

Create `.gitignore` in the root:

```
node_modules
.env
dist
```

---

### Step 7 — Run the project

**Backend** (terminal 1):

```bash
cd server
npm run dev
# → http://localhost:5000
```

**Frontend** (terminal 2):

```bash
cd client
npm run dev
# → http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login & get JWT | No |
| GET | `/api/users/me` | Get own profile | Yes |
| PUT | `/api/users/me` | Update profile & skills | Yes |
| GET | `/api/users/matches` | Get skill matches | Yes |
| POST | `/api/requests` | Send exchange request | Yes |
| GET | `/api/requests` | View incoming requests | Yes |
| PUT | `/api/requests/:id` | Accept or reject request | Yes |

---

## 🧠 Features Roadmap

### Phase 1 — Authentication
- [x] User registration
- [x] User login
- [x] JWT-protected routes
- [x] Password hashing with bcrypt

### Phase 2 — Profile System
- [ ] Add skills offered
- [ ] Add skills wanted
- [ ] Edit profile info (bio, avatar, location)

### Phase 3 — Matching System ⭐
- [ ] Algorithm to find mutual skill matches
- [ ] Browse matched users
- [ ] Filter by skill category

### Phase 4 — Requests System
- [ ] Send a skill exchange request
- [ ] Accept / reject incoming requests
- [ ] View request history

### Phase 5 — Stretch Goals
- [ ] In-app messaging between matched users
- [ ] Rating & review system after completed exchanges
- [ ] Skill categories & tags
- [ ] Email notifications (Nodemailer)

---

## 🗄️ Database Schema

### User

```js
{
  name: String,
  email: String,           // unique
  password: String,        // hashed
  bio: String,
  location: String,
  avatar: String,          // URL
  skillsOffered: [String], // e.g. ["JavaScript", "Photoshop"]
  skillsWanted:  [String], // e.g. ["Guitar", "Spanish"]
  createdAt: Date
}
```

### ExchangeRequest

```js
{
  from: ObjectId,          // ref: User
  to: ObjectId,            // ref: User
  message: String,
  status: String,          // "pending" | "accepted" | "rejected"
  createdAt: Date
}
```

---

## 🔐 Security Notes

- Passwords are hashed using `bcryptjs` before storage — plain-text passwords are never saved
- JWT tokens expire after 7 days
- Protected routes require a valid `Authorization: Bearer <token>` header
- CORS is configured to allow only the frontend origin in production
- MongoDB Atlas IP whitelist should be restricted in production

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add skill matching algorithm"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT — free to use, modify, and distribute.

---

> Built to prove that knowledge is the most valuable currency.