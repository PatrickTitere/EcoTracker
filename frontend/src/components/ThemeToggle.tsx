import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
    </svg>
  );
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={`theme-toggle ${isDark ? "theme-toggle--dark" : "theme-toggle--light"} ${className}`}
      onClick={toggleTheme}
      aria-label={isDark ? "Light Mode aktivieren" : "Dark Mode aktivieren"}
      title={isDark ? "Light Mode" : "Dark Mode"}
    >
      <span className="theme-toggle-icon theme-toggle-icon--moon">
        <MoonIcon />
      </span>
      <span className="theme-toggle-icon theme-toggle-icon--sun">
        <SunIcon />
      </span>
      <motion.span
        className="theme-toggle-thumb"
        layout
        transition={{ type: "spring", stiffness: 520, damping: 32 }}
        aria-hidden
      />
    </button>
  );
}