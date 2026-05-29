import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "fill" | "outline" | "band";
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
  variant = "fill",
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

function Inner({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
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
  const { variant, size, arrow, children, className } = props;
  const cls = classes({ variant, size, className });
  const inner = <Inner arrow={arrow}>{children}</Inner>;

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
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }

  const { href: _ignored, ...rest } = props as AsButton & { href?: undefined };
  return (
    <button className={cls} {...(rest as ComponentProps<"button">)}>
      {inner}
    </button>
  );
}
