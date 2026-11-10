<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StatCard from "~/components/ui/StatCard.vue";

const sectionRef = ref<HTMLElement | null>(null);
const sportsCount = ref<number>(10);
const stadiumsCount = ref<number>(50);

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
        sportsCount.value = 10;
        stadiumsCount.value = 50;
        gsap.set(
          [
            ".gsap-info-bg-yellow",
            ".gsap-info-top-bar",
            ".gsap-info-text-line",
            ".gsap-info-subtext",
            ".gsap-info-vertical-tag",
            ".gsap-info-device",
            ".gsap-info-stat-card",
            ".gsap-info-deco",
            ".gsap-info-svg-path",
          ],
          { clearProps: "all" }
        );
        return;
      }

      // เตรียมความยาวเส้น SVG สำหรับ Stroke Draw
      const svgPaths = gsap.utils.toArray<SVGPathElement>(".gsap-info-svg-path");
      svgPaths.forEach((path) => {
        const length = path.getTotalLength ? path.getTotalLength() : 160;
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      const counterProxy = { sports: 0, stadiums: 0 };

      // 1. Choreographed ScrollTrigger Entrance (Play Once เมื่อเลื่อนมาถึง)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 72%",
          toggleActions: "play none none none",
        },
      });

      // พื้นหลังสีเหลืองฝั่งขวาสไลด์คลี่ออกรับสายตา
      tl.fromTo(
        ".gsap-info-bg-yellow",
        { scaleX: 0, transformOrigin: "right center" },
        { scaleX: 1, duration: 0.9, ease: "expo.inOut" },
        0
      )
        // ขีดสีดำหนาด้านซ้ายบนขยายออก
        .fromTo(
          ".gsap-info-top-bar",
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.7, ease: "expo.out" },
          0.15
        )
        // ข้อความหลักเชิดขึ้นจากกรอบซ่อน (Masked Line/Word Reveal)
        .fromTo(
          ".gsap-info-text-line",
          { yPercent: 115, rotateZ: 1.5, opacity: 0 },
          {
            yPercent: 0,
            rotateZ: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.09,
            ease: "expo.out",
          },
          0.18
        )
        // ป้ายแนวตั้ง SFM • Platform
        .fromTo(
          ".gsap-info-vertical-tag",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          0.28
        )
        // คำอธิบายย่อยและป้ายหมวดหมู่ด้านล่าง
        .fromTo(
          ".gsap-info-subtext",
          { y: 22, opacity: 0, filter: "blur(4px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "filter",
          },
          0.34
        )
        // รูปตัวอย่างการใช้งานบนอุปกรณ์ (device.gif) ขยายขึ้นอย่างนุ่มนวล
        .fromTo(
          ".gsap-info-device",
          { scale: 0.86, y: 36, opacity: 0 },
          {
            scale: 1,
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "expo.out",
          },
          0.26
        )
        // การ์ดสถิติทั้ง 2 ใบ เด้งขึ้นด้วยจังหวะ Spring
        .fromTo(
          ".gsap-info-stat-card",
          { y: 34, scale: 0.82, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.78,
            stagger: 0.15,
            ease: "back.out(1.65)",
          },
          0.42
        )
        // วิ่งนับตัวเลขสถิติ 0 -> 10+ และ 0 -> 50+
        .fromTo(
          counterProxy,
          { sports: 0, stadiums: 0 },
          {
            sports: 10,
            stadiums: 50,
            duration: 1.5,
            ease: "power3.out",
            onStart: () => {
              sportsCount.value = 0;
              stadiumsCount.value = 0;
            },
            onUpdate: () => {
              sportsCount.value = Math.round(counterProxy.sports);
              stadiumsCount.value = Math.round(counterProxy.stadiums);
            },
          },
          0.42
        )
        // วาดเส้นคลื่นและเส้นซิกแซก (SVG Stroke Draw)
        .to(
          svgPaths,
          {
            strokeDashoffset: 0,
            duration: 0.95,
            stagger: 0.1,
            ease: "power3.inOut",
          },
          0.45
        )
        // จุด Dot Grid, กากบาท ✕ และวงกลมรอบนอก Pop-in
        .fromTo(
          ".gsap-info-deco",
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.55,
            stagger: 0.025,
            ease: "back.out(1.8)",
          },
          0.38
        );

      // 2. Active Scroll Parallax (ทำงานต่อเนื่องตามการเลื่อนหน้าจอ)
      const parallaxTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      parallaxTl
        .fromTo(
          ".gsap-info-watermark",
          { xPercent: -6, yPercent: 14 },
          { xPercent: 8, yPercent: -14, ease: "none" },
          0
        )
        .fromTo(
          ".gsap-info-bg-circle",
          { yPercent: 16, scale: 0.94 },
          { yPercent: -16, scale: 1.04, ease: "none" },
          0
        )
        .fromTo(
          ".gsap-info-deco-parallax",
          { yPercent: 10 },
          { yPercent: -12, ease: "none" },
          0
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
    id="info"
    ref="sectionRef"
    class="relative w-full max-w-full min-h-screen xl:h-screen overflow-hidden select-none bg-white"
  >
    <!-- พื้นหลังแบ่งครึ่ง ซ้ายขาว - ขวาเหลือง -->
    <div class="absolute inset-0 flex flex-col lg:flex-row pointer-events-none">
      <div class="w-full lg:w-1/2 h-1/2 lg:h-full bg-white" />
      <div class="gsap-info-bg-yellow w-full lg:w-1/2 h-1/2 lg:h-full bg-brand-yellow will-change-transform" />
    </div>

    <!-- ================= ของตกแต่งรอบนอก (Background Decorations) ================= -->
    <div class="gsap-info-deco-parallax absolute inset-0 pointer-events-none z-10 overflow-hidden">
      <!-- --- ฝั่งซ้าย (ขาว) --- -->
      <!-- ลายน้ำตัวหนังสือขนาดใหญ่ด้านหลัง (Watermark Background) -->
      <span class="gsap-info-watermark hidden xl:block absolute -left-4 -bottom-10 text-[180px] 2xl:text-[220px] font-black text-neutral-100 leading-none select-none -z-10 tracking-tighter will-change-transform">
        INFO
      </span>

      <!-- จุด Dot Grid 4x3 ตกแต่งมุมซ้ายบน -->
      <div class="hidden xl:grid grid-cols-4 gap-3 absolute left-[7%] top-[12%] opacity-35">
        <span
          v-for="i in 12"
          :key="i"
          class="gsap-info-deco w-1.5 h-1.5 bg-black rounded-full block"
        />
      </div>

      <!-- เส้นคลื่นหยัก (Wave) ฝั่งซ้าย -->
      <svg
        class="hidden xl:block absolute left-[8%] bottom-[24%] w-36 h-5 text-neutral-300"
        viewBox="0 0 140 20"
        fill="none"
      >
        <path
          class="gsap-info-svg-path"
          d="M2 10 Q 11 2, 20 10 T 38 10 T 56 10 T 74 10 T 92 10 T 110 10 T 128 10"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        />
      </svg>

      <span class="gsap-info-deco hidden xl:block absolute left-[38%] top-[20%] text-black/50 font-black text-base">
        ✕
      </span>

      <!-- วงกลมเส้นบาง + จุดดำ มุมซ้ายล่าง -->
      <div class="gsap-info-deco hidden xl:flex absolute left-[7%] bottom-[10%] items-center">
        <span class="w-7 h-7 rounded-full border-2 border-black/70 block" />
        <span class="w-2 h-2 bg-black rounded-full -mt-6 ml-2 block" />
      </div>

      <!-- --- ฝั่งขวา (เหลือง) --- -->
      <!-- วงกลมเส้นบางขนาดใหญ่ ซ้อนอยู่หลังรูปภาพ -->
      <div class="gsap-info-bg-circle hidden xl:block absolute right-[10%] top-[18%] w-64 h-64 2xl:w-80 2xl:h-80 rounded-full border-2 border-black/20 will-change-transform" />

      <!-- กากบาท 3 ตัวเรียงกัน ✕ ✕ ✕ ฝั่งขวา -->
      <div class="hidden xl:flex absolute right-[28%] top-[12%] items-center gap-3 text-black font-extrabold text-sm">
        <span class="gsap-info-deco">✕</span>
        <span class="gsap-info-deco">✕</span>
        <span class="gsap-info-deco">✕</span>
      </div>

      <!-- เส้นซิกแซกคู่ (ขาว + ดำ) ตกแต่งมุมขวาล่าง -->
      <div class="hidden xl:flex absolute right-[5%] bottom-[8%] flex-col gap-2">
        <svg class="w-28 2xl:w-36 h-3.5 text-white" viewBox="0 0 140 16" fill="none">
          <path
            class="gsap-info-svg-path"
            d="M2 14 L 14 2 L 26 14 L 38 2 L 50 14 L 62 2 L 74 14 L 86 2 L 98 14 L 110 2 L 122 14 L 134 2"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg class="w-28 2xl:w-36 h-3.5 text-black" viewBox="0 0 140 16" fill="none">
          <path
            class="gsap-info-svg-path"
            d="M2 14 L 14 2 L 26 14 L 38 2 L 50 14 L 62 2 L 74 14 L 86 2 L 98 14 L 110 2 L 122 14 L 134 2"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <!-- ================= คอนเทนเนอร์หลัก (Main Container) ================= -->
    <div class="relative z-20 w-full max-w-[1520px] mx-auto min-h-screen xl:h-screen flex flex-col lg:flex-row">
      <!-- ================= content ฝั่งซ้าย (พื้นหลังขาว) ================= -->
      <div class="w-full lg:w-1/2 min-h-[50vh] lg:min-h-screen flex flex-col justify-between px-6 sm:px-12 md:px-16 xl:px-20 py-10 lg:py-16">
        <!-- แถวบน: ขีดสีดำหนา + ชื่อระบบ -->
        <div class="flex items-center justify-between w-full max-w-xl">
          <span class="gsap-info-top-bar w-16 sm:w-20 xl:w-24 h-3 sm:h-3.5 bg-black block will-change-transform" />
          <span class="overflow-hidden py-1 -my-1">
            <span class="gsap-info-text-line block font-primary font-bold text-xs sm:text-sm xl:text-base text-black/80 tracking-widest uppercase will-change-transform">
              SFM • Community Sport
            </span>
          </span>
        </div>

        <div class="flex items-center gap-6 sm:gap-10 xl:gap-12 my-auto py-8">
          <div class="gsap-info-vertical-tag relative flex items-center justify-center w-8">
            <span class="font-primary font-black text-xs sm:text-sm xl:text-base text-black whitespace-nowrap -rotate-90 tracking-[0.22em] uppercase">
              SFM • Platform
            </span>
          </div>

          <!-- Title และคำอธิบาย -->
          <div class="flex flex-col">
            <h2 class="font-primary font-black text-black text-6xl sm:text-7xl md:text-8xl xl:text-[100px] 2xl:text-[110px] tracking-tight leading-[0.92] uppercase">
              <span class="block overflow-hidden py-3 -my-3">
                <span class="gsap-info-text-line block will-change-transform">
                  เกี่ยวกับเรา
                </span>
              </span>
            </h2>
            <p class="gsap-info-subtext font-secondary text-black/75 text-lg sm:text-xl xl:text-2xl mt-4 sm:mt-6 font-medium max-w-md leading-relaxed">
              แพลตฟอร์มบริหารจัดการสนามกีฬาครบวงจร รองรับทุกความต้องการทั้งผู้ดูแลสนามและผู้ใช้งานทั่วไป
            </p>
          </div>
        </div>

        <!-- แถวล่าง: จุดระบุหน้า/หมวดหมู่ -->
        <div class="gsap-info-subtext flex items-center gap-3">
          <span class="w-3 h-3 bg-black block" />
          <span class="font-primary font-semibold text-xs sm:text-sm text-black/70 tracking-widest uppercase">
            SFM • Facility Info
          </span>
        </div>
      </div>

      <!-- ================= content ฝั่งขวา (พื้นหลังเหลือง) ================= -->
      <div class="w-full lg:w-1/2 min-h-[50vh] lg:min-h-screen flex flex-col justify-between px-6 sm:px-12 md:px-14 xl:px-16 py-10 lg:py-16">
        <!-- ข้อความมุมขวาบน -->
        <div class="flex flex-col items-end text-right self-end mt-1 lg:mt-4">
          <p class="font-primary font-black text-black text-xl sm:text-2xl xl:text-[28px] tracking-wide leading-tight">
            <span class="block overflow-hidden py-1.5 -my-1.5">
              <span class="gsap-info-text-line block will-change-transform">
                ลงทะเบียนเข้าใช้งานฟรี
              </span>
            </span>
          </p>
          <p class="gsap-info-subtext font-secondary text-black/85 text-sm sm:text-base xl:text-lg font-medium mt-1">
            เสถียรและใช้งานง่าย
          </p>
        </div>

        <!-- พื้นที่แสดงรูป device.gif ขยายขนาดใหญ่ พร้อมกรอบและเงาดีไซน์พรีเมียม -->
        <div class="relative w-full max-w-[1000px] xl:max-w-[780px] 2xl:max-w-[840px] h-[300px] sm:h-[400px] md:h-[450px] xl:h-[480px] 2xl:h-[510px] mx-auto my-auto flex items-center justify-center">
          <!-- การ์ดมุมซ้ายบน: ประเภทกีฬา -->
          <div class="gsap-info-stat-card absolute -top-4 -left-2 sm:-top-6 sm:-left-6 lg:-top-8 lg:-left-10 z-30 will-change-transform">
            <div class="transform hover:-translate-y-1 transition-transform duration-300">
              <StatCard
                variant="blue"
                size="sm"
                title="ประเภทกีฬา"
                :value="`${sportsCount}+`"
                value-class-name="text-white tabular-nums"
                unit="ชนิดกีฬาที่รองรับ"
                class-name="shadow-2xl shadow-blue-950/25"
              >
                <template #icon>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m4.93 4.93 4.24 4.24" />
                    <path d="m14.83 9.17 4.24-4.24" />
                    <path d="m14.83 14.83 4.24 4.24" />
                    <path d="m9.17 14.83-4.24 4.24" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </template>
              </StatCard>
            </div>
          </div>

          <div class="gsap-info-device relative w-full h-full will-change-transform">
            <img
              src="/device.gif"
              alt="ตัวอย่างการใช้งานบนอุปกรณ์ต่างๆ"
              class="absolute inset-0 w-full h-full object-contain"
            />
          </div>

          <!-- การ์ดมุมขวาล่าง: สนามบนแพลตฟอร์ม -->
          <div class="gsap-info-stat-card absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-6 lg:-bottom-8 lg:-right-10 z-30 will-change-transform">
            <div class="transform hover:-translate-y-1 transition-transform duration-300">
              <StatCard
                variant="blue"
                size="sm"
                title="สนามบนแพลตฟอร์ม"
                :value="`${stadiumsCount}+`"
                value-class-name="text-white tabular-nums"
                unit="สนาม"
                class-name="shadow-2xl shadow-blue-950/25"
              >
                <template #icon>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M3 21h18" />
                    <path d="M5 21V7l7-4 7 4v14" />
                    <path d="M9 10a3 3 0 0 1 6 0v11" />
                  </svg>
                </template>
              </StatCard>
            </div>
          </div>
        </div>

        <!-- ข้อความด้านล่างสุด ขยายใหญ่โดดเด่น -->
        <div class="w-full text-center lg:text-left mt-4">
          <h3 class="font-primary font-black text-black text-4xl sm:text-5xl md:text-6xl xl:text-[68px] 2xl:text-[76px] leading-none tracking-tight">
            <span class="block overflow-hidden py-2.5 -my-2.5">
              <span class="gsap-info-text-line block will-change-transform">
                ใช้งานได้ทุกอุปกรณ์
              </span>
            </span>
          </h3>
        </div>
      </div>
    </div>
  </section>
</template>
