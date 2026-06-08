import { useState, useEffect } from "react";
import Head from "next/head";
import { Lock, Save, Loader2, CheckCircle, AlertCircle, Eye, EyeOff, LogOut } from "lucide-react";

interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  email: string;
  location: string;
}

const DEFAULT: SiteContent = {
  heroTitle: "Lumuli Andrew",
  heroSubtitle: "A youth leader, strategic thinker, and fashion enthusiast passionate about faith-centered service, youth empowerment, and personal development.",
  aboutText: "I am a youth leader, strategic thinker, and fashion enthusiast based in Uganda. My journey is driven by a deep passion for faith-centered service, youth empowerment, personal development, and staying informed about evolving fashion trends and contemporary culture. I believe in the power of community, the importance of mentorship, and the impact of strategic thinking in solving real-world challenges. Whether it's leading youth programs, analyzing fashion trends, or playing chess, I approach every endeavor with dedication and purpose.",
  email: "andrewlumuli7@gmail.com",
  location: "Kampala, Uganda",
};

export default function Admin() {
  const [passcode, setPasscode] = useState("");
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [content, setContent] = useState<SiteContent>(DEFAULT);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setAuth(true);
      loadContent();
    }
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: sessionStorage.getItem("admin_passcode"), action: "load" }),
      });
      const data = await res.json();
      if (data.success && data.content) setContent(data.content);
    } catch { /* fallback */ }
    setLoading(false);
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode, action: "verify" }),
      });
      const data = await res.json();
      if (data.success) {
        setAuth(true);
        sessionStorage.setItem("admin_auth", "true");
        sessionStorage.setItem("admin_passcode", passcode);
        setStatus("success");
        setMsg("Access granted!");
        loadContent();
      } else {
        setStatus("error");
        setMsg(data.error || "Invalid passcode");
      }
    } catch {
      setStatus("error");
      setMsg("Connection error");
    }
    setLoading(false);
  };

  const save = async () => {
    setLoading(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode: sessionStorage.getItem("admin_passcode"),
          action: "save",
          content,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMsg("Content saved successfully!");
        setDirty(false);
      } else {
        setStatus("error");
        setMsg(data.error || "Failed to save");
      }
    } catch {
      setStatus("error");
      setMsg("Connection error");
    }
    setLoading(false);
  };

  const logout = () => {
    sessionStorage.removeItem("admin_auth");
    sessionStorage.removeItem("admin_passcode");
    setAuth(false);
    setPasscode("");
    setStatus("idle");
  };

  const update = (field: keyof SiteContent, value: string) => {
    setContent((p) => ({ ...p, [field]: value }));
    setDirty(true);
  };

  if (!auth) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4">
        <Head><title>Admin | Lumuli Andrew</title><meta name="robots" content="noindex, nofollow" /></Head>
        <div className="w-full max-w-md animate-fade-up">
          <div className="card">
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-brand-500/10 flex items-center justify-center">
                <Lock className="w-7 h-7 text-brand-400" />
              </div>
              <h1 className="text-2xl font-bold text-sand-100 mb-2">Admin Access</h1>
              <p className="text-sand-400 text-sm">Enter your passcode to manage content</p>
            </div>

            <form onSubmit={verify} className="space-y-4">
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode"
                  className="input-field pr-12"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-500 hover:text-sand-300 transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 text-red-400 text-sm p-3 bg-red-500/10 rounded-lg">
                  <AlertCircle size={16} /> {msg}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center flex items-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock size={18} />}
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-950 text-sand-100">
      <Head><title>Admin Dashboard | Lumuli Andrew</title><meta name="robots" content="noindex, nofollow" /></Head>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Content Dashboard</h1>
            <p className="text-sand-400 text-sm mt-1">Manage your website content</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={save} disabled={loading || !dirty} className="btn-primary text-sm inline-flex items-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
              Save Changes
            </button>
            <button onClick={logout} className="btn-outline text-sm inline-flex items-center gap-2">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {status === "success" && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle size={18} /> {msg}
          </div>
        )}
        {status === "error" && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={18} /> {msg}
          </div>
        )}

        <div className="space-y-5">
          <div className="card">
            <label className="block text-sm font-medium text-sand-300 mb-2">Hero Title</label>
            <input type="text" value={content.heroTitle} onChange={(e) => update("heroTitle", e.target.value)} className="input-field" />
          </div>
          <div className="card">
            <label className="block text-sm font-medium text-sand-300 mb-2">Hero Subtitle</label>
            <textarea value={content.heroSubtitle} onChange={(e) => update("heroSubtitle", e.target.value)} rows={3} className="input-field resize-none" />
          </div>
          <div className="card">
            <label className="block text-sm font-medium text-sand-300 mb-2">About Text</label>
            <textarea value={content.aboutText} onChange={(e) => update("aboutText", e.target.value)} rows={8} className="input-field resize-y" />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="card">
              <label className="block text-sm font-medium text-sand-300 mb-2">Email</label>
              <input type="email" value={content.email} onChange={(e) => update("email", e.target.value)} className="input-field" />
            </div>
            <div className="card">
              <label className="block text-sm font-medium text-sand-300 mb-2">Location</label>
              <input type="text" value={content.location} onChange={(e) => update("location", e.target.value)} className="input-field" />
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-ink-800/50 rounded-xl text-sm text-sand-500 flex items-center gap-2">
          <AlertCircle size={16} />
          Changes are saved to Upstash Redis. If Redis is not configured, changes will not persist.
        </div>
      </div>
    </div>
  );
}
