import { initializeApp } from "firebase/app"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_SECRET_KEY,
  authDomain: "mern-blog-ab4a8.firebaseapp.com",
  projectId: "mern-blog-ab4a8",
  storageBucket: "mern-blog-ab4a8.appspot.com",
  messagingSenderId: "62055374108",
  appId: "1:62055374108:web:9fa283eb682d6027baeed9",
}

export const app = initializeApp(firebaseConfig)
