interface LogoMarkProps {
  size?: number;
  className?: string;
}

export function LogoMark({ size = 28, className = "" }: LogoMarkProps) {
  return (
    <img
      src="/logo.png"
      alt=""
      width={size}
      height={size}
      className={`logo-mark ${className}`.trim()}
      decoding="async"
    />
  );
}