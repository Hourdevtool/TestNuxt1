<script setup lang="ts">
import { computed, useSlots } from "vue";
import Card from "./Card.vue";
import type { CardVariant, CardSize, CardFont } from "~/types/Card";

export interface StatCardProps {
  variant?: CardVariant;
  size?: CardSize;
  fontFamily?: CardFont;
  className?: string;
  iconClassName?: string;
  title?: string;
  titleClassName?: string;
  value?: string | number;
  valueClassName?: string;
  unit?: string;
  unitClassName?: string;
}

const props = withDefaults(defineProps<StatCardProps>(), {
  variant: "default",
  size: "default",
  fontFamily: "primary",
  iconClassName: "",
  titleClassName: "",
  valueClassName: "",
  unitClassName: "",
  className: "",
});

const slots = useSlots();

const defaultIconColors: Record<CardVariant, string> = {
  default: "text-brand-blue",
  primary: "text-brand-yellow",
  blue: "text-white",
  yellow: "text-black",
  gold: "text-gold-600",
  outline: "text-slate-700",
};

const defaultTitleColors: Record<CardVariant, string> = {
  default: "text-slate-500",
  primary: "text-white/80",
  blue: "text-white/90",
  yellow: "text-black/80",
  gold: "text-gold-800/80",
  outline: "text-slate-600",
};

const defaultValueColors: Record<CardVariant, string> = {
  default: "text-slate-900",
  primary: "text-white",
  blue: "text-white",
  yellow: "text-black",
  gold: "text-gold-900",
  outline: "text-slate-900",
};

const defaultUnitColors: Record<CardVariant, string> = {
  default: "text-slate-400",
  primary: "text-white/60",
  blue: "text-white/80",
  yellow: "text-black/60",
  gold: "text-gold-700/70",
  outline: "text-slate-400",
};

const valueSizeStyles: Record<CardSize, string> = {
  sm: "text-2xl sm:text-3xl",
  default: "text-3xl sm:text-4xl",
  lg: "text-4xl sm:text-5xl",
  full: "text-3xl sm:text-4xl",
  auto: "text-2xl sm:text-3xl",
};

const iconColor = computed(() => props.iconClassName || defaultIconColors[props.variant]);
const titleColor = computed(() => props.titleClassName || defaultTitleColors[props.variant]);
const valueColor = computed(() => props.valueClassName || defaultValueColors[props.variant]);
const unitColor = computed(() => props.unitClassName || defaultUnitColors[props.variant]);
const valueSizeClass = computed(() => valueSizeStyles[props.size]);
const hasIcon = computed(() => Boolean(slots.icon));
const hasExtra = computed(() => Boolean(slots.extra));
const hasValue = computed(() => props.value !== undefined || Boolean(slots.value));
const hasUnit = computed(() => Boolean(props.unit) || Boolean(slots.unit));
</script>

<template>
  <Card
    :variant="props.variant"
    :size="props.size"
    :font-family="props.fontFamily"
    :class-name="`gap-3 ${props.className}`"
  >
    <!-- ส่วนบน: ไอคอน + ชื่อหัวข้อ -->
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2.5">
        <span v-if="hasIcon" :class="`inline-flex shrink-0 text-xl ${iconColor}`">
          <slot name="icon" />
        </span>
        <span :class="`font-secondary font-medium text-sm sm:text-base tracking-normal ${titleColor}`">
          <slot name="title">{{ props.title }}</slot>
        </span>
      </div>
      <div v-if="hasExtra" class="shrink-0">
        <slot name="extra" />
      </div>
    </div>

    <!-- ส่วนกลาง: ค่าตัวเลขหรือสถิติหลัก -->
    <div v-if="hasValue" class="my-0.5">
      <span
        :class="`font-primary font-bold ${valueSizeClass} leading-tight tracking-tight block ${valueColor}`"
      >
        <slot name="value">{{ props.value }}</slot>
      </span>
    </div>

    <!-- ส่วนล่าง: หน่วยนับ -->
    <div v-if="hasUnit">
      <span :class="`font-secondary font-normal text-xs sm:text-sm ${unitColor}`">
        <slot name="unit">{{ props.unit }}</slot>
      </span>
    </div>

    <slot />
  </Card>
</template>
