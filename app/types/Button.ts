import type { ButtonHTMLAttributes } from "vue";

export type ButtonVariant = "primary" | "secondary" | "gold" | "outline";
export type ButtonSize = "default" | "sm" | "lg" | "full" | "auto";

export interface ButtonProps extends /* @vue-ignore */ ButtonHTMLAttributes {
  /** รูปแบบสีของปุ่ม */
  variant?: ButtonVariant;
  /** ขนาดของปุ่ม */
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}
