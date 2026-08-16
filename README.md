# DSVV Unified Notice & Circular Aggregator

A comprehensive MERN stack platform designed for Dev Sanskriti Vishwavidyalaya (DSVV) to modernize the management, distribution, and consumption of notices and circulars.

## Features

- **Multi-Role RBAC:** Dedicated portals for Students, Department Admins, and Super Admins.
- **AI-Powered Summaries:** Integrated AI engine to categorize notices and provide concise summaries (Demo/OpenAI/Gemini extensible).
- **Targeted Notifications:** Intelligent distribution system that sends notices only to relevant academic cohorts (by School, Department, Course, Semester, Section).
- **Automated Notice Ingestion:** Scrapes and auto-ingests circulars from predefined official DSVV web properties.
- **Analytics Dashboard:** System-wide and department-level engagement metrics (views, read rates).
- **Security & Audit Logging:** Immutable trail of administrative actions.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router DOM, Recharts, Lucide Icons, Axios.
- **Backend:** Node.js, Express, MongoDB, Mongoose.
- **Authentication:** JWT, bcrypt.
- **Services:** Multer (File Uploads), PDF-Parse (Text extraction).

## Prerequisites

- Node.js (v16+)
- MongoDB instance (local or Atlas)

## Getting Started

1. **Clone the repository.**
2. **Install dependencies:**
   ```bash
   # Install root and backend dependencies
   npm run install:all
   ```
3. **Environment Variables:**
   Copy `.env.example` to `backend/.env` and configure your MongoDB URI, JWT Secret, and (optionally) AI API Keys.
4. **Seed Database:**
   ```bash
   cd backend && npm run seed
   ```
5. **Run the Application:**
   ```bash
   # Runs both frontend and backend concurrently
   npm run start
   ```

## Architecture Details

- `server/src/services/aiService.js` uses a factory pattern to switch between a `DemoAIProvider` (keyword-based simulation) and a real LLM provider based on `.env` configuration.
- The Targeting engine (`TargetingService`) recursively expands target audiences, so sending to "School of Indology" reaches all its departments, courses, and students.

## License
MIT License
