import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBtTEGijwA0FDkp9Tporn4eYg6sDqDm8U0",
  authDomain: "interior-design-ai-af4b9.firebaseapp.com",
  projectId: "interior-design-ai-af4b9",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();
