import { useState, useEffect } from "react";
import Head from "next/head";
import {
  Lock, Save, Loader2, CheckCircle, AlertCircle, Eye, EyeOff,
  LogOut, ArrowLeft, Upload, ImageIcon, ToggleLeft, ToggleRight,
  Trash2
} from "lucide-react";

interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  email: string;
  location: string;
}

interface Visibility {
  focusAreas: boolean;
  skills: boolean;
  currentWork: boolean;
  contact: boolean;
}

interface SiteImages {
  heroPortrait?: string;
  aboutPhoto?: string;
  workYouth?: string;
  workFashion?: string;
  workChess?: string;
}

const DEFAULT_CONTENT: SiteContent = {
  heroTitle: "Lumuli Andrew",
  heroSubtitle: "A youth leader, strategic thinker, and fashion enthusiast passionate about faith-centered service, youth empowerment, and personal development.",
  aboutText: "I am a youth leader, strategic thinker, and fashion enthusiast based in Uganda. My journey is driven by a deep passion for faith-centered service, youth empowerment, personal development, and staying informed about evolving fashion trends and contemporary culture. I believe in the power of community, the importance of mentorship, and the impact of strategic thinking in solving real-world challenges. Whether it's leading youth programs, analyzing fashion trends, or playing chess, I approach every endeavor with dedication and purpose.",
  email: "andrewlumuli@gmail.com",
  location: "Kampala, Uganda",
};

const DEFAULT_VISIBILITY: Visibility = {
  focusAreas: true,
  skills: true,
  currentWork: true,
  contact: true,
};

const IMAGE_SLOTS: { key: keyof SiteImages; label: string; hint: string }[] = [
  { key: "heroPortrait", label: "Hero Portrait", hint: "Main portrait on homepage (recommended 600x750)" },
  { key: "aboutPhoto", label: "About Photo", hint: "Lifestyle/candid photo (recommended 800x1000)" },
  { key: "workYouth", label: "Youth Work Photo", hint: "Youth fellowship event (recommended 600x400)" },
  { key: "workFashion", label: "Fashion Work Photo", hint: "Fashion/style photo (recommended 600x400)" },
  { key: "workChess", label: "Chess Work Photo", hint: "Chess/board photo (recommended 600x400)" },
];

export default function Admin() {
  const [passcode, setPasscode] = useState("");
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "images" | "settings">("content");

  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [visibility, setVisibility] = useState<<Visibility>(DEFAULT_VISIBILITY);
  const [images, setImages] = useState<SiteImages>({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setAuth(true);
      loadAll();
    }
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: sessionStorage.getItem("admin_passcode"), action: "load" }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.content) setContent(data.content);
        if (data.visibility) setVisibility(data.visibility);
        if (data.images) setImages(data.images);
      }
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
        loadAll();
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

  const saveContent = async () => {
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
        setMsg("Content saved!");
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

  const saveVisibility = async () => {
    setLoading(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode: sessionStorage.getItem("admin_passcode"),
          action: "saveVisibility",
          visibility,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMsg("Settings saved!");
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

  const saveImages = async () => {
    setLoading(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode: sessionStorage.getItem("admin_passcode"),
          action: "saveImages",
          images,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMsg("Images saved!");
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

  const updateContent = (field: keyof SiteContent, value: string) => {
    setContent((p) => ({ ...p, [field]: value }));
    setDirty(true);
  };

  const toggleVisibility = (field: keyof Visibility) => {
    setVisibility((p) => ({ ...p, [field]: !p[field] }));
  };

  const handleImageUpload = async (key: keyof SiteImages, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setStatus("error");
      setMsg("Image must be under 5MB");
      return;
    }

    setLoading(true);
    setStatus("idle");

    try {
      const filename = `${key}-${Date.now()}-${file.name}`;
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
        method: "POST",
        body: file,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setImages((p) => ({ ...p, [key]: data.url }));
        setStatus("success");
        setMsg(`${IMAGE_SLOTS.find((s) => s.key === key)?.label} uploaded! Click Save to store it.`);
      } else {
        setStatus("error");
        setMsg(data.error || "Upload failed");
      }
    } catch {
      setStatus("error");
      setMsg("Connection error during upload");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (key: keyof SiteImages) => {
    setImages((p) => {
      const next = { ...p };
      delete next[key];
      return next;
    });
  };

  /* ─── LOGIN SCREEN ─── */
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

            <div className="mt-6 pt-6 border-t border-ink-700/50 text-center">
              <a href="/" className="inline-flex items-center gap-2 text-sm text-sand-500 hover:text-brand-400 transition-colors">
                <ArrowLeft size={16} /> Return to website
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── DASHBOARD ─── */
  return (
    <div className="min-h-screen bg-ink-950 text-sand-100">
      <Head><title>Admin Dashboard | Lumuli Andrew</title><meta name="robots" content="noindex, nofollow" /></Head>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sand-400 text-sm mt-1">Manage your entire website</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="btn-outline text-sm inline-flex items-center gap-2">
              <ArrowLeft size={16} /> View Site
            </a>
            <button onClick={logout} className="btn-outline text-sm inline-flex items-center gap-2 text-red-400 border-red-400/20 hover:bg-red-400/5">
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

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(["content", "images", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-brand-500 text-ink-950"
                  : "bg-ink-800 text-sand-400 hover:text-sand-200"
              }`}
            >
              {tab === "content" && "Content"}
              {tab === "images" && "Images"}
              {tab === "settings" && "Settings"}
            </button>
          ))}
        </div>

        {/* ─── CONTENT TAB ─── */}
        {activeTab === "content" && (
          <div className="space-y-5">
            <div className="card">
              <label className="block text-sm font-medium text-sand-300 mb-2">Hero Title</label>
              <input type="text" value={content.heroTitle} onChange={(e) => updateContent("heroTitle", e.target.value)} className="input-field" />
            </div>
            <div className="card">
              <label className="block text-sm font-medium text-sand-300 mb-2">Hero Subtitle</label>
              <textarea value={content.heroSubtitle} onChange={(e) => updateContent("heroSubtitle", e.target.value)} rows={3} className="input-field resize-none" />
            </div>
            <div className="card">
              <label className="block text-sm font-medium text-sand-300 mb-2">About Text</label>
              <textarea value={content.aboutText} onChange={(e) => updateContent("aboutText", e.target.value)} rows={8} className="input-field resize-y" />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="card">
                <label className="block text-sm font-medium text-sand-300 mb-2">Email</label>
                <input type="email" value={content.email} onChange={(e) => updateContent("email", e.target.value)} className="input-field" />
              </div>
              <div className="card">
                <label className="block text-sm font-medium text-sand-300 mb-2">Location</label>
                <input type="text" value={content.location} onChange={(e) => updateContent("location", e.target.value)} className="input-field" />
              </div>
            </div>
            <button onClick={saveContent} disabled={loading || !dirty} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
              Save Content
            </button>
          </div>
        )}

        {/* ─── IMAGES TAB ─── */}
        {activeTab === "images" && (
          <div className="space-y-5">
            <div className="card mb-4">
              <p className="text-sm text-sand-400">
                Upload images directly from your phone. Images are stored on Vercel Blob (up to 5MB each). For best results, use JPG or WebP format.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {IMAGE_SLOTS.map((slot) => {
                const current = images[slot.key];
                return (
                  <div key={slot.key} className="card">
                    <h3 className="font-bold mb-1">{slot.label}</h3>
                    <p className="text-xs text-sand-500 mb-4">{slot.hint}</p>

                    {current ? (
                      <div className="relative mb-4">
                        <img src={current} alt={slot.label} className="w-full aspect-square object-cover rounded-xl border border-ink-700/50" />
                        <button
                          onClick={() => removeImage(slot.key)}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-lg flex items-center justify-center text-white transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full aspect-square bg-ink-800 rounded-xl border border-dashed border-ink-600 flex flex-col items-center justify-center mb-4">
                        <ImageIcon className="w-8 h-8 text-sand-600 mb-2" />
                        <span className="text-xs text-sand-500">No image</span>
                      </div>
                    )}

                    <label className="btn-outline w-full justify-center flex items-center gap-2 cursor-pointer text-sm">
                      <Upload size={16} />
                      {current ? "Replace Image" : "Upload Image"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(slot.key, file);
                        }}
                      />
                    </label>
                  </div>
                );
              })}
            </div>

            <button onClick={saveImages} disabled={loading} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
              Save All Images
            </button>
          </div>
        )}

        {/* ─── SETTINGS TAB ─── */}
        {activeTab === "settings" && (
          <div className="space-y-5">
            <div className="card">
              <h3 className="font-bold mb-4">Section Visibility</h3>
              <p className="text-sm text-sand-400 mb-6">Toggle sections on or off. Hidden sections will not appear on the site.</p>

              <div className="space-y-4">
                {(Object.keys(visibility) as Array<keyof Visibility>).map((key) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-ink-700/30 last:border-0">
                    <div>
                      <p className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                      <p className="text-xs text-sand-500">
                        {key === "focusAreas" && "Faith, Youth, Fashion, Strategy cards"}
                        {key === "skills" && "Skills & Interests grid"}
                        {key === "currentWork" && "What I'm Working On cards"}
                        {key === "contact" && "Contact form and info"}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleVisibility(key)}
                      className={`transition-colors ${visibility[key] ? "text-brand-400" : "text-sand-600"}`}
                    >
                      {visibility[key] ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={saveVisibility} disabled={loading} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
              Save Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
