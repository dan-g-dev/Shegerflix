# ShegerFlix

*Ethiopia's Home for Stories.*

ShegerFlix is a full-stack, Netflix-style browsing platform for Ethiopian movies and series. Users can browse and search titles, save a personal watch list, and keep a watch history. Admins can manage the catalogue.

**Live demo:** https://shegerflix.vercel.app

> The backend runs on free-tier hosting, so the first request after a period of inactivity can be slow. If titles do not appear straight away, wait a moment and refresh.

![ShegerFlix home page](docs/home.jpg)

## Try it

Sign in with the demo user account:

- **Email:** `sara@shegerflix.et`
- **Password:** `Password123!`

Or register your own account.

## Features

- Home page with a featured hero and rows such as Popular in Ethiopia, Ethiopian Movies, and Ethiopian Series
- Search, and filtering by type, language, and genre
- Title detail pages with poster, backdrop, synopsis, genres, and rating
- Registration and login with JWT authentication
- Personal **My List** (add and remove titles)
- Watch history (the Play button records a title as watched)
- Admin dashboard to create, edit, and delete titles, assign genres, and view users (admin role required)
- Responsive layout for mobile and desktop

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 18, Vite, React Router, Tailwind CSS, Axios |
| Backend | Node.js, Express.js, REST API, express-validator |
| Database | MySQL (`mysql2`), 6 tables |
| Auth | JSON Web Tokens, bcrypt password hashing, role-based authorization |
| Hosting | Frontend on Vercel |

## How it works

```
React SPA  ->  Express REST API (/api)  ->  MySQL
               JWT middleware + role checks
```

- Passwords are hashed with bcrypt, and the server signs a JWT on login.
- An Axios interceptor on the frontend attaches the token to every request.
- Protected API routes use `requireAuth`; admin routes also use `requireAdmin`, so roles are enforced on the server.
- Protected frontend routes redirect unauthenticated users to the login page.

### Database

`users`, `genres`, `titles`, `title_genres` (many-to-many), `my_list`, and `watch_history`, with foreign keys. See `backend/db/schema.sql`.

### API overview

| Group | Endpoints |
| --- | --- |
| `/api/auth` | `POST /register`, `POST /login`, `GET /me` |
| `/api/titles` | `GET /`, `/collections`, `/search?q=`, `/genres`, `/:slug` |
| `/api/mylist` (auth) | `GET /`, `POST /`, `DELETE /:titleId` |
| `/api/history` (auth) | `GET /`, `GET /continue-watching`, `POST /` |
| `/api/admin` (admin) | `POST/PUT/DELETE /titles`, `GET /users` |

## Run locally

You need Node.js 18+ and MySQL 8.

```bash
# 1. Database
mysql -u root -p < backend/db/schema.sql

# 2. Backend (http://localhost:5000)
cd backend
npm install
cp .env.example .env     # set DB_PASSWORD and JWT_SECRET
npm run seed             # demo users and titles
npm run dev

# 3. Frontend (http://localhost:5173)
cd frontend
npm install
cp .env.example .env
npm run dev
```

For a deployed frontend, set `VITE_API_URL` to your API's `/api` URL and set `CLIENT_URL` on the backend to the frontend's address.

## Known limitations

- There is no real video player yet: Play records a title in the watch history rather than streaming a video.
- No automated tests yet.
- Poster images are used for demonstration only; they belong to their respective owners.
