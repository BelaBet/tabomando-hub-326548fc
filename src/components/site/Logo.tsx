import { Link } from "@tanstack/react-router";

export function Logo({ size = "md", invert = false }: { size?: "sm" | "md" | "lg"; invert?: boolean }) {
  const sizes = { sm: "text-lg", md: "text-2xl", lg: "text-4xl md:text-5xl" }[size];
  return (
    <Link to="/" aria-label="Tá Sabendo? — início" className="ts-logo inline-flex items-baseline gap-0.5">
      <span className={`${sizes} ${invert ? "text-white" : "text-ink"}`}>TÁ SABENDO</span>
      <span
        className={`${sizes} inline-flex h-[1em] w-[0.7em] items-center justify-center rounded-sm`}
        style={{ background: "var(--brand-red)", color: "var(--brand-white)" }}
      >
        ?
      </span>
    </Link>
  );
}
