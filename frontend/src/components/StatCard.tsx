interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: "green" | "blue" | "purple" | "gold";
  icon?: React.ReactNode;
}

export function StatCard({ label, value, sub, accent = "green", icon }: StatCardProps) {
  return (
    <div className={`stat-card stat-card--${accent}`}>
      {icon && <div className="stat-card-icon">{icon}</div>}
      <span className="stat-card-value">{value}</span>
      <span className="stat-card-label">{label}</span>
      {sub && <span className="stat-card-sub">{sub}</span>}
    </div>
  );
}