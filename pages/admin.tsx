import { useState, useEffect } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { Lock, Save, Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";

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

export default function Admin() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [hasChanges, setHasChanges] = useState(false);

  // Check sessionStorage on mount (instead of localStorage)
  useEffect(() => {
    const saved = sessionStorage.getItem("admin_auth");
    if (saved === "true") {
      setIsAuthenticated(true);
      loadContent();
    }
  }, []);

  const loadContent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: sessionStorage.getItem("admin_passcode"), action: "load" }),
      });
      const data = await response.json();
      if (data.success && data.content) {
        setContent(data.content);
      }
    } catch {
      // Use defaults if load fails
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("idle");

    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode, action: "verify" }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        // Store in sessionStorage (clears when browser closes) instead of localStorage
        sessionStorage.setItem("admin_auth", "true");
        sessionStorage.setItem("admin_passcode", passcode);
        setStatus("success");
        setStatusMessage("Access granted!");
        loadContent();
      } else {
        setStatus("error");
        setStatusMessage(data.error || "Invalid passcode");
      }
    } catch {
      setStatus("error");
      setStatusMessage("Connection error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setStatus("idle");

    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode: sessionStorage.getItem("admin_passcode"),
          action: "save",
          content,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setStatusMessage("Content saved successfully!");
        setHasChanges(false);
      } else {
        setStatus("error");
        setStatusMessage(data.error || "Failed to save");
      }
    } catch {
      setStatus("error");
      setStatusMessage("Connection error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    sessionStorage.removeItem("admin_passcode");
    setIsAuthenticated(false);
    setPasscode("");
    setStatus("idle");
  };

  const handleChange = (field: keyof SiteContent, value: string) => {
    setContent((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
        <Head>
          <title>Admin | Lumuli Andrew</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="glass-strong rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-primary-500" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
              <p className="text-gray-400 text-sm">Enter your passcode to manage content</p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div className="relative">
                <input
                  type={showPasscode ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode"
                  className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPasscode ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-center gap-2 text-red-400 text-sm"
                >
                  <AlertCircle size={16} />
                  {statusMessage}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Lock size={18} />
                    Access Dashboard
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100">
      <Head>
        <title>Admin Dashboard | Lumuli Andrew</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Content Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your website content</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isLoading || !hasChanges}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Save Changes
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-gray-300 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-400"
          >
            <CheckCircle size={18} />
            {statusMessage}
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400"
          >
            <AlertCircle size={18} />
            {statusMessage}
          </motion.div>
        )}

        <div className="space-y-6">
          <div className="glass-strong rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Hero Title
            </label>
            <input
              type="text"
              value={content.heroTitle}
              onChange={(e) => handleChange("heroTitle", e.target.value)}
              className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <div className="glass-strong rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Hero Subtitle
            </label>
            <textarea
              value={content.heroSubtitle}
              onChange={(e) => handleChange("heroSubtitle", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors resize-none"
            />
          </div>

          <div className="glass-strong rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              About Text
            </label>
            <textarea
              value={content.aboutText}
              onChange={(e) => handleChange("aboutText", e.target.value)}
              rows={8}
              className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors resize-y"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-strong rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={content.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            <div className="glass-strong rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                value={content.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-dark-800/50 rounded-lg text-sm text-gray-400">
          <p className="flex items-center gap-2">
            <AlertCircle size={16} />
            Changes are saved to Upstash Redis. If Redis is not configured, changes will not persist.
          </p>
        </div>
      </div>
    </div>
  );
}
