import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "light" | "ghost" | "on-dark";
type Size = "default" | "sm";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  children: ReactNode;
  className?: string;
};

type AsLink = CommonProps & {
  href: string;
  external?: boolean;
} & Omit<ComponentProps<"a">, "href" | "children" | "className">;

type AsButton = CommonProps & {
  href?: undefined;
} & Omit<ComponentProps<"button">, "children" | "className">;

type ButtonProps = AsLink | AsButton;

function classes({
  variant = "primary",
  size = "default",
  className = "",
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return [
    "btn",
    `btn-${variant}`,
    size === "sm" ? "btn-sm" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

function Inner({
  variant,
  children,
  arrow,
}: {
  variant: Variant;
  children: ReactNode;
  arrow?: boolean;
}) {
  // Only the primary variant uses the gradient-clipped label spans.
  if (variant === "primary") {
    return (
      <>
        <span className="btn-label">{children}</span>
        {arrow && (
          <span className="btn-arrow" aria-hidden="true">
            →
          </span>
        )}
      </>
    );
  }
  return (
    <>
      <span>{children}</span>
      {arrow && (
        <span aria-hidden="true" style={{ marginLeft: -2 }}>
          →
        </span>
      )}
    </>
  );
}

export function Button(props: ButtonProps) {
  const { variant = "primary", size, arrow, children, className } = props;
  const cls = classes({ variant, size, className });

  if ("href" in props && props.href) {
    const { href, external, ...rest } = props as AsLink;
    if (external || href.startsWith("mailto:") || href.startsWith("http")) {
      return (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className={cls}
          {...(rest as ComponentProps<"a">)}
        >
          <Inner variant={variant} arrow={arrow}>
            {children}
          </Inner>
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        <Inner variant={variant} arrow={arrow}>
          {children}
        </Inner>
      </Link>
    );
  }

  const { href: _ignored, ...rest } = props as AsButton & { href?: undefined };
  return (
    <button className={cls} {...(rest as ComponentProps<"button">)}>
      <Inner variant={variant} arrow={arrow}>
        {children}
      </Inner>
    </button>
  );
}
