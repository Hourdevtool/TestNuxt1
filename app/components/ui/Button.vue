<script setup lang="ts">
import { computed } from "vue";
import type { ButtonVariant, ButtonSize } from "~/types/Button";

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: "primary",
  size: "default",
  className: "",
  disabled: false,
  type: "button",
});

const baseStyles =
  "inline-flex items-center justify-center font-primary font-medium rounded-[10px] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none";

const sizeStyles: Record<ButtonSize, string> = {
  default: "w-[145px] h-[37px] text-sm",
  sm: "w-[110px] h-[32px] text-xs",
  lg: "w-[180px] h-[44px] text-base",
  auto: "px-4 py-2 text-sm w-auto h-auto",
  full: "w-full h-[37px] text-sm",
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-brand-yellow text-black hover:brightness-95 active:scale-[0.98]",
  secondary: "bg-button-primary text-brand-text hover:brightness-110 active:scale-[0.98]",
  gold: "bg-gold-400 text-black hover:bg-gold-500 active:scale-[0.98]",
  outline: "bg-transparent text-black border border-current hover:bg-black/5 active:scale-[0.98]",
};

const computedClass = computed(
  () => `${baseStyles} ${sizeStyles[props.size]} ${variantStyles[props.variant]} ${props.className}`
);
</script>

<template>
  <button :type="props.type" :class="computedClass" :disabled="props.disabled">
    <slot />
  </button>
</template>
