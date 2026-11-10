<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import gsap from "gsap";
import type { MenuItem } from "~/types/MenuItem";

const route = useRoute();
const mobileMenuOpen = ref(false);
const navRef = ref<HTMLElement | null>(null);
const hasMounted = ref(false);

// คงคำศัพท์เดิมทั้งหมด
const menulist: MenuItem[] = [
  {
    path: "/",
    name: "หน้าหลัก",
  },
  {
    path: "/booking",
    name: "จองสนาม",
  },
  {
    path: "/reportproplem",
    name: "แจ้งปัญหา",
  },
  {
    path: "/news",
    name: "ประชาสัมพันธ์",
  },
];

let mm: gsap.MatchMedia | null = null;

// GSAP Dynamic Island Opening Animation (คงรูปทรง Notch เดิมไว้ทั้งหมด)
onMounted(() => {
  const navEl = navRef.value;
  if (!navEl) return;

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
            navEl,
            ".gsap-nav-corner",
            ".gsap-nav-brand",
            ".gsap-nav-item",
            ".gsap-nav-action",
            ".gsap-nav-mobile-btn",
          ],
          { clearProps: "all" }
        );
        return;
      }

      const tl = gsap.timeline({ delay: 0.12 });

      // เริ่มต้นจากขนาดแคปซูลเล็กตรงกลางด้านบนคล้าย Dynamic Island ก่อนขยายออกเป็นทรง Notch เต็มความกว้าง
      gsap.set(navEl, {
        scaleX: 0.28,
        scaleY: 0.52,
        y: -16,
        opacity: 0,
        filter: "blur(6px)",
        transformOrigin: "50% 0%",
      });

      gsap.set(".gsap-nav-corner", {
        opacity: 0,
        scale: 0.4,
        transformOrigin: "50% 0%",
      });

      gsap.set(
        [
          ".gsap-nav-brand",
          ".gsap-nav-item",
          ".gsap-nav-action",
          ".gsap-nav-mobile-btn",
        ],
        {
          opacity: 0,
          y: -8,
          scale: 0.92,
          filter: "blur(4px)",
        }
      );

      // จังหวะที่ 1: หยดตัวลงมาจากขอบจอด้านบนเป็นเม็ด Dynamic Island
      tl.to(navEl, {
        scaleX: 0.42,
        scaleY: 0.86,
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.28,
        ease: "power3.out",
      })
        // จังหวะที่ 2: ดีดขยายด้านข้างออกเป็นรูปทรง Notch เต็มขนาดด้วย Spring แบบ iOS
        .to(navEl, {
          scaleX: 1,
          scaleY: 1,
          duration: 0.68,
          ease: "back.out(1.6)",
        })
        // มุมเว้าซ้าย-ขวาปรากฏขึ้นรับกับขอบบนอย่างแนบเนียน
        .to(
          ".gsap-nav-corner",
          {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: "power2.out",
          },
          "-=0.45"
        )
        // โลโก้ เมนู และปุ่มด้านใน ค่อยๆ เผยตัวเรียงลำดับจากด้านใน
        .to(
          [
            ".gsap-nav-brand",
            ".gsap-nav-item",
            ".gsap-nav-action",
            ".gsap-nav-mobile-btn",
          ],
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.45,
            stagger: 0.04,
            ease: "expo.out",
            clearProps: "filter,transform",
          },
          "-=0.42"
        );
    },
    navEl
  );

  hasMounted.value = true;
});

onUnmounted(() => {
  if (mm) {
    mm.revert();
  }
});

// Dynamic Island Elastic Pulse เมื่อกดเปิด/ปิดเมนูบนมือถือ
watch(mobileMenuOpen, () => {
  if (!hasMounted.value) return;
  const navEl = navRef.value;
  if (!navEl) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReduced) return;

  gsap.fromTo(
    navEl,
    { scaleX: 0.97, transformOrigin: "50% 0%" },
    {
      scaleX: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.55)",
    }
  );
});
</script>

<template>
  <!-- Backdrop Overlay เมื่อเปิดเมนูบนมือถือ -->
  <div
    v-if="mobileMenuOpen"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
    aria-hidden="true"
    @click="mobileMenuOpen = false"
  />

  <header class="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4 flex flex-col items-center">
    <!-- Top Notch Tab: เป็นแผ่นสีดำชิ้นเดียวไร้รอยต่อ (ติดเป็นอันเดียวกันตามต้นแบบ Supaste) -->
    <nav
      ref="navRef"
      :class="`relative w-[calc(100vw-2rem)] max-w-md lg:w-auto lg:max-w-max bg-[#0a0a0a] text-white border-x border-b border-white/15 px-6 pt-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-[border-radius,padding,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
        mobileMenuOpen
          ? 'rounded-b-[2.5rem] pb-6'
          : 'rounded-b-2xl sm:rounded-b-3xl pb-3.5'
      }`"
    >
      <!-- ตัวเว้าด้านซ้าย (Left Inverted Concave Corner 20px) -->
      <div class="gsap-nav-corner absolute -left-[19px] top-0 w-5 h-5 pointer-events-none">
        <svg viewBox="0 0 20 20" class="w-full h-full text-[#0a0a0a] fill-current">
          <path d="M0 0 H20 V20 A20 20 0 0 0 0 0 Z" />
          <path d="M0 0 A20 20 0 0 1 20 20" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
        </svg>
      </div>

      <!-- ตัวเว้าด้านขวา (Right Inverted Concave Corner 20px) -->
      <div class="gsap-nav-corner absolute -right-[19px] top-0 w-5 h-5 pointer-events-none scale-x-[-1]">
        <svg viewBox="0 0 20 20" class="w-full h-full text-[#0a0a0a] fill-current">
          <path d="M0 0 H20 V20 A20 20 0 0 0 0 0 Z" />
          <path d="M0 0 A20 20 0 0 1 20 20" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
        </svg>
      </div>

      <!-- แถบด้านบน: Logo, Menu Desktop และปุ่ม Hamburger/Close -->
      <div class="flex items-center justify-between gap-6 sm:gap-10 w-full">
        <!-- ด้านซ้าย: Brand Icon (สี่เหลี่ยมสีขาว) + ชื่อระบบ -->
        <NuxtLink to="/" class="gsap-nav-brand flex items-center gap-3 group shrink-0">
          <div class="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden bg-white p-1.5 flex items-center justify-center shadow-md">
            <img
              src="/icon.svg"
              width="26"
              height="26"
              alt="SFM Icon"
              class="object-contain"
            />
          </div>
          <span class="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-blue-300 transition-colors whitespace-nowrap">
            SFM
          </span>
        </NuxtLink>

        <!-- ตรงกลาง: รายการเมนูบน Desktop (ฟอนต์ใหญ่ กว้างขึ้น และห้ามตัดบรรทัด) -->
        <ul class="hidden lg:flex items-center gap-2 xl:gap-3">
          <li v-for="(menu, index) in menulist" :key="index" class="gsap-nav-item">
            <NuxtLink
              :to="menu.path"
              :class="`whitespace-nowrap text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200 block ${
                route.path === menu.path
                  ? 'text-white font-semibold bg-white/15 shadow-inner'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`"
            >
              {{ menu.name }}
            </NuxtLink>
          </li>
        </ul>

        <!-- ด้านขวาบน Desktop: ปุ่มสมัครใช้งาน + ปุ่มเข้าสู่ระบบแคปซูลขาว -->
        <div class="gsap-nav-action hidden lg:flex items-center gap-4 shrink-0">
          <NuxtLink
            to="/register"
            class="whitespace-nowrap text-sm font-medium text-zinc-300 hover:text-white transition-colors px-3 py-2 rounded-full hover:bg-white/5"
          >
            สมัครใช้งาน
          </NuxtLink>
          <NuxtLink
            to="/login"
            class="whitespace-nowrap flex items-center gap-2 bg-white text-black text-sm font-bold px-6 py-2.5 rounded-full shadow-md hover:bg-zinc-200 transition-all duration-150 active:scale-95"
          >
            เข้าสู่ระบบ
          </NuxtLink>
        </div>

        <!-- ปุ่ม Hamburger / X บน Mobile (Animates ระหว่าง 3 ขีด กับ กากบาท X) -->
        <button
          type="button"
          class="gsap-nav-mobile-btn lg:hidden w-10 h-10 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 active:scale-95 transition-colors flex flex-col items-center justify-center gap-1.5 focus:outline-none"
          :aria-label="mobileMenuOpen ? 'ปิดเมนู' : 'เปิดเมนู'"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span
            :class="`w-5 h-0.5 bg-white rounded-full transition-all duration-300 transform origin-center ${
              mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`"
          />
          <span
            :class="`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${
              mobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100'
            }`"
          />
          <span
            :class="`w-5 h-0.5 bg-white rounded-full transition-all duration-300 transform origin-center ${
              mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`"
          />
        </button>
      </div>

      <!-- เนื้อหา Dropdown บน Mobile (อยู่ในผืนสีดำชิ้นเดียวกัน ไร้รอยต่อ ไร้ช่องว่าง สไตล์ Supaste) -->
      <div
        :class="`lg:hidden overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileMenuOpen
            ? 'max-h-[600px] opacity-100 pt-6 pointer-events-auto'
            : 'max-h-0 opacity-0 pointer-events-none pt-0'
        }`"
      >
        <!-- รายการเมนูแนวตั้งขนาดใหญ่ สวยงาม สไตล์ Supaste -->
        <div class="flex flex-col gap-2 pb-6">
          <NuxtLink
            v-for="(menu, index) in menulist"
            :key="index"
            :to="menu.path"
            :class="`text-2xl font-semibold py-2.5 px-1 transition-colors duration-150 block ${
              route.path === menu.path
                ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                : 'text-zinc-400 hover:text-white'
            }`"
            @click="mobileMenuOpen = false"
          >
            <span>{{ menu.name }}</span>
          </NuxtLink>

          <!-- สมัครใช้งาน -->
          <NuxtLink
            to="/register"
            class="text-xl font-medium text-zinc-400 hover:text-white py-2 px-1 transition-colors block"
            @click="mobileMenuOpen = false"
          >
            สมัครใช้งาน
          </NuxtLink>
        </div>

        <!-- ปุ่มเข้าสู่ระบบสีขาว เต็มความกว้าง (สไตล์ปุ่ม Download สีขาวของ Supaste) -->
        <NuxtLink
          to="/login"
          class="w-full bg-white text-black py-4 px-6 rounded-full font-bold text-base shadow-xl text-center flex items-center justify-center gap-2 hover:bg-zinc-200 active:scale-98 transition-all"
          @click="mobileMenuOpen = false"
        >
          เข้าสู่ระบบ
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>
