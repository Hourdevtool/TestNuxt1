<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const showScrollTop = ref(false);
const footerRef = ref<HTMLElement | null>(null);
let mm: gsap.MatchMedia | null = null;

const handleScroll = () => {
  if (window.scrollY > 250) {
    showScrollTop.value = true;
  } else {
    showScrollTop.value = false;
  }
};

const scrollToTop = () => {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  gsap.registerPlugin(ScrollTrigger);
  const footerEl = footerRef.value;
  if (!footerEl) return;

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
        gsap.set(".gsap-footer-col, .gsap-footer-bottom", { clearProps: "all" });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerEl,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        ".gsap-footer-col",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "expo.out",
        }
      ).fromTo(
        ".gsap-footer-bottom",
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.35"
      );
    },
    footerEl
  );
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  if (mm) {
    mm.revert();
  }
});
</script>

<template>
  <!-- ปุ่มกลับสู่ด้านบนแบบลอยตัว (Floating Action Button) -->
  <button
    type="button"
    aria-label="กลับสู่ด้านบน"
    :class="`fixed bottom-6 right-6 z-50 flex items-center justify-center w-11 h-11 rounded-full bg-footer-bg/90 border border-white/20 text-white shadow-[0_10px_25px_rgba(0,0,0,0.5)] backdrop-blur-md hover:bg-brand-blue hover:border-brand-blue/50 active:scale-95 transition-all duration-300 group cursor-pointer ${
      showScrollTop
        ? 'opacity-100 translate-y-0 pointer-events-auto'
        : 'opacity-0 translate-y-4 pointer-events-none'
    }`"
    @click="scrollToTop"
  >
    <svg
      class="w-5 h-5 text-brand-yellow group-hover:text-white group-hover:-translate-y-0.5 transition-all duration-200"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  </button>

  <!-- ตัว Footer หลัก -->
  <footer
    ref="footerRef"
    class="w-full bg-footer-bg text-white border-t border-white/10 select-none"
  >
    <div class="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-10">
      <!-- ตารางเนื้อหาหลัก 4 คอลัมน์ (ขนาดกระชับและรองรับ Responsive) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- คอลัมน์ที่ 1: แบรนด์และพันธกิจระบบ -->
        <div class="gsap-footer-col flex flex-col gap-3">
          <NuxtLink to="/" class="flex items-center gap-3 group w-fit">
            <div class="relative w-8 h-8 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm">
              <img
                src="/icon.svg"
                width="22"
                height="22"
                alt="SFM Icon"
                class="object-contain"
              />
            </div>
            <div class="flex flex-col">
              <span class="font-primary font-bold text-lg leading-tight tracking-tight text-white group-hover:text-brand-yellow transition-colors">
                SFM
              </span>
              <span class="font-secondary text-[11px] text-slate-300 font-light leading-none mt-0.5">
                Sports Facility Management
              </span>
            </div>
          </NuxtLink>
          <p class="font-secondary text-xs sm:text-[13px] text-slate-300 leading-relaxed max-w-xs mt-1">
            ระบบจัดการสนามกีฬาภายในชุมชนครบวงจร เพื่อส่งเสริมสุขภาพ สุขภาวะ และการออกกำลังกายของประชาชนอย่างทั่วถึง
          </p>
        </div>

        <!-- คอลัมน์ที่ 2: เมนูระบบหลัก -->
        <div class="gsap-footer-col flex flex-col gap-3">
          <h4 class="font-primary font-semibold text-sm sm:text-[15px] text-white tracking-wide">
            เมนูระบบ
          </h4>
          <ul class="flex flex-col gap-2 font-secondary text-xs sm:text-[13px]">
            <li>
              <NuxtLink to="/" class="text-slate-300 hover:text-brand-yellow transition-colors">
                หน้าหลัก
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/booking" class="text-slate-300 hover:text-brand-yellow transition-colors">
                จองสนาม
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/reportproplem" class="text-slate-300 hover:text-brand-yellow transition-colors">
                แจ้งปัญหาการใช้งาน
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/news" class="text-slate-300 hover:text-brand-yellow transition-colors">
                ข่าวสารและประชาสัมพันธ์
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/register" class="text-slate-300 hover:text-brand-yellow transition-colors">
                สมัครสมาชิกผู้ใช้บริการ
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/login" class="text-slate-300 hover:text-brand-yellow transition-colors">
                เข้าสู่ระบบ
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- คอลัมน์ที่ 3: ระบบช่วยเหลือและผู้ใช้งาน -->
        <div class="gsap-footer-col flex flex-col gap-3">
          <h4 class="font-primary font-semibold text-sm sm:text-[15px] text-white tracking-wide">
            ช่วยเหลือและบริการ
          </h4>
          <ul class="flex flex-col gap-2 font-secondary text-xs sm:text-[13px] text-slate-300">
            <li>
              <NuxtLink to="/reportproplem" class="hover:text-brand-yellow transition-colors">
                แจ้งเหตุขัดข้องทางเทคนิค
              </NuxtLink>
            </li>
            <li>
              <span class="cursor-pointer hover:text-brand-yellow transition-colors">
                ระเบียบการใช้สนามและอุปกรณ์
              </span>
            </li>
          </ul>
        </div>

        <!-- คอลัมน์ที่ 4: เวลาทำการและช่องทางติดต่อ -->
        <div class="gsap-footer-col flex flex-col gap-3">
          <h4 class="font-primary font-semibold text-sm sm:text-[15px] text-white tracking-wide">
            เวลาทำการและติดต่อ
          </h4>

          <div class="flex flex-col gap-2.5 font-secondary text-xs sm:text-[13px] text-slate-300 mt-0.5">
            <div class="flex items-center gap-2.5">
              <svg
                class="w-3.5 h-3.5 text-brand-yellow shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>โทรศัพท์: 02-123-4567</span>
            </div>
            <div class="flex items-center gap-2.5">
              <svg
                class="w-3.5 h-3.5 text-brand-yellow shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>อีเมล: contact@sfm-community.go.th</span>
            </div>
          </div>
        </div>
      </div>

      <!-- แถวล่างสุด: ลิขสิทธิ์และข้อตกลงทางกฎหมาย -->
      <div class="gsap-footer-bottom pt-6 mt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs font-secondary text-slate-400">
        <p>© 2026 SFM (Sports Facility Management). สงวนลิขสิทธิ์ทั้งหมด</p>
        <div class="flex flex-wrap items-center gap-5">
          <span class="hover:text-slate-200 transition-colors cursor-pointer">
            นโยบายความเป็นส่วนตัว (Privacy Policy)
          </span>
          <span class="hover:text-slate-200 transition-colors cursor-pointer">
            ข้อกำหนดและเงื่อนไข (Terms of Service)
          </span>
          <span class="hover:text-slate-200 transition-colors cursor-pointer">
            มาตรการคุ้มครองข้อมูล (PDPA)
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>
