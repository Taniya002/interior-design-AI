# 🏠 RoomAI — AI Interior Design Visualizer

Transform any room photo into a beautifully redesigned space instantly using AI!


---

## ✨ Live Demo

> Upload a room photo → Choose a theme → Watch AI redesign your space!

---

## 🚀 Features

- 🔐 **Authentication** — Email/Password + Google Login (Firebase)
- 📸 **Image Upload** — Drag & drop or click to upload
- 🎨 **10+ Design Themes** — Modern Minimalist, Scandinavian, Bohemian, Industrial, and more
- 🤖 **AI Generation** — Powered by Stability AI (image-to-image)
- ☁️ **Cloud Storage** — Images stored on Cloudinary
- 🖼️ **Before/After** — Side by side comparison
- ⬇️ **Download** — Save generated images
- 📱 **Responsive** — Works on all devices

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React + TypeScript | UI Framework |
| TailwindCSS | Styling |
| Firebase Auth | Authentication |
| Axios | API Calls |
| Vite | Build Tool |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Server |
| Firebase Admin SDK | Token Verification |
| Cloudinary | Image Storage |
| Stability AI | Image Generation |
| Multer | File Upload |

---

## 📁 Project Structure

```
interior-design-AI/
├── frontend/                 # React + TypeScript
│   ├── src/
│   │   ├── components/      # UI Components
│   │   ├── lib/             # API & Auth utilities
│   │   └── routes/          # Pages
│   └── package.json
│
├── backend/                  # Node.js + Express
│   ├── config/
│   │   └── firebase.js      # Firebase Admin setup
│   ├── middleware/
│   │   └── auth.js          # Token verification
│   ├── routes/
│   │   ├── upload.js        # Cloudinary upload
│   │   └── interior.js      # AI generation
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v22+
- Firebase Account
- Cloudinary Account
- Stability AI Account

---

### 1. Clone the Repository

```bash
git clone https://github.com/Taniya002/interior-design-AI.git
cd interior-design-AI
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
# Luma AI
LUMAAI_API_KEY=your_luma_api_key

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stability AI
STABILITY_API_KEY=your_stability_key

# Server
PORT=3000
FRONTEND_URL=http://localhost:5173
```

Start backend:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Firebase config add karo `src/lib/firebase.ts` mein:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};
```

Start frontend:

```bash
npm run dev
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/api/upload-room` | Upload room image to Cloudinary |
| `GET` | `/api/interior/themes` | Get available themes |
| `POST` | `/api/interior/generate` | Generate AI redesign |

### Generate Request Body:
```json
{
  "roomImageUrl": "https://cloudinary.com/...",
  "theme": "Modern Minimalist"
}
```

### Generate Response:
```json
{
  "success": true,
  "originalRoom": "https://cloudinary.com/...",
  "theme": "Modern Minimalist",
  "generatedImageUrl": "https://cloudinary.com/...",
  "user": "User Name"
}
```

---

## 🎨 Available Themes

| Theme | Theme |
|---|---|
| Modern Minimalist | Scandinavian |
| Bohemian | Industrial |
| Luxury Contemporary | Japandi |
| Coastal | Art Deco |
| Rustic Farmhouse | Mid-Century Modern |

---

## 🔐 Security

- API keys stored in `.env` (never committed)
- Firebase token verification on all protected routes
- File type and size validation
- CORS configured for frontend URL only

---


---

## 🚧 Future Improvements

- [ ] Usage limits per user
- [ ] Payment integration
- [ ] More AI models
- [ ] Room history saved
- [ ] Social sharing
- [ ] Mobile app

---



---

## 📄 License

MIT License — feel free to use this project!

---

> Built with ❤️ using React, Node.js, and AI
