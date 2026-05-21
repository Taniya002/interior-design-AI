import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

export function AuthModal({
  open,
  onClose,
  initialMode = "login",
}: {
  open: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}) {
  const { user } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (open) setMode(initialMode); }, [open, initialMode]);
  useEffect(() => { if (open && user) onClose(); }, [user, open, onClose]);
  useEffect(() => { if (open) { setErr(""); setBusy(false); } }, [open, mode]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) await updateProfile(cred.user, { displayName: name });
      }
    } catch (e: any) {
      setErr(e?.message ?? "Authentication failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch md:items-center justify-center md:px-4 bg-foreground/40 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-card md:rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2 relative min-h-screen md:min-h-0">
        <button onClick={onClose} aria-label="Close"
          className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full bg-card/80">×</button>

        {/* LEFT: Form */}
        <div className="p-8 sm:p-10">
          <h2 className="text-3xl font-display font-bold text-primary">RoomAI</h2>
          <h3 className="mt-6 font-display text-2xl text-foreground">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            {mode === "login" ? "Sign in to continue redesigning." : "Start transforming your rooms today."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-sm text-muted-foreground">Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            )}
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Password</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <button type="submit" disabled={busy}
              className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-md hover:opacity-90 transition disabled:opacity-50">
              {busy ? "Please wait…" : mode === "login" ? "Login" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === "login" ? (
              <>Don't have an account?{" "}
                <button onClick={() => setMode("register")} className="text-primary hover:underline font-medium">Register</button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button onClick={() => setMode("login")} className="text-primary hover:underline font-medium">Login</button>
              </>
            )}
          </p>
        </div>

        {/* RIGHT: Image placeholder */}
       <div className="hidden md:block min-h-[500px] overflow-hidden rounded-r-2xl">
  <img
    src="https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aW50ZXJpb3IlMjBkZXNpZ258ZW58MHx8MHx8fDA%3D"
    alt="Beautiful Interior"
    className="w-full h-full object-cover"
  />
</div>
      </div>
    </div>
  );
}
