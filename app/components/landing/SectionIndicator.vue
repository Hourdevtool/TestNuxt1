<script lang="ts">
import type { SectionItem } from "~/types/Scteion";

const DEFAULT_SECTIONS: SectionItem[] = [
  { id: "hero", name: "หน้าหลัก" },
  { id: "how-it-works", name: "วิธีใช้งาน" },
  { id: "info", name: "เกี่ยวกับเรา" },
];
</script>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import gsap from "gsap";

export interface SectionIndicatorProps {
  sections?: SectionItem[];
}

const props = withDefaults(defineProps<SectionIndicatorProps>(), {
  sections: () => DEFAULT_SECTIONS,
});

const activeSection = ref<string>(props.sections[0]?.id ?? "hero");
const navRef = ref<HTMLElement | null>(null);
const hasMounted = ref(false);
let mm: gsap.MatchMedia | null = null;

const handleScroll = () => {
  const viewportHeight = window.innerHeight;
  const scrollPosition = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight;

  // หากเลื่อนลงมาเกือบสุดหน้าเว็บ (เช่น ถึงส่วน Footer) ให้เลือก section สุดท้าย
  if (scrollPosition + viewportHeight >= documentHeight - 80) {
    if (props.sections.length > 0) {
      const lastSection = props.sections[props.sections.length - 1];
      if (lastSection) {
        activeSection.value = lastSection.id;
      }
    }
    return;
  }

  // ตรวจสอบตำแหน่งของแต่ละ section โดยอ้างอิงจากเส้นกึ่งกลางค่อนบนของหน้าจอ (45% viewport)
  const triggerPoint = viewportHeight * 0.45;
  for (let i = props.sections.length - 1; i >= 0; i--) {
    const section = props.sections[i];
    if (!section) continue;
    const targetId = section.id;
    const element = document.getElementById(targetId);
    if (element) {
      const rect = element.getBoundingClientRect();
      if (rect.top <= triggerPoint) {
        activeSection.value = targetId;
        return;
      }
    }
  }

  // ถ้าอยู่เหนือจุด trigger ทั้งหมด ให้เป็น section แรก
  if (props.sections[0]) {
    activeSection.value = props.sections[0].id;
  }
};

const scrollToSection = (id: string) => {
  activeSection.value = id;
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

// GSAP Entrance Animation สำหรับจุดบอกตำแหน่งด้านขวา
onMounted(() => {
  const navEl = navRef.value;
  if (navEl) {
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
          gsap.set(".gsap-section-dot-item", { clearProps: "all" });
          return;
        }

        gsap.fromTo(
          ".gsap-section-dot-item",
          { x: 24, opacity: 0, scale: 0.6 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.65,
            stagger: 0.1,
            delay: 0.65,
            ease: "back.out(1.7)",
          }
        );
      },
      navEl
    );
  }

  hasMounted.value = true;

  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleScroll);
  if (mm) {
    mm.revert();
  }
});

// GSAP Pulse เมื่อเปลี่ยน Section ที่กำลังเปิดดู
watch(activeSection, (newSection) => {
  if (!hasMounted.value) return;
  const navEl = navRef.value;
  if (!navEl) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const activeDot = navEl.querySelector(`[data-section-dot="${newSection}"]`);
  if (activeDot) {
    gsap.fromTo(
      activeDot,
      { scale: 0.7 },
      { scale: 1.1, duration: 0.45, ease: "elastic.out(1.2, 0.5)" }
    );
  }
});
</script>

<template>
  <nav
    ref="navRef"
    aria-label="การนำทางระหว่างส่วนของหน้า"
    class="fixed right-4 sm:right-6 xl:right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-6 sm:gap-7 select-none pointer-events-auto"
  >
    <div
      v-for="section in props.sections"
      :key="section.id"
      class="gsap-section-dot-item relative flex items-center justify-center group"
    >
      <!-- ป้ายชื่อ Section (Tooltip / Badge) ด้านซ้ายของจุด - แสดงเฉพาะตอน Hover -->
      <div
        class="absolute right-full mr-3 sm:mr-3.5 flex items-center transition-all duration-200 ease-out pointer-events-none opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0"
      >
        <span class="bg-black text-white text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.3)] whitespace-nowrap tracking-wide">
          {{ section.name }}
        </span>
      </div>

      <!-- ปุ่มกดจุด Dot Navigation -->
      <button
        type="button"
        :aria-label="`ไปยังส่วน ${section.name}`"
        :aria-current="activeSection === section.id ? 'true' : undefined"
        class="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue group"
        @click="scrollToSection(section.id)"
      >
        <span
          :data-section-dot="section.id"
          :class="`block rounded-full transition-colors duration-300 ease-out ${
            activeSection === section.id
              ? 'w-3 h-3 sm:w-3.5 sm:h-3.5 bg-black ring-2 ring-black/25 ring-offset-2 ring-offset-transparent shadow-md scale-110'
              : 'w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white border border-black/35 shadow-sm group-hover:scale-125 group-hover:border-black'
          }`"
        />
      </button>
    </div>
  </nav>
</template>
