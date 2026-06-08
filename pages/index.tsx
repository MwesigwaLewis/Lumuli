import { useState, useEffect } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import {
  Church,
  Users,
  Palette,
  Brain,
  Mail,
  MapPin,
  ChevronDown,
  Menu,
  X,
  Send,
  CheckCircle,
  Loader2,
  Crown,
  Gamepad2,
  TrendingUp,
  Heart
} from "lucide-react";

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

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.heroTitle) {
          setContent(data);
        }
        setContentLoaded(true);
      })
      .catch(() => setContentLoaded(true));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormState({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#focus", label: "Focus Areas" },
    { href: "#skills", label: "Skills" },
    { href: "#current", label: "Current Work" },
    { href: "#contact", label: "Contact" },
  ];

  if (!contentLoaded) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Lumuli Andrew | Youth Leader & Strategic Thinker</title>
        <meta name="description" content="Personal website of Lumuli Andrew - Youth leader, strategic thinker, and fashion enthusiast based in Uganda." />
        <meta name="keywords" content="Lumuli Andrew, Youth Leader, Uganda, Anglican Church, Strategic Thinking, Fashion" />
      </Head>

      <div className="min-h-screen bg-dark-900 text-gray-100 overflow-x-hidden">
        {/* Navigation */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? "glass-strong shadow-lg" : "bg-transparent"
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <a href="#" className="text-xl font-bold text-gradient">
                {content.heroTitle}
              </a>

              <div className="hidden md:flex items-center space-x-8">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <button
                className="md:hidden p-2 text-gray-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="md:hidden glass-strong border-t border-white/10"
            >
              <div className="px-4 py-4 space-y-3">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block text-gray-300 hover:text-primary-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-900 to-purple-900/20" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="relative z-10 text-center max-w-3xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-block px-4 py-1.5 rounded-full glass text-primary-400 text-sm font-medium mb-4">
                Based in Uganda 馃嚭馃嚞
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Hello, I&apos;m <span className="text-gradient">{content.heroTitle}</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              {content.heroSubtitle}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-primary-500/25"
              >
                Get in Touch
              </a>
              <a
                href="#about"
                className="px-8 py-3 glass rounded-full font-medium hover:bg-white/10 transition-all"
              >
                Learn More
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <a href="#about" className="animate-bounce block text-gray-500 hover:text-primary-400 transition-colors">
              <ChevronDown size={28} />
            </a>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">About Me</h2>
                <div className="w-20 h-1 bg-primary-500 mx-auto rounded-full" />
              </motion.div>

              <motion.div variants={fadeInUp} className="glass rounded-2xl p-8 md:p-12">
                <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line">
                  {content.aboutText}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Areas of Focus */}
        <section id="focus" className="py-20 px-4 bg-dark-800/50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Areas of Focus</h2>
                <div className="w-20 h-1 bg-primary-500 mx-auto rounded-full mb-4" />
                <p className="text-gray-400">The pillars that define my work and passion</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: <Church className="w-8 h-8" />,
                    title: "Faith & Ministry",
                    description: "A committed member of the Anglican Church, guided by Christian values and dedicated to serving both the church and the wider community through meaningful engagement and leadership.",
                    color: "from-amber-500/20 to-orange-500/20",
                    iconColor: "text-amber-400"
                  },
                  {
                    icon: <Users className="w-8 h-8" />,
                    title: "Youth Leadership",
                    description: "Actively involved in youth ministry at St. Andrew's Church, Komamboga, contributing to mentorship, community outreach, spiritual development, and initiatives that encourage positive growth among young people.",
                    color: "from-primary-500/20 to-cyan-500/20",
                    iconColor: "text-primary-400"
                  },
                  {
                    icon: <Palette className="w-8 h-8" />,
                    title: "Fashion & Style",
                    description: "Enthusiastic about contemporary fashion, with a keen interest in emerging trends, design innovation, personal style, and the evolving landscape of local and global apparel.",
                    color: "from-pink-500/20 to-rose-500/20",
                    iconColor: "text-pink-400"
                  },
                  {
                    icon: <Brain className="w-8 h-8" />,
                    title: "Strategic Thinking",
                    description: "Passionate about analytical thinking, problem-solving, and long-term planning, with a particular interest in identifying patterns and developing effective strategies.",
                    color: "from-purple-500/20 to-violet-500/20",
                    iconColor: "text-purple-400"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className={`glass rounded-2xl p-8 hover-lift group bg-gradient-to-br ${item.color}`}
                  >
                    <div className={`${item.iconColor} mb-4 group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Skills & Interests */}
        <section id="skills" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Skills & Interests</h2>
                <div className="w-20 h-1 bg-primary-500 mx-auto rounded-full mb-4" />
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: <Crown className="w-6 h-6" />,
                    title: "Community Leadership",
                    description: "Youth mentorship, public speaking, event coordination, and faith-based community engagement."
                  },
                  {
                    icon: <TrendingUp className="w-6 h-6" />,
                    title: "Fashion Trend Analysis",
                    description: "Following and interpreting developments in modern fashion, visual aesthetics, and style culture."
                  },
                  {
                    icon: <Gamepad2 className="w-6 h-6" />,
                    title: "Chess & Critical Thinking",
                    description: "Strategic decision-making through competitive chess and tactical analysis."
                  },
                  {
                    icon: <Heart className="w-6 h-6" />,
                    title: "Digital Finance",
                    description: "Exploring digital financial tools, mobile-based investments, and emerging fintech technologies."
                  }
                ].map((skill, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="glass rounded-xl p-6 hover-lift text-center group"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-500/20 text-primary-400 mb-4 group-hover:scale-110 transition-transform">
                      {skill.icon}
                    </div>
                    <h3 className="font-bold mb-2">{skill.title}</h3>
                    <p className="text-sm text-gray-400">{skill.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Currently Working On */}
        <section id="current" className="py-20 px-4 bg-dark-800/50">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">What I&apos;m Currently Working On</h2>
                <div className="w-20 h-1 bg-primary-500 mx-auto rounded-full mb-4" />
              </motion.div>

              <div className="space-y-6">
                {[
                  {
                    flag: "馃嚭馃嚞",
                    title: "Youth Fellowship Programs",
                    description: "Supporting youth fellowship programs, mentorship initiatives, and community engagement activities at St. Andrew's Church, Komamboga."
                  },
                  {
                    flag: "馃Д",
                    title: "Fashion Documentation",
                    description: "Following seasonal fashion developments and documenting notable trends within local and international fashion communities."
                  },
                  {
                    flag: "鈾燂笍",
                    title: "Advanced Chess Strategy",
                    description: "Expanding my knowledge of advanced chess concepts and strategic gameplay techniques."
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="glass rounded-xl p-6 flex items-start gap-4 hover-lift"
                  >
                    <span className="text-3xl">{item.flag}</span>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-gray-400">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get in Touch</h2>
                <div className="w-20 h-1 bg-primary-500 mx-auto rounded-full mb-4" />
                <p className="text-gray-400">Have a question or want to collaborate? Send me a message.</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <motion.div variants={fadeInUp} className="space-y-6">
                  <div className="glass rounded-xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <a href={`mailto:${content.email}`} className="text-lg hover:text-primary-400 transition-colors">
                        {content.email}
                      </a>
                    </div>
                  </div>

                  <div className="glass rounded-xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Location</p>
                      <p className="text-lg">{content.location}</p>
                    </div>
                  </div>

                  <div className="glass rounded-xl p-6">
                    <h3 className="font-bold mb-3">Connect With Me</h3>
                    <p className="text-gray-400 text-sm">
                      I&apos;m always open to discussing youth ministry, strategic initiatives, 
                      fashion trends, or just having a meaningful conversation.
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <form onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-white placeholder-gray-500"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-white placeholder-gray-500"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-white placeholder-gray-500 resize-none"
                        placeholder="Your message here..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed rounded-lg font-medium flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-primary-500/25"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        <div>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </div>
                      )}
                    </button>

                    {submitStatus === "success" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-green-400 text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Message sent successfully! I&apos;ll get back to you soon.
                      </motion.div>
                    )}

                    {submitStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-400 text-sm"
                      >
                        Something went wrong. Please try again later.
                      </motion.div>
                    )}
                  </form>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-white/5">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              漏 {new Date().getFullYear()} {content.heroTitle}. All rights reserved.
            </p>
            <p className="text-gray-600 text-sm">
              Built with purpose and passion 馃嚭馃嚞
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
                      }



                      
