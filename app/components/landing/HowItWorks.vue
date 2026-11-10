<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface StepItem {
  number: string;
  title: string;
  description: string;
  highlight: string;
}

const STEPS: StepItem[] = [
  {
    number: "01",
    title: "ค้นหาและเลือกสนาม",
    description:
      "เลือกชนิดกีฬาและสนามกีฬาชุมชนใกล้ตัว ตรวจสอบสิ่งอำนวยความสะดวก และดูตารางเวลาที่ว่างแบบเรียลไทม์",
    highlight: "10+ ชนิดกีฬา 50+ สนาม",
  },
  {
    number: "02",
    title: "ระบุเวลาและยืนยันตัวตน",
    description:
      "เลือกช่วงเวลาที่ต้องการใช้งาน กรอกข้อมูลผู้จองทั้งแบบบุคคลทั่วไปหรือตัวแทนทีม พร้อมระบบตรวจสอบสิทธิ์ที่รวดเร็ว",
    highlight: "จองเดี่ยวหรือกลุ่มได้ทันที",
  },
  {
    number: "03",
    title: "รับรหัสเข้าใช้งานสนาม",
    description:
      "รับรหัสยืนยันการจอง (Digital Pass) สำหรับแสดงต่อเจ้าหน้าที่หรือสแกนเข้าใช้พื้นที่สนามตามเวลาที่นัดหมาย",
    highlight: "ยืนยันความปลอดภัยชัดเจน",
  },
];

const sectionRef = ref<HTMLElement | null>(null);
let mm: gsap.MatchMedia | null = null;

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);
  const sectionEl = sectionRef.value;
  if (!sectionEl) return;

  mm = gsap.matchMedia();

  mm.add(
    {
      isMotionAllowed: "(prefers-reduced-motion: no-preference)",
      isReducedMotion: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      const { isMotionAllowed } = context.conditions as {
        isMotionAllowed: boolean;
        isReducedMotion: boolean;
      };

      if (!isMotionAllowed) {
        gsap.set(
          [
            ".gsap-how-header",
            ".gsap-how-badge",
            ".gsap-how-card",
            ".gsap-how-cta-strip",
          ],
          { clearProps: "all" }
        );
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        ".gsap-how-header",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: "expo.out" },
        0
      )
        .fromTo(
          ".gsap-how-badge",
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.65, ease: "expo.out" },
          0.12
        )
        .fromTo(
          ".gsap-how-card",
          { y: 36, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "expo.out",
            clearProps: "transform",
          },
          0.2
        )
        .fromTo(
          ".gsap-how-cta-strip",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "expo.out" },
          0.45
        );
    },
    sectionEl
  );
});

onUnmounted(() => {
  if (mm) {
    mm.revert();
  }
});
</script>

<template>
  <section
    id="how-it-works"
    ref="sectionRef"
    class="relative w-full py-20 sm:py-24 lg:py-28 px-4 sm:px-6 md:px-10 xl:px-16 bg-[#0a0a0a] text-white overflow-hidden"
  >
    <!-- Decorative Background Elements -->
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-yellow via-white/20 to-transparent" />
    <div class="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-brand-yellow/10 blur-3xl pointer-events-none" />
    <div class="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

    <div class="relative z-10 max-w-[1440px] mx-auto">
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div class="gsap-how-header max-w-xl">
          <h2 class="font-primary font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white uppercase">
            ขั้นตอนการใช้งาน
          </h2>
          <p class="font-secondary text-neutral-400 text-sm sm:text-base lg:text-lg mt-3 leading-relaxed">
            3 ขั้นตอนง่ายๆ ในการเข้าถึงสนามกีฬาชุมชน จองสะดวกรวดเร็ว ไม่ต้องติดต่อเอกสารซับซ้อน
          </p>
        </div>

        <div class="gsap-how-badge flex items-center gap-2 text-xs sm:text-sm font-primary font-semibold text-brand-yellow uppercase tracking-wider">
          <span class="w-2 h-2 rounded-full bg-brand-yellow animate-pulse" />
          <span>SFM • Quick Booking Flow</span>
        </div>
      </div>

      <!-- 3 Step Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <div
          v-for="(step, index) in STEPS"
          :key="step.number"
          class="gsap-how-card group relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-brand-yellow/60 transition-all duration-300 hover:-translate-y-1 shadow-lg"
        >
          <div>
            <!-- Step Top Bar: Number & Icon -->
            <div class="flex items-center justify-between mb-6">
              <span class="font-primary font-black text-3xl sm:text-4xl text-brand-yellow tracking-tight">
                {{ step.number }}
              </span>
              <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:text-brand-yellow group-hover:border-brand-yellow/40 transition-colors duration-200">
                <svg v-if="index === 0" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <svg v-else-if="index === 1" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>

            <h3 class="font-primary font-bold text-xl sm:text-2xl text-white mb-3">
              {{ step.title }}
            </h3>

            <p class="font-secondary text-neutral-400 text-sm sm:text-base leading-relaxed">
              {{ step.description }}
            </p>
          </div>

          <!-- Step Card Footer Badge -->
          <div class="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-500 font-primary">
            <span class="text-brand-yellow/90 font-medium">{{ step.highlight }}</span>
            <span class="uppercase tracking-wider">Step {{ step.number }}</span>
          </div>
        </div>
      </div>

      <!-- Bottom Conversion Strip -->
      <div class="gsap-how-cta-strip mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div class="text-center sm:text-left">
          <h4 class="font-primary font-bold text-lg sm:text-xl text-white">
            พร้อมออกกำลังกายแล้วหรือยัง?
          </h4>
          <p class="font-secondary text-neutral-400 text-xs sm:text-sm mt-1">
            สำรวจสนามกีฬาในพื้นที่ชุมชนและทำการจองได้ตลอด 24 ชั่วโมง
          </p>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <NuxtLink
            to="/booking"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-yellow text-black hover:bg-yellow-400 active:scale-95 font-primary font-bold text-sm rounded-full transition-all duration-200 shadow-md"
          >
            <span>ไปที่หน้าจองสนาม</span>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
