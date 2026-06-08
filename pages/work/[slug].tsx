import { useRouter } from "next/router";
import Head from "next/head";
import { ArrowLeft, Church, Palette, Gamepad2 } from "lucide-react";
import { useState, useEffect } from "react";

interface SiteData {
  profile?: { heroTitle?: string };
  images?: Record<string, string>;
}

const WORK_DATA: Record<string, {
  title: string;
  icon: React.ReactNode;
  shortDesc: string;
  fullContent: string;
  imageKey: string;
}> = {
  "youth-fellowship": {
    title: "Youth Fellowship Programs",
    icon: <Church className="w-8 h-8" />,
    shortDesc: "Supporting youth fellowship programs, mentorship initiatives, and community engagement activities at St. Andrew's Church, Komamboga.",
    fullContent: `At St. Andrew's Church, Komamboga, I am actively involved in shaping and supporting youth fellowship programs that go beyond traditional Sunday services. My work focuses on creating safe, engaging spaces where young people can explore their faith, develop leadership skills, and build meaningful relationships.

Key initiatives include:

• Weekly Youth Fellowship Meetings — Facilitating discussions on faith, life challenges, and personal growth in a peer-supported environment.

• Mentorship Programs — Pairing younger members with mature mentors who provide guidance on education, career, relationships, and spiritual development.

• Community Outreach — Organizing visits to local schools, hospitals, and underserved communities to extend support and share resources.

• Leadership Training — Running workshops on public speaking, event planning, team management, and conflict resolution.

• Spiritual Retreats — Coordinating quarterly retreats that combine worship, reflection, team-building, and outdoor activities.

The goal is to raise a generation of young people who are spiritually grounded, socially responsible, and equipped to lead with integrity.`,
    imageKey: "workYouth",
  },
  "fashion-documentation": {
    title: "Fashion Documentation",
    icon: <Palette className="w-8 h-8" />,
    shortDesc: "Following seasonal fashion developments and documenting notable trends within local and international fashion communities.",
    fullContent: `Fashion is more than clothing — it is a language of identity, culture, and self-expression. My passion for fashion drives me to stay deeply connected to both local Ugandan style movements and global trends shaping the industry.

My documentation work covers:

• Seasonal Trend Analysis — Tracking color palettes, fabric choices, silhouette shifts, and accessory trends across spring, summer, autumn, and winter collections.

• Local Designer Spotlights — Featuring emerging Ugandan designers, tailors, and stylists who are redefining East African fashion.

• Street Style Documentation — Capturing authentic everyday fashion in Kampala, from campus looks to market-day elegance.

• Cultural Fashion Events — Attending and reviewing fashion shows, pop-up markets, and cultural exhibitions that celebrate African heritage through design.

• Personal Style Journal — Maintaining a curated collection of outfits, inspirations, and styling experiments that reflect my evolving aesthetic.

I believe fashion documentation is a form of cultural preservation — recording how we dress today tells the story of who we are as a society.`,
    imageKey: "workFashion",
  },
  "chess-strategy": {
    title: "Advanced Chess Strategy",
    icon: <Gamepad2 className="w-8 h-8" />,
    shortDesc: "Expanding my knowledge of advanced chess concepts and strategic gameplay techniques.",
    fullContent: `Chess has been a cornerstone of my intellectual development since I first learned the moves. What began as a casual pastime has evolved into a serious pursuit of strategic mastery and mental discipline.

My current focus areas include:

• Opening Theory — Deepening understanding of classical openings (Ruy Lopez, Queen's Gambit, Sicilian Defense) and their modern variations.

• Middle-Game Tactics — Studying pawn structures, piece coordination, initiative, and positional play to gain lasting advantages.

• Endgame Technique — Mastering rook endgames, opposition, zugzwang, and conversion techniques to close out winning positions.

• Competitive Play — Participating in local chess tournaments and online rapid/blitz competitions to test skills under pressure.

• Chess Coaching — Mentoring beginners in my community, teaching fundamentals while emphasizing critical thinking and patience.

• Game Analysis — Reviewing grandmaster games to understand decision-making at the highest level, annotating key moments and alternative lines.

Chess teaches that every move has consequences — a lesson I apply to leadership, fashion analysis, and every aspect of life.`,
    imageKey: "workChess",
  },
};

export default function WorkDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [siteData, setSiteData] = useState<SiteData>({});

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => setSiteData(d))
      .catch(() => {});
  }, []);

  if (!slug || typeof slug !== "string") return null;

  const work = WORK_DATA[slug];
  if (!work) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-sand-100 mb-4">Page Not Found</h1>
          <button onClick={() => router.push("/")} className="btn-primary">
            <ArrowLeft size={18} className="inline mr-2" /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = siteData.images?.[work.imageKey] || "";
  const name = siteData.profile?.heroTitle || "Lumuli Andrew";

  return (
    <div className="min-h-screen bg-ink-950 text-sand-100">
      <Head>
        <title>{work.title} | {name}</title>
        <meta name="description" content={work.shortDesc} />
      </Head>

      {/* Back button */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-ink-950/90 backdrop-blur-md border-b border-ink-800/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-sand-400 hover:text-brand-400 transition-colors text-sm"
          >
            <ArrowLeft size={18} /> Back to site
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-20">
        {/* Header */}
        <div className="mb-10">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-6">
            {work.icon}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">{work.title}</h1>
          <p className="text-sand-400 text-lg">{work.shortDesc}</p>
        </div>

        {/* Image */}
        {imageUrl ? (
          <div className="mb-10">
            <img
              src={imageUrl}
              alt={work.title}
              className="w-full aspect-video object-cover rounded-2xl border border-ink-700/50"
            />
          </div>
        ) : (
          <div className="mb-10 w-full aspect-video bg-gradient-to-br from-ink-800 to-ink-700 rounded-2xl border border-ink-700/50 flex items-center justify-center">
            <div className="text-center">
              <span className="text-3xl">📸</span>
              <p className="text-sand-500 text-sm mt-2">Login to Add a Photo 📷</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="card">
          <div className="space-y-4">
            {work.fullContent.split("\n\n").map((paragraph, i) => {
              if (paragraph.startsWith("• ")) {
                return (
                  <ul key={i} className="list-disc list-inside text-sand-300 leading-relaxed space-y-2 pl-2">
                    {paragraph.split("\n").map((item, j) => (
                      <li key={j}>{item.replace("• ", "")}</li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.startsWith("Key") || paragraph.startsWith("My") || paragraph.startsWith("The") || paragraph.startsWith("Fashion") || paragraph.startsWith("Chess")) {
                return <h3 key={i} className="text-xl font-bold text-sand-100 mt-6">{paragraph}</h3>;
              }
              return <p key={i} className="text-sand-300 leading-relaxed">{paragraph}</p>;
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <button onClick={() => router.push("/#contact")} className="btn-primary inline-flex items-center gap-2">
            Discuss This <ArrowLeft size={18} className="rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
