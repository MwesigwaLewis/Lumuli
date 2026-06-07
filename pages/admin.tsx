import { useState, useEffect } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { Lock, Unlock, Eye, EyeOff, Save, RotateCcw, CheckCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";

interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  email: string;
  location: string;
}

const defaultContent: SiteContent = {
  heroTitle: "Lumuli Andrew",
  heroSubtitle: "A youth leader, strategic thinker, and fashion enthusiast passionate about faith-centered service, youth empowerment, and personal development.",
  aboutText: "I am a youth leader, strategic thinker, and fashion enthusiast based in Uganda. My journey is driven by a deep passion for faith-centered service, youth empowerment, personal development, and staying informed about evolving fashion trends and contemporary culture. I believe in the power of community, the importance of mentorship, and the impact of strategic thinking in solving real-world challenges. Whether it's leading youth programs, analyzing fashion trends, or playing chess, I approach every endeavor with dedication and purpose.",
  email: "andrewlumuli7@gmail.com",
  location: "Kampala, Uganda",
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    const savedPasscode = localStorage.getItem("admin_passcode");
    if (auth === "true" && savedPasscode) {
      setPasscode(savedPasscode);
      setIsAuthenticated(true);
      loadContent(savedPasscode);
    }
  }, []);

  const loadContent = async (pc: string) => {
    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: pc, action: "load" }),
      });
      const data = await response.json();
      if (data.content) {
        setContent(data.content);
      }
    } catch {
      // fallback to default
    }
  };

  const verifyPasscode = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode, action: "verify" }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("admin_auth", "true");
        localStorage.setItem("admin_passcode", passcode);
        loadContent(passcode);
      } else {
        setError("Invalid passcode. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode, action: "save", content }),
      });
      if (response.ok) {
        setSaveStatus("saved");
        setHasChanges(false);
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("idle");
        alert("Failed to save to database.");
      }
    } catch {
      setSaveStatus("idle");
      alert("Failed to save. Check your connection.");
    }
  };

  const handleReset = () => {
    if (confirm("Reset to default content? This will overwrite saved changes.")) {
      setContent(defaultContent);
      setHasChanges(true);
      setSaveStatus("idle");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    localStorage.removeItem("admin_passcode");
    setIsAuthenticated(false);
    setPasscode("");
    router.push("/");
  };

  const updateField = (field: keyof SiteContent, value: string) => {
    setContent((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    setSaveStatus("idle");
  };

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Admin Access | Lumuli Andrew</title>
        </Head>
        <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-8 max-w-md w-full"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary-400" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Admin Access</h1>
              <p className="text-gray-400 text-sm">
                Enter your passcode to manage site content.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showPasscode ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && verifyPasscode()}
                  placeholder="Enter passcode"
                  className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white pr-12"
                />
                <button
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPasscode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm">
                  {error}
                </motion.p>
              )}

              <button
                onClick={verifyPasscode}
                disabled={isLoading || !passcode}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="animate-pulse">Verifying...</span>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    Access Panel
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => router.push("/")}
              className="w-full mt-4 text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to website
            </button>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Content Manager | Lumuli Andrew</title>
      </Head>
      <div className="min-h-screen bg-dark-900 text-gray-100">
        {/* Admin Header */}
        <header className="glass-strong border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
                <Lock className="w-4 h-4 text-primary-400" />
              </div>
              <h1 className="font-bold">Content Manager</h1>
            </div>
            <div className="flex items-center gap-3">
              {hasChanges && (
                <span className="text-sm text-amber-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  Unsaved
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={saveStatus === "saving" || !hasChanges}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
              >
                {saveStatus === "saving" ? (
                  "Saving..."
                ) : saveStatus === "saved" ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 glass hover:bg-white/10 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Admin Content */}
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-500" />
              Hero Section
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                <input
                  type="text"
                  value={content.heroTitle}
                  onChange={(e) => updateField("heroTitle", e.target.value)}
                  className="w-full px-4 py-2 bg-dark-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Subtitle / Bio Line</label>
                <textarea
                  rows={3}
                  value={content.heroSubtitle}
                  onChange={(e) => updateField("heroSubtitle", e.target.value)}
                  className="w-full px-4 py-2 bg-dark-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white resize-none"
                />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              About Section
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">About Text</label>
              <textarea
                rows={8}
                value={content.aboutText}
                onChange={(e) => updateField("aboutText", e.target.value)}
                className="w-full px-4 py-2 bg-dark-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white resize-none"
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <input
                  type="email"
                  value={content.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full px-4 py-2 bg-dark-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                <input
                  type="text"
                  value={content.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="w-full px-4 py-2 bg-dark-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                />
              </div>
            </div>
          </motion.div>

          <div className="glass rounded-xl p-6 border border-primary-500/20">
            <h3 className="font-bold mb-2 text-primary-400">How Persistence Works</h3>
            <p className="text-sm text-gray-400 mb-3">
              Changes are saved to Upstash Redis (a cloud database). They will:
            </p>
            <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
              <li>Appear on the live site immediately after saving</li>
              <li>Persist across all devices and browsers</li>
              <li>Survive cache clears and browser changes</li>
              <li>Be available even if you log out and back in later</li>
            </ul>
          </div>
        </main>
      </div>
    </>
  );
    }
