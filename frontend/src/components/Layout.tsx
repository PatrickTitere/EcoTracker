import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { AppBackground } from "./app/AppBackground";
import { AppDock } from "./app/AppDock";
import { ThemeToggle } from "./ThemeToggle";
import { LogoMark } from "./LogoMark";
import { xpProgressInLevel } from "../lib/gamification";

export function Layout() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const isMap = pathname === "/map";
  const progress = xpProgressInLevel(user?.xp ?? 0);

  return (
    <div className={`app-shell ${isMap ? "app-shell--map" : ""}`}>
      {!isMap && <AppBackground />}

      {!isMap && (
        <header className="app-topbar">
          <Link to="/dashboard" className="app-brand">
            <LogoMark size={28} />
            <span className="app-brand-text">
              Eco<span>Map</span>
            </span>
          </Link>

          <div className="app-topbar-xp">
            <div className="topbar-xp-track">
              <motion.div
                className="topbar-xp-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress.percent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <span className="topbar-lvl">LV {user?.level ?? 1}</span>
            <span className="topbar-xp-val">{user?.xp ?? 0}</span>
          </div>

          <div className="app-topbar-actions">
            <ThemeToggle />
            <button type="button" className="app-icon-btn" onClick={logout} aria-label="Abmelden">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5M15 12H3" />
              </svg>
            </button>
          </div>
        </header>
      )}

      {isMap && (
        <div className="map-topbar-minimal">
          <Link to="/dashboard" className="app-brand">
            <LogoMark size={28} />
            <span className="app-brand-text">
              Eco<span>Map</span>
            </span>
          </Link>
          <div className="app-topbar-actions">
            <ThemeToggle />
          </div>
        </div>
      )}

      <motion.main
        className="app-content"
        initial={isMap ? false : { opacity: 0, y: 12 }}
        animate={isMap ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Outlet />
      </motion.main>

      <AppDock />
    </div>
  );
}