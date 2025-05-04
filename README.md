Yooo nice deployment! 🔥 Clean and snappy, love the Vercel flex. Since you're using **Tailwind CSS** and not MUI/Bootstrap, and your hosted app is live at [`countries-wheat-pi.vercel.app`](https://countries-wheat-pi.vercel.app/), here's your updated `README.md` with all the right vibes:

---

````markdown
# 🌍 REST Countries Explorer

A sleek, responsive React + TypeScript app to explore countries using the [REST Countries API](https://restcountries.com/). Built for the **SE3040 – Application Frameworks** course at **SLIIT**. Features Firebase authentication and the ability to bookmark your favorite countries!

## 🔗 Live Demo

👉 [Check it out here!](https://countries-wheat-pi.vercel.app/)

---

## ⚙️ Features

- 🔐 **User Login** with Firebase Auth
- 🌎 Browse All Countries
- 🔍 Search by Country Name
- 🗺️ Filter by Region & Language
- 📌 **Bookmark Your Favorites** (saved via Firestore)
- 📱 Fully Responsive UI
- ⚛️ SPA built with React Router + Hooks
- 🎯 TypeScript + Tailwind CSS for clean structure and styling
- 🧪 Unit & integration tested with Jest + RTL

---

## 🛠️ Tech Stack

| Tool/Tech          | Role                                 |
| ------------------ | ------------------------------------ |
| React + Vite       | Frontend Framework & Dev Environment |
| TypeScript         | Static typing for better DX          |
| Tailwind CSS       | Utility-first styling                |
| Firebase           | Auth + Firestore DB                  |
| React Router       | Page navigation                      |
| REST Countries API | Country data source                  |
| Jest + RTL         | Testing framework                    |

---

## 🔐 Firebase Authentication

- Supports email/password login
- Authenticated users can save their favorite countries
- Favorites persist across sessions using Firebase Firestore

---

## 📦 API Endpoints Used

- `GET /all` – List all countries
- `GET /name/{name}` – Search by country name
- `GET /region/{region}` – Filter by region
- `GET /alpha/{code}` – Get full details

---

## 🧠 How It Works

1. App fetches data from REST Countries API and caches it locally
2. Users can filter/search countries or click to view details
3. After login, users can bookmark countries as favorites
4. Favorites are stored and synced with Firestore

---

## 🧑‍💻 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/SE1020-IT2070-OOP-DSA-25/af-2-it22311290.git
```
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Firebase

- Create a Firebase project
- Enable **Email/Password Auth** + **Firestore DB**
- Add `.env` file with your config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=sender_id
VITE_FIREBASE_APP_ID=app_id
```

### 4. Start the Dev Server

```bash
npm run dev
```

---

## 🧪 Running Tests

```bash
npm test
```

Covers:

- Component rendering
- API interaction
- User flows (auth, add/remove favorites)

---

---

```

---


```
