import axios from "axios";
import { auth } from "./firebase";

// Backend base URL
export const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000" 
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken(false);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token expire hone pe auto refresh
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      !original._retry &&
      auth.currentUser
    ) {
      original._retry = true;
      const token = await auth.currentUser.getIdToken(true);
      original.headers.Authorization = `Bearer ${token}`;
      return api(original);
    }
    return Promise.reject(error);
  }
);

// Room image Cloudinary pe upload karo
// Returns: { publicUrl: string }
export async function uploadRoom(file: File): Promise<{ publicUrl: string }> {
  const fd = new FormData();
  fd.append("roomImage", file);
  const { data } = await api.post("/api/upload-room", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data as { publicUrl: string };
}

// AI se room design generate karo
// Returns: { generatedImageUrl: string }
export async function generateDesign(
  roomImageUrl: string,
  theme: string
): Promise<{ generatedImageUrl: string }> {
  const { data } = await api.post("/api/interior/generate", {
    roomImageUrl,
    theme,
  });
  return data as { generatedImageUrl: string };
}

// Available themes fetch karo
// Returns: { themes: string[] }
export async function fetchThemes(): Promise<{ themes: string[] }> {
  const { data } = await api.get("/api/interior/themes");
  return data as { themes: string[] };
}

// Complete flow — upload + generate ek saath
export async function uploadAndGenerate(
  file: File,
  theme: string
): Promise<{ originalRoom: string; generatedImageUrl: string }> {
  // Step 1: Image upload karo
  const { publicUrl } = await uploadRoom(file);

  // Step 2: Design generate karo
  const { generatedImageUrl } = await generateDesign(publicUrl, theme);

  return {
    originalRoom: publicUrl,
    generatedImageUrl,
  };
}