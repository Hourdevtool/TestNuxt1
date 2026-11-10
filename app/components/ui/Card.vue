<script lang="ts">
import StatCardComponent from "./StatCard.vue";
export { StatCardComponent as StatCard };
</script>

<script setup lang="ts">
import { computed } from "vue";
import type { CardVariant, CardSize, CardFont } from "~/types/Card";

export interface CardProps {
  variant?: CardVariant;
  size?: CardSize;
  fontFamily?: CardFont;
  className?: string;
}

const props = withDefaults(defineProps<CardProps>(), {
  variant: "default",
  size: "default",
  fontFamily: "primary",
  className: "",
});

const baseCardStyles =
  "relative flex flex-col justify-between transition-all duration-200 select-none";

const sizeStyles: Record<CardSize, string> = {
  sm: "p-4 min-w-[170px] rounded-[18px]",
  default: "p-5 sm:p-6 min-w-[210px] sm:min-w-[240px] rounded-[22px]",
  lg: "p-6 sm:p-8 min-w-[260px] sm:min-w-[300px] rounded-[26px]",
  full: "p-5 sm:p-6 w-full rounded-[22px]",
  auto: "p-4 sm:p-5 w-auto rounded-[20px]",
};

const variantStyles: Record<CardVariant, string> = {
  default:
    "bg-white border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.05)] text-slate-800",
  primary:
    "bg-card text-brand-text shadow-xl shadow-card/20 border border-white/10",
  blue:
    "bg-brand-blue text-white shadow-xl shadow-brand-blue/25 border border-white/20",
  yellow:
    "bg-brand-yellow text-black shadow-lg shadow-brand-yellow/20 border border-black/10",
  gold:
    "bg-gold-50 border border-gold-300 text-gold-900 shadow-md shadow-gold-900/5",
  outline:
    "bg-transparent border-2 border-slate-200 text-slate-800 hover:border-slate-300 backdrop-blur-sm",
};

const fontStyles: Record<CardFont, string> = {
  primary: "font-primary",
  secondary: "font-secondary",
};

const computedClass = computed(
  () =>
    `${baseCardStyles} ${sizeStyles[props.size]} ${variantStyles[props.variant]} ${fontStyles[props.fontFamily]} ${props.className}`
);
</script>

<template>
  <div :class="computedClass">
    <slot />
  </div>
</template>
