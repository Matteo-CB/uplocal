import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "default" | "large";
  href?: undefined;
}

export function Button({
  variant = "primary",
  size = "default",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-medium transition-colors duration-200 ease-out rounded-sm cursor-pointer font-body";

  const variants = {
    primary:
      "bg-accent text-white hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "border border-ink bg-transparent text-ink hover:bg-ink hover:text-paper disabled:opacity-50 disabled:cursor-not-allowed",
  };

  const sizes = {
    default: "min-h-12 px-6 text-sm",
    large: "min-h-14 px-8 text-base",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
