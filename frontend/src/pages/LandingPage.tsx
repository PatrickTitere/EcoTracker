import { useEffect, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion, useInView, useScroll } from "framer-motion";
import { HeroScene } from "../components/landing/HeroScene";
import { useAuth } from "../context/AuthContext";
import { ThemeToggle } from "../components/ThemeToggle";
import { LogoMark } from "../components/LogoMark";


const ASSETS = {
  viennaForest:
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
  cleanup:
    "https://images.unsplash.com/photo-1532996122724-e3c354a0fb15?w=800&q=80",
  planting:
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
  city:
    "https://images.unsplash.com/photo-1605870445911-563fbf259ff4?w=1200&q=80",
};

const FEATURES = [
  {
    title: "Live-Karte",
    desc: "Öko-Aktionen in Wien – von der HTL Spengergasse bis zum Donaukanal.",
    img: ASSETS.city,
    tag: "GPS",
  },
  {
    title: "Check-in vor Ort",
    desc: "Nur wenn du wirklich da bist. Serverseitige Geofence-Validierung.",
    img: ASSETS.cleanup,
    tag: "Real",
  },
  {
    title: "XP & Badges",
    desc: "Leveln, sammeln, flexen. Dein Impact wird sichtbar.",
    img: ASSETS.planting,
    tag: "Game",
  },
];

const STEPS = [
  { n: "01", t: "Registrieren", d: "Account in Sekunden" },
  { n: "02", t: "Entdecken", d: "Aktionen auf der Karte" },
  { n: "03", t: "Vor Ort sein", d: "GPS-Check-in" },
  { n: "04", t: "XP kassieren", d: "Level & Badges" },
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function LandingPage() {
  const { user, loading } = useAuth();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    document.documentElement.classList.add("landing-active");
    return () => document.documentElement.classList.remove("landing-active");
  }, []);

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="landing">
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress, transformOrigin: "0%" }} />

      <header className="landing-nav">
        <Link to="/" className="landing-logo">
          <LogoMark size={32} />
          EcoMap<span>Wien</span>
        </Link>
        <nav className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#how">So geht&apos;s</a>
          <a href="#htl">HTL</a>
        </nav>
        <div className="landing-nav-cta">
          <ThemeToggle />
          <Link to="/login" className="nav-ghost">
            Login
          </Link>
          <Link to="/register" className="nav-cta">
            Starten
          </Link>
        </div>
      </header>

      <section className="landing-hero">
        <HeroScene />
        <div className="landing-hero-content">
          <motion.p
            className="hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="pulse-dot" />
            Wien · Öko · Gamified
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
          >
            Deine Stadt.
            <br />
            <span className="text-gradient">Dein Impact.</span>
          </motion.h1>
          <motion.p
            className="hero-lead"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            Finde Müllsammel-Aktionen, Workshops und Pflanztrupps – check-in mit GPS,
            sammle XP und Badges. Built for Vienna, optimized for HTL Spengergasse.
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link to="/register" className="btn-hero-primary">
              Jetzt loslegen
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <a href="#features" className="btn-hero-secondary">
              Mehr erfahren
            </a>
          </motion.div>
          <motion.div
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {[
              ["18+", "Aktivitäten"],
              ["GPS", "Check-in"],
              ["5", "Badges"],
            ].map(([val, lbl]) => (
              <div key={lbl}>
                <strong>{val}</strong>
                <span>{lbl}</span>
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div
          className="scroll-hint"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span>Scroll</span>
          <div className="scroll-line" />
        </motion.div>
      </section>

      <section className="marquee-section" aria-hidden>
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="marquee-content">
              {["CLEANUP", "PLANTING", "XP", "BADGES", "WIEN", "HTL SPENGERGASSE", "ECO MAP", "CHECK-IN"].map(
                (t) => (
                  <span key={`${i}-${t}`}>{t}</span>
                )
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="landing-section">
        <Reveal>
          <p className="section-eyebrow">Features</p>
          <h2>Mehr als eine Karte.</h2>
          <p className="section-lead">
            Ein echtes Öko-Erlebnis – modern, schnell, mit Spielmechanik die motiviert.
          </p>
        </Reveal>
        <div className="feature-grid">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.12}>
              <motion.article
                className="feature-card"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="feature-img-wrap">
                  <img src={f.img} alt="" loading="lazy" />
                  <span className="feature-tag">{f.tag}</span>
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="how" className="landing-section landing-section--dark">
        <Reveal>
          <p className="section-eyebrow">So geht&apos;s</p>
          <h2>Vier Schritte zum Badge.</h2>
        </Reveal>
        <div className="steps-row">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <motion.div className="step-card" whileHover={{ scale: 1.05 }}>
                <span className="step-num">{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="htl" className="landing-section htl-banner">
        <div className="htl-visual">
          <img src={ASSETS.viennaForest} alt="Wald nahe Wien" loading="lazy" />
          <div className="htl-visual-overlay" />
        </div>
        <Reveal className="htl-copy">
          <p className="section-eyebrow">Hotspot</p>
          <h2>HTL Spengergasse</h2>
          <p>
            10+ Aktivitäten direkt in deiner Schul-Umgebung – Müllsammel-Aktionen,
            Schulhof-Grün, Naschmarkt-Patrouille und mehr. Oder erstelle eigene Events
            für deine Klasse.
          </p>
          <Link to="/register" className="btn-hero-primary">
            Für die HTL starten
          </Link>
        </Reveal>
      </section>

      <section className="landing-cta">
        <Reveal>
          <motion.div
            className="cta-box"
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>Bereit für deinen ersten Check-in?</h2>
            <p>Kostenlos registrieren. Wien wartet.</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn-hero-primary">
                Account erstellen
              </Link>
              <Link to="/login" className="btn-hero-secondary">
                Einloggen
              </Link>
            </div>
          </motion.div>
        </Reveal>
      </section>

      <footer className="landing-footer">
        <span>EcoMap Wien · 2026</span>
        <span>OpenStreetMap · Unsplash</span>
      </footer>
    </div>
  );
}