import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const NAV = [
  { to: "/dashboard", label: "Home", icon: "home" },
  { to: "/map", label: "Karte", icon: "map" },
  { to: "/create", label: "Neu", icon: "create", fab: true },
  { to: "/profile", label: "Profil", icon: "profile" },
] as const;

function Icon({ name }: { name: (typeof NAV)[number]["icon"] }) {
  if (name === "create") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  }
  const paths: Record<string, React.ReactNode> = {
    home: <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />,
    map: (
      <>
        <path d="M2 7l8-4 8 4v12l-8 4-8-4z" />
        <path d="M10 3v16M14 7v12" />
      </>
    ),
    profile: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c0-3.5 3.5-5.5 7-5.5s7 2 7 5.5" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      {paths[name]}
    </svg>
  );
}

export function AppDock() {
  const { pathname } = useLocation();

  return (
    <nav className="app-dock" aria-label="Navigation">
      <div className="app-dock-inner">
        {NAV.map((item) => {
          const active = pathname === item.to || (item.to === "/dashboard" && pathname === "/");
          if ("fab" in item && item.fab) {
            return (
              <Link key={item.to} to={item.to} className={`dock-fab ${active ? "active" : ""}`}>
                <Icon name={item.icon} />
              </Link>
            );
          }
          return (
            <Link key={item.to} to={item.to} className={`dock-item ${active ? "active" : ""}`}>
              {active && (
                <motion.span
                  layoutId="dock-pill"
                  className="dock-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="dock-icon">
                <Icon name={item.icon} />
              </span>
              <span className="dock-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}