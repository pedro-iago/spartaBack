import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariantsCva = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

const variantStyles: Record<string, string> = {
  default:
    "relative text-[#171512] font-semibold bg-primary hover:bg-primary/90 hover:brightness-110 active:scale-[0.98] shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_2px_8px_rgba(0,0,0,0.2)] [&_svg]:text-[#171512]",
  destructive:
    "relative text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] bg-destructive hover:bg-destructive/90 hover:brightness-110 active:scale-[0.98]",
  outline:
    "relative text-white/90 bg-transparent border border-white/20 hover:bg-white/10 hover:text-white hover:border-white/30 active:scale-[0.98] [&_svg]:text-white/90 [&_svg]:hover:text-white",
  secondary:
    "relative text-white/90 bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] hover:text-white hover:border-white/20 active:scale-[0.98] [&_svg]:text-white/90",
  ghost:
    "relative text-white/80 hover:text-white hover:bg-white/5 active:scale-[0.98] [&_svg]:text-white/80 [&_svg]:hover:text-white",
  link:
    "bg-transparent shadow-none text-primary hover:underline hover:scale-100 hover:translate-y-0",
};

const sizeStyles: Record<string, string> = {
  default: "rounded-xl py-2 px-4 text-sm font-medium min-w-0",
  sm: "rounded-xl py-2 px-3 text-xs font-medium min-w-0",
  lg: "rounded-xl py-3 px-6 text-base font-semibold min-w-0",
  icon: "rounded-xl p-2 size-9 min-w-0",
};

type ButtonVariant = keyof typeof variantStyles;
type ButtonSize = keyof typeof sizeStyles;

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}) {
  const v = variant as ButtonVariant;
  const s = size as ButtonSize;
  const isLink = v === "link";

  const buttonClass = cn(
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1416]",
    variantStyles[v],
    sizeStyles[s],
    className
  );

  const Comp = asChild ? Slot : "button";

  return (
    <Comp data-slot="button" className={buttonClass} {...props}>
      {children}
    </Comp>
  );
}

export const buttonVariants = buttonVariantsCva;
export { Button };
