import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { generateDesign, uploadRoom } from "@/lib/api";
import { AuthModal } from "@/components/AuthModal";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const HERO_IMGS = [
  "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cm9vbXxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHJvb218ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cm9vbXxlbnwwfHwwfHx8MA%3D%3D",
];

const FEATURES = [
 {
  img: "https://plus.unsplash.com/premium_photo-1683133976227-955341ed26b8?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  title: "AI-Powered Redesign",
  text: "Upload your room photo and choose a style. Our AI transforms your space instantly with realistic results.",
  bullets: ["Realistic & premium results", "Keeps original room structure", "Professional quality output"]
},
{
  img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
  title: "10+ Design Styles",
  text: "From Modern Minimalist to Bohemian, choose from 10 premium interior design themes.",
  bullets: ["Modern Minimalist & Scandinavian", "Bohemian & Japandi", "Luxury Contemporary & more"]
},
{
  img: "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJvb20lMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww",
  title: "Instant Results",
  text: "See your room transformed in seconds. Download and share your new design instantly.",
  bullets: ["Generate in under 60 seconds", "Download in high quality", "Before & after comparison"]
},
];

const THEMES = [
  "Modern Minimalist", "Scandinavian", "Bohemian", "Industrial", "Luxury Contemporary",
  "Japandi", "Coastal", "Art Deco", "Rustic Farmhouse", "Mid-Century Modern",
];

function HomePage() {
  const { user, loading, logout } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>(THEMES[0]);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [pendingAction, setPendingAction] = useState<null | "upload" | "generate">(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthOpen(true);
    setMobileNavOpen(false);
  };

  const requireAuth = (action: "upload" | "generate") => {
    if (user) return true;
    setPendingAction(action);
    openAuth("login");
    return false;
  };

  useEffect(() => {
    if (!user || !pendingAction) return;
    if (pendingAction === "upload") inputRef.current?.click();
    if (pendingAction === "generate") void generate();
    setPendingAction(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleFile = (f: File | undefined | null) => {
    setErr("");
    if (!f) return;
    if (!["image/jpeg", "image/png"].includes(f.type)) { setErr("Only JPG or PNG allowed."); return; }
    if (f.size > 5 * 1024 * 1024) { setErr("Max file size is 5MB."); return; }
    setFile(f);
    setResultUrl(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!requireAuth("upload")) return;
    handleFile(e.dataTransfer.files?.[0]);
  };

  const onUploadClick = () => {
    if (!requireAuth("upload")) return;
    inputRef.current?.click();
  };

  const generate = async () => {
    if (!requireAuth("generate")) return;
    if (!file) { setErr("Please upload a room photo first."); return; }
    setErr(""); setGenerating(true);
    try {
      setUploading(true);
     const { publicUrl } = await uploadRoom(file);
setUploading(false);
const { generatedImageUrl } = await generateDesign(publicUrl, theme);
      setResultUrl(generatedImageUrl);
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? e.message ?? "Generation failed");
    } finally { setGenerating(false); setUploading(false); }
  };

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <nav className="border-b border-border bg-background/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-primary tracking-wide">RoomAI</h1>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-3 text-sm">
            {loading ? null : user ? (
              <>
                <span className="text-muted-foreground hidden lg:inline">
                  {user.displayName ?? user.email}
                </span>
                <button onClick={() => logout()} className="px-4 py-2 rounded-md hover:bg-secondary transition min-h-[44px]">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => openAuth("login")}
                  className="px-4 py-2 rounded-md text-foreground hover:bg-secondary transition min-h-[44px]">
                  Login
                </button>
                <button onClick={() => openAuth("register")}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition min-h-[44px]">
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-md hover:bg-secondary transition"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 bg-background flex flex-col md:hidden">
          <div className="h-16 px-4 flex items-center justify-between border-b border-border">
            <h1 className="text-2xl font-display font-bold text-primary">RoomAI</h1>
            <button
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close menu"
              className="w-11 h-11 flex items-center justify-center rounded-md hover:bg-secondary text-2xl"
            >
              ×
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            {user ? (
              <>
                <p className="text-muted-foreground text-center">{user.displayName ?? user.email}</p>
                <button onClick={() => { logout(); setMobileNavOpen(false); }}
                  className="w-full max-w-xs min-h-[52px] rounded-md border border-border hover:bg-secondary transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => openAuth("login")}
                  className="w-full max-w-xs min-h-[52px] rounded-md border border-border text-foreground hover:bg-secondary transition text-base">
                  Login
                </button>
                <button onClick={() => openAuth("register")}
                  className="w-full max-w-xs min-h-[52px] rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition text-base">
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <main>
        {/* Hero */}
<section style={{
  display: 'grid', 
  gridTemplateColumns: '1fr 1fr', 
  alignItems: 'center', 
  padding: '3rem 2rem', 
  maxWidth: '1200px', 
  margin: '0 auto',
  gap: '3rem',
}}>
  
  {/* Left text */}
  <div style={{
    display: 'flex', 
    flexDirection: 'column', 
    gap: '1.5rem',
  }}>
    <h2 className="font-display font-bold leading-tight text-[28px] sm:text-[40px] lg:text-[50px]">
      Transform Your Room with <span className="text-primary">AI</span>
    </h2>
    <p className="text-base text-muted-foreground">
      Upload any room photo and watch AI redesign it instantly.
    </p>
    <button 
      onClick={scrollToUpload}
      style={{width: 'fit-content'}}
      className="bg-primary text-primary-foreground font-medium px-8 py-3.5 rounded-md text-base hover:opacity-90 transition shadow-md min-h-[48px]">
      Get Started
    </button>
  </div>

  {/* Right — 4 images fixed height */}
  <div style={{
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', 
    gap: '10px',
    height: '420px'
  }}>
    <img src={HERO_IMGS[0]} alt="" loading="lazy" style={{
      borderRadius: '16px', 
      objectFit: 'cover', 
      width: '100%',
      height: '220px'
    }} />
    <img src={HERO_IMGS[1]} alt="" loading="lazy" style={{
      borderRadius: '16px', 
      objectFit: 'cover', 
      width: '100%',
      height: '220px',
      marginTop: '20px'
    }} />
    <img src={HERO_IMGS[2]} alt="" loading="lazy" style={{
      borderRadius: '16px', 
      objectFit: 'cover', 
      width: '100%',
      height: '220px'
    }} />
    <img src={HERO_IMGS[3]} alt="" loading="lazy" style={{
      borderRadius: '16px', 
      objectFit: 'cover', 
      width: '100%',
      height: '220px',
      marginTop: '20px'
    }} />
  </div>

</section>
        {/* Features */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-24 space-y-14 sm:space-y-20 lg:space-y-28">
          {FEATURES.map((f, i) => {
            const reversed = i % 2 === 1;
            return (
              <div key={f.title} className="grid md:grid-cols-2 gap-6 md:gap-10 lg:gap-16 items-center">
                <img
                  src={f.img}
                  alt={f.title}
                  loading="lazy"
                  className={`rounded-2xl shadow-lg w-full aspect-[4/3] object-cover ${reversed ? "md:order-2" : ""}`}
                />
                <div className={`space-y-3 sm:space-y-4 text-center md:text-left ${reversed ? "md:order-1" : ""}`}>
                  <h3 className="font-display font-bold text-[24px] sm:text-3xl lg:text-4xl">{f.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">{f.text}</p>
{f.bullets && (
  <ul style={{marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
    {f.bullets.map((b: string) => (
      <li key={b} style={{color: '#1A1A1A', fontSize: '15px'}}>✓ {b}</li>
    ))}
  </ul>
)}
                </div>
              </div>
            );
          })}
        </section>

        {/* Upload */}
        <section ref={uploadSectionRef} className="px-4 sm:px-6 py-10 sm:py-16 lg:py-24">
          <div className="max-w-[600px] mx-auto text-center space-y-6 sm:space-y-8">
            <h3 className="font-display font-bold text-[28px] sm:text-[40px] lg:text-[48px]">
              Ready to Transform Your Room?
            </h3>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              onClick={onUploadClick}
              className="bg-card border-2 border-dashed border-border hover:border-primary rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition shadow-sm min-h-[180px] sm:min-h-[200px] flex flex-col items-center justify-center"
            >
              <input ref={inputRef} type="file" accept="image/png,image/jpeg" hidden
                onChange={(e) => handleFile(e.target.files?.[0])} />
              {previewUrl ? (
                <div className="space-y-3 w-full">
                  <img src={previewUrl} alt="Preview" className="max-h-56 sm:max-h-64 mx-auto rounded-md w-auto" />
                  <p className="text-sm text-muted-foreground break-all">{file?.name} — tap to replace</p>
                </div>
              ) : (
                <>
                  <p className="text-foreground text-base">Tap to upload, or drag & drop a photo</p>
                  <p className="text-xs text-muted-foreground mt-2">JPG or PNG · max 5MB</p>
                </>
              )}
            </div>

            <div className="text-left">
              <label className="text-sm text-muted-foreground">Theme</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)}
                className="mt-1 w-full bg-card border border-border rounded-md px-3 py-3 text-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[48px]">
                {THEMES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {err && <p className="text-sm text-destructive">{err}</p>}

            <button onClick={generate} disabled={generating}
              className="bg-primary text-primary-foreground font-medium px-10 py-4 rounded-md text-base sm:text-lg hover:opacity-90 transition disabled:opacity-50 shadow-md w-full sm:w-auto min-h-[52px] inline-flex items-center justify-center">
              {generating ? (
                <span className="flex items-center gap-3">
                  <span className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  {uploading ? "Uploading…" : "AI is redesigning…"}
                </span>
              ) : "Generate Design"}
            </button>

            {resultUrl && (
              <div className="pt-8 sm:pt-10 space-y-4">
                <h4 className="font-display text-2xl">Your Redesign</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <figure className="bg-card rounded-2xl overflow-hidden shadow-md">
                    <img src={previewUrl!} alt="Original" className="w-full h-56 sm:h-64 object-cover" />
                    <figcaption className="text-xs uppercase tracking-widest text-muted-foreground py-2">Original</figcaption>
                  </figure>
                  <figure className="bg-card rounded-2xl overflow-hidden shadow-md ring-1 ring-primary/40">
                    <img src={resultUrl} alt="Generated" className="w-full h-56 sm:h-64 object-cover" />
                    <figcaption className="text-xs uppercase tracking-widest text-primary py-2">AI Generated</figcaption>
                  </figure>
                </div>
                <a href={resultUrl} download="roomai-result.jpg"
                  className="inline-flex items-center justify-center bg-primary text-primary-foreground font-medium px-6 py-3 rounded-md hover:opacity-90 shadow min-h-[48px] w-full sm:w-auto">
                  Download
                </a>
              </div>
            )}
          </div>
        </section>

        <footer className="text-center text-xs text-muted-foreground py-8 sm:py-10 border-t border-border px-4">
          © {new Date().getFullYear()} RoomAI · Crafted with luxury in mind
        </footer>
      </main>

      <AuthModal
        open={authOpen}
        initialMode={authMode}
        onClose={() => { setAuthOpen(false); setPendingAction(null); }}
      />
    </div>
  );
}
