import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import "../styles/landing.css";
import { ThemeToggle } from "../components/ThemeToggle";

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setError("E-Mail oder Passwort falsch");
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
        transition={{ duration: 0.5 }}
      >
        <p className="section-eyebrow">Login</p>
        <h1>Willkommen zurück</h1>
        <p className="hero-lead" style={{ marginBottom: "1.5rem" }}>
          Melde dich an und mach weiter mit deinen Öko-Missionen.
        </p>
        <form onSubmit={handleSubmit}>
          <label>
            E-Mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="du@schule.at"
            />
          </label>
          <label>
            Passwort
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn-hero-primary btn-block" disabled={loading}>
            {loading ? "Anmelden…" : "Anmelden"}
          </button>
        </form>
        <p className="auth-footer-landing">
          Noch kein Konto? <Link to="/register">Registrieren</Link>
        </p>
      </motion.div>
    </div>
  );
}