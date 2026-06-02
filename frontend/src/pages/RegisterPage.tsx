import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import "../styles/landing.css";
import { ThemeToggle } from "../components/ThemeToggle";

export function RegisterPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen haben");
      return;
    }
    setLoading(true);
    try {
      await register(email, password, displayName);
      navigate("/dashboard");
    } catch {
      setError("Registrierung fehlgeschlagen – E-Mail evtl. schon vergeben");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-landing">
      <div className="auth-top-row">
        <Link to="/" className="auth-back">
          ← Zur Startseite
        </Link>
        <ThemeToggle />
      </div>
      <motion.div
        className="auth-card-landing"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="section-eyebrow">Registrieren</p>
        <h1>Account erstellen</h1>
        <p className="hero-lead" style={{ marginBottom: "1.5rem" }}>
          Starte deine Öko-Mission in Wien.
        </p>
        <form onSubmit={handleSubmit}>
          <label>
            Anzeigename
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              minLength={2}
              placeholder="Noah"
            />
          </label>
          <label>
            E-Mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Passwort (min. 8 Zeichen)
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn-hero-primary btn-block" disabled={loading}>
            {loading ? "Registrieren…" : "Konto erstellen"}
          </button>
        </form>
        <p className="auth-footer-landing">
          Bereits registriert? <Link to="/login">Anmelden</Link>
        </p>
      </motion.div>
    </div>
  );
}