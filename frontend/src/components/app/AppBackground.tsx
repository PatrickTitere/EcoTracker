import { motion } from "framer-motion";

export function AppBackground() {
  return (
    <div className="app-bg" aria-hidden>
      <motion.div
        className="app-bg-orb app-bg-orb--1"
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="app-bg-orb app-bg-orb--2"
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="app-bg-orb app-bg-orb--3"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 14, repeat: Infinity }}
      />
      <div className="app-bg-grid" />
    </div>
  );
}