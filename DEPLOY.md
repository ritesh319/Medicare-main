# Deploy: MongoDB Atlas + Render (backend) + Vercel (frontend)

Backend env vars (Render):
- MONGODB_URI        = your Atlas connection string
- MONGODB_DATABASE   = hospital_db
- JWT_SECRET         = random string, 32+ characters
- CORS_ALLOWED_ORIGINS = https://YOUR-APP.vercel.app  (no trailing slash)
- ADMIN_PASSWORD     = strong password for admin@hospital.com
- SEED_SAMPLE_DATA   = false

Frontend env var (Vercel):
- VITE_API_BASE_URL  = https://YOUR-BACKEND.onrender.com/api
