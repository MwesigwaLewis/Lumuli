import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  Menu, X, Send, Mail, MapPin, ChevronDown,
  Church, Users, Palette, Brain, Crown,
  Gamepad2, TrendingUp, Heart, ArrowRight,
  Loader2, CheckCircle, AlertCircle, Phone
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

const FALLBACK: SiteContent = {
  heroTitle: "Lumuli Andrew",
  heroSubtitle: "A youth leader, strategic thinker, and fashion enthusiast passionate about faith-centered service, youth empowerment, and personal development.",
  aboutText: "I am a youth leader, strategic thinker, and fashion enthusiast based in Uganda. My journey is driven by a deep passion for faith-centered service, youth empowerment, personal development, and staying informed about evolving fashion trends and contemporary culture. I believe in the power of community, the importance of mentorship, and the impact of strategic thinking in solving real-world challenges. Whether it's leading youth programs, analyzing fashion trends, or playing chess, I approach every endeavor with dedication and purpose.",
  email: "andrewlumuli7@gmail.com",
  location: "Kampala, Uganda",
};

const FALLBACK_VISIBILITY: Visibility = {
  focusAreas: true,
  skills: true,
  currentWork: true,
  contact: true,
};

/* ─── Animation Hook ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease-out ${delay}ms, transform 0.7s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Data ─── */
const FOCUS_AREAS = [
  {
    icon: <Church className="w-6 h-6" />,
    title: "Faith & Ministry",
    desc: "A committed member of the Anglican Church, guided by Christian values and dedicated to serving both the church and the wider community through meaningful engagement and leadership.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Youth Leadership",
    desc: "Actively involved in youth ministry at St. Andrew's Church, Komamboga, contributing to mentorship, community outreach, spiritual development, and initiatives that encourage positive growth among young people.",
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: "Fashion & Style",
    desc: "Enthusiastic about contemporary fashion, with a keen interest in emerging trends, design innovation, personal style, and the evolving landscape of local and global apparel.",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Strategic Thinking",
    desc: "Passionate about analytical thinking, problem-solving, and long-term planning, with a particular interest in identifying patterns and developing effective strategies.",
  },
];

const SKILLS = [
  { icon: <Crown className="w-5 h-5" />, title: "Community Leadership", desc: "Youth mentorship, public speaking, event coordination, and faith-based community engagement." },
  { icon: <TrendingUp className="w-5 h-5" />, title: "Fashion Trend Analysis", desc: "Following and interpreting developments in modern fashion, visual aesthetics, and style culture." },
  { icon: <Gamepad2 className="w-5 h-5" />, title: "Chess & Critical Thinking", desc: "Strategic decision-making through competitive chess and tactical analysis." },
  { icon: <Heart className="w-5 h-5" />, title: "Digital Finance", desc: "Exploring digital financial tools, mobile-based investments, and emerging fintech technologies." },
];

const CURRENT_WORK = [
  { slug: "youth-fellowship", flag: "🇺🇬", title: "Youth Fellowship Programs", desc: "Supporting youth fellowship programs, mentorship initiatives, and community engagement activities at St. Andrew's Church, Komamboga.", imageKey: "workYouth" },
  { slug: "fashion-documentation", flag: "👔", title: "Fashion Documentation", desc: "Following seasonal fashion developments and documenting notable trends within local and international fashion communities.", imageKey: "workFashion" },
  { slug: "chess-strategy", flag: "♟️", title: "Advanced Chess Strategy", desc: "Expanding my knowledge of advanced chess concepts and strategic gameplay techniques.", imageKey: "workChess" },
];

/* ─── Main Page ─── */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [content, setContent] = useState<SiteContent>(FALLBACK);
  const [visibility, setVisibility] = useState<Visibility>(FALLBACK_VISIBILITY);
  const [images, setImages] = useState<SiteImages>({});
  const [loaded, setLoaded] = useState(false);

  /* Form state */
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  /* Load content */
  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => {
        if (d?.profile?.heroTitle) setContent(d.profile);
        if (d?.visibility) setVisibility(d.visibility);
        if (d?.images) setImages(d.images);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  /* Scroll listener */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitStatus("success");
        setForm({ name: "", email: "", whatsapp: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#focus", label: "Focus" },
    { href: "#skills", label: "Skills" },
    { href: "#work", label: "Current Work" },
    { href: "#contact", label: "Contact" },
  ];

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-950">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-950 text-sand-100 overflow-x-hidden">
      <Head>
        {/* Primary */}
        <title>Lumuli Andrew | Youth Leader, Strategic Thinker & Fashion Enthusiast</title>
        <meta name="description" content="Lumuli Andrew is a youth leader, strategic thinker, and fashion enthusiast based in Kampala, Uganda. Passionate about faith-centered service, youth empowerment, and personal development." />
        <meta name="keywords" content="Lumuli Andrew, Uganda youth leader, Kampala, St Andrews Church Komamboga, youth empowerment, fashion Uganda, chess Uganda, strategic thinking" />
        <meta name="author" content="Lumuli Andrew" />
        <link rel="canonical" href="https://andrewlumuli.site" />
        <link rel="icon" type="image/jpeg" href="/profile/Lumuli_Andrew.jpg" />

        {/* Open Graph */}
        <meta property="og:type" content="profile" />
        <meta property="og:title" content="Lumuli Andrew | Youth Leader & Strategic Thinker" />
        <meta property="og:description" content="Youth leader, strategic thinker, and fashion enthusiast based in Kampala, Uganda." />
        <meta property="og:image" content="https://andrewlumuli.site/profile/Lumuli_Andrew.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://andrewlumuli.site" />
        <meta property="og:site_name" content="Lumuli Andrew" />
        <meta property="profile:first_name" content="Andrew" />
        <meta property="profile:last_name" content="Lumuli" />

        {/* Twitter/X card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lumuli Andrew | Youth Leader & Strategic Thinker" />
        <meta name="twitter:description" content="Youth leader, strategic thinker, and fashion enthusiast based in Kampala, Uganda." />
        <meta name="twitter:image" content="https://andrewlumuli.site/profile/Lumuli_Andrew.jpg" />

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Lumuli Andrew",
              "jobTitle": "Youth Leader & Strategic Thinker",
              "description": "Youth leader, strategic thinker, and fashion enthusiast based in Kampala, Uganda.",
              "url": "https://andrewlumuli.site",
              "image": "https://andrewlumuli.site/profile/Lumuli_Andrew.jpg",
              "email": "andrewlumuli8@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Kampala",
                "addressCountry": "UG"
              },
              "sameAs": []
            })
          }}
        />
      </Head>

      {/* ═══ NAVIGATION ═══ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-ink-950/90 backdrop-blur-md border-b border-ink-800/50" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <a href="#" className="text-lg sm:text-xl font-bold text-gradient tracking-tight">
              {content.heroTitle}
            </a>
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} className="text-sm text-sand-300 hover:text-brand-400 transition-colors duration-300">
                  {l.label}
                </a>
              ))}
            </div>
            <button className="md:hidden p-2 text-sand-300" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-ink-900/95 backdrop-blur-lg border-t border-ink-700/50">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block py-3 px-4 text-sand-300 hover:text-brand-400 hover:bg-ink-800/50 rounded-lg transition-colors">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 px-4 sm:px-6 overflow-hidden">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="animate-fade-up">
                <span className="section-label">Based in Uganda 🇺🇬</span>
              </div>
              <h1 className="animate-fade-up animate-delay-100 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
                Hello, I&apos;m{" "}
                <span className="text-gradient">{content.heroTitle}</span>
              </h1>
              <p className="animate-fade-up animate-delay-200 text-lg sm:text-xl text-sand-300 leading-relaxed max-w-xl mb-8 text-balance">
                {content.heroSubtitle}
              </p>
              <div className="animate-fade-up animate-delay-300 flex flex-wrap gap-4">
                <a href="#contact" className="btn-primary inline-flex items-center gap-2">
                  Get in Touch <ArrowRight size={18} />
                </a>
                <a href="#about" className="btn-outline">Learn More</a>
              </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="animate-fade-up animate-delay-200 relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-brand-500/20 to-accent-500/20 rounded-3xl blur-xl" />
                {images.heroPortrait ? (
                  <img
                    src={images.heroPortrait}
                    alt="Lumuli Andrew - Youth Leader and Strategic Thinker, Kampala Uganda"
                    className="relative w-72 h-96 sm:w-80 sm:h-[28rem] object-cover rounded-3xl border border-ink-700/50 shadow-2xl"
                  />
                ) : (
                  <div className="relative w-72 h-96 sm:w-80 sm:h-[28rem] bg-gradient-to-br from-ink-800 to-ink-700 rounded-3xl border border-ink-700/50 flex items-center justify-center">
                    <div className="text-center px-6">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-ink-600 flex items-center justify-center">
                        <Users className="w-8 h-8 text-sand-400" />
                      </div>
                      <p className="text-sand-400 text-sm">📸 Add portrait in Admin</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <a href="#about" className="text-sand-500 hover:text-brand-400 transition-colors">
              <ChevronDown size={24} />
            </a>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeIn>
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-br from-brand-500/10 to-transparent rounded-3xl blur-lg" />
                {images.aboutPhoto ? (
                  <img
                    src={images.aboutPhoto}
                    alt="Lumuli Andrew - Youth Leader based in Kampala Uganda"
                    className="relative w-full aspect-[4/5] object-cover rounded-2xl border border-ink-700/50"
                  />
                ) : (
                  <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-ink-800 to-ink-700 rounded-2xl border border-ink-700/50 flex items-center justify-center">
                    <div className="text-center px-6">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-ink-600 flex items-center justify-center">
                        <Heart className="w-7 h-7 text-sand-400" />
                      </div>
                      <p className="text-sand-400 text-sm">📸 Add photo in Admin</p>
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>

            <div>
              <FadeIn delay={100}><span className="section-label">About Me</span></FadeIn>
              <FadeIn delay={200}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
                  Driven by <span className="text-gradient">Purpose</span> & Passion
                </h2>
              </FadeIn>
              <FadeIn delay={300}><div className="divider mb-6" /></FadeIn>
              <FadeIn delay={400}>
                <p className="text-sand-300 leading-relaxed text-lg whitespace-pre-line">{content.aboutText}</p>
              </FadeIn>
              <FadeIn delay={500}>
                <div className="mt-8 flex flex-wrap gap-6">
                  <div className="flex items-center gap-2 text-sand-400">
                    <MapPin size={18} className="text-brand-400" />
                    <span>{content.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sand-400">
                    <Mail size={18} className="text-brand-400" />
                    <a href={`mailto:${content.email}`} className="hover:text-brand-400 transition-colors">{content.email}</a>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOCUS AREAS ═══ */}
      {visibility.focusAreas && (
        <section id="focus" className="py-20 sm:py-28 px-4 sm:px-6 bg-ink-900/30">
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <div className="text-center mb-16">
                <span className="section-label">What I Do</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                  Areas of <span className="text-gradient">Focus</span>
                </h2>
                <p className="text-sand-400 max-w-lg mx-auto">The pillars that define my work and passion</p>
              </div>
            </FadeIn>
            <div className="grid sm:grid-cols-2 gap-5">
              {FOCUS_AREAS.map((item, i) => (
                <FadeIn key={item.title} delay={i * 100}>
                  <div className="card-hover h-full">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-5">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-sand-400 leading-relaxed text-sm">{item.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ SKILLS ═══ */}
      {visibility.skills && (
        <section id="skills" className="py-20 sm:py-28 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <div className="text-center mb-16">
                <span className="section-label">Expertise</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                  Skills & <span className="text-gradient">Interests</span>
                </h2>
                <div className="divider mx-auto" />
              </div>
            </FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {SKILLS.map((skill, i) => (
                <FadeIn key={skill.title} delay={i * 100}>
                  <div className="card-hover text-center h-full">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-5">
                      {skill.icon}
                    </div>
                    <h3 className="font-bold mb-2">{skill.title}</h3>
                    <p className="text-sand-400 text-sm leading-relaxed">{skill.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CURRENT WORK ═══ */}
      {visibility.currentWork && (
        <section id="work" className="py-20 sm:py-28 px-4 sm:px-6 bg-ink-900/30">
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <div className="text-center mb-16">
                <span className="section-label">Right Now</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                  What I&apos;m <span className="text-gradient">Working On</span>
                </h2>
                <p className="text-sand-400 max-w-lg mx-auto">Current projects and pursuits</p>
              </div>
            </FadeIn>
            <div className="space-y-6">
              {CURRENT_WORK.map((item, i) => {
                const img = images[item.imageKey as keyof SiteImages];
                return (
                  <FadeIn key={item.slug} delay={i * 150}>
                    <Link href={`/work/${item.slug}/`} className="card flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8 group cursor-pointer">
                      <div className="shrink-0 w-full sm:w-48 h-40 sm:h-32 bg-gradient-to-br from-ink-700 to-ink-600 rounded-xl flex items-center justify-center overflow-hidden">
                        {img ? (
                          <img
                            src={img}
                            alt={`Lumuli Andrew - ${item.title}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center px-4">
                            <span className="text-2xl">{item.flag}</span>
                            <p className="text-sand-500 text-[10px] mt-1">📸 Add photo in Admin</p>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-brand-400 transition-colors">{item.title}</h3>
                        <p className="text-sand-400 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="shrink-0 hidden sm:block">
                        <div className="w-10 h-10 rounded-full bg-ink-700 flex items-center justify-center group-hover:bg-brand-500/20 group-hover:text-brand-400 transition-all">
                          <ArrowRight size={18} />
                        </div>
                      </div>
                    </Link>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CONTACT ═══ */}
      {visibility.contact && (
        <section id="contact" className="py-20 sm:py-28 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <div className="text-center mb-16">
                <span className="section-label">Let&apos;s Connect</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                  Get in <span className="text-gradient">Touch</span>
                </h2>
                <p className="text-sand-400 max-w-lg mx-auto">Have a question or want to collaborate? Send me a message.</p>
              </div>
            </FadeIn>

            <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
              <FadeIn className="lg:col-span-2">
                <div className="space-y-6">
                  <div className="card">
                    <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 mb-4">
                      <Mail size={20} />
                    </div>
                    <p className="text-xs text-sand-500 uppercase tracking-wider mb-1">Email</p>
                    <a href={`mailto:${content.email}`} className="text-lg font-medium hover:text-brand-400 transition-colors">{content.email}</a>
                  </div>
                  <div className="card">
                    <div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center text-accent-400 mb-4">
                      <MapPin size={20} />
                    </div>
                    <p className="text-xs text-sand-500 uppercase tracking-wider mb-1">Location</p>
                    <p className="text-lg font-medium">{content.location}</p>
                  </div>
                  <div className="card">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 mb-4">
                      <Phone size={20} />
                    </div>
                    <p className="text-xs text-sand-500 uppercase tracking-wider mb-1">WhatsApp</p>
                    <a href="https://wa.me/256760488800" target="_blank" rel="noopener noreferrer" className="text-lg font-medium hover:text-green-400 transition-colors">
                      +256 760 488800
                    </a>
                    <p className="text-xs text-sand-500 mt-1">Feel free to contact me via WhatsApp</p>
                  </div>
                  <div className="card">
                    <h3 className="font-bold mb-2">Connect With Me</h3>
                    <p className="text-sand-400 text-sm leading-relaxed">
                      I&apos;m always open to discussing youth ministry, strategic initiatives, fashion trends, or just having a meaningful conversation.
                    </p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={150} className="lg:col-span-3">
                <form onSubmit={handleSubmit} className="card space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-sand-300 mb-2">Your Name</label>
                    <input id="name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Mwesigwa Lewis" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-sand-300 mb-2">Your Email</label>
                    <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="mwesigwalewis@centralhub.space" />
                  </div>
                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-medium text-sand-300 mb-2">WhatsApp Number <span className="text-sand-500 font-normal">(optional)</span></label>
                    <input id="whatsapp" type="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="input-field" placeholder="+256 7XX XXX XXX" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-sand-300 mb-2">Message</label>
                    <textarea id="message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field resize-none" placeholder="Email mwesigwalewis@centralhub.space for professional websites..." />
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-50 flex items-center gap-2">
                    {submitting ? (
                      <><Loader2 size={18} className="animate-spin" /> Sending...</>
                    ) : (
                      <><Send size={18} /> Send Message</>
                    )}
                  </button>
                  {submitStatus === "success" && (
                    <div className="flex items-center gap-2 text-green-400 text-sm p-3 bg-green-500/10 rounded-lg">
                      <CheckCircle size={16} /> Message sent successfully! I&apos;ll get back to you soon.
                    </div>
                  )}
                  {submitStatus === "error" && (
                    <div className="flex items-center gap-2 text-red-400 text-sm p-3 bg-red-500/10 rounded-lg">
                      <AlertCircle size={16} /> Something went wrong. Please try again later.
                    </div>
                  )}
                </form>
              </FadeIn>
            </div>
          </div>
        </section>
      )}

      {/* ═══ FOOTER ═══ */}
      <footer className="py-8 px-4 sm:px-6 border-t border-ink-800/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sand-500 text-sm">© {new Date().getFullYear()} {content.heroTitle}. All rights reserved.</p>
          <p className="text-sand-600 text-sm">Built with purpose and passion 🇺🇬</p>
        </div>
      </footer>
    </div>
  );
}
