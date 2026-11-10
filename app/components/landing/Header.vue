<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const heroRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
const ballsContainerRef = ref<HTMLDivElement | null>(null);

let mm: gsap.MatchMedia | null = null;
let cleanupThree: (() => void) | null = null;

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);

  // 1. GSAP Coordinated Stage Reveal + Masked Text + SVG Draw + Scroll Parallax
  const heroEl = heroRef.value;
  if (heroEl) {
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
              ".gsap-hero-bg-yellow",
              ".gsap-hero-text-line",
              ".gsap-hero-subtext",
              ".gsap-hero-cta",
              ".gsap-hero-card",
              ".gsap-hero-card-deco",
              ".gsap-ball-entrance",
              ".gsap-hero-deco",
              ".gsap-hero-svg-path",
            ],
            { clearProps: "all" }
          );
          return;
        }

        // เตรียมความยาวเส้น SVG สำหรับ Draw Animation
        const svgPaths = gsap.utils.toArray<SVGPathElement>(".gsap-hero-svg-path");
        svgPaths.forEach((path) => {
          const length = path.getTotalLength ? path.getTotalLength() : 160;
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
        });

        // Master Opening Timeline (Coordinated Stage Reveal)
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        // Stage 1: พื้นหลังสีเหลืองฝั่งซ้ายสไลด์คลี่ออก
        tl.fromTo(
          ".gsap-hero-bg-yellow",
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.9, ease: "expo.inOut" },
          0
        )
          // Stage 2: หัวข้อหลักเชิดขึ้นจากกรอบซ่อน (Masked Line/Word Reveal)
          .fromTo(
            ".gsap-hero-text-line",
            { yPercent: 115, rotateZ: 1.5, opacity: 0 },
            {
              yPercent: 0,
              rotateZ: 0,
              opacity: 1,
              duration: 0.85,
              stagger: 0.085,
              ease: "expo.out",
            },
            0.26
          )
          // คำอธิบายย่อยฝั่งซ้าย
          .fromTo(
            ".gsap-hero-subtext",
            { y: 20, opacity: 0, filter: "blur(4px)" },
            {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.7,
              ease: "power3.out",
              clearProps: "filter",
            },
            0.48
          )
          // กลุ่มปุ่ม Action (Hero CTA)
          .fromTo(
            ".gsap-hero-cta",
            { y: 16, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.65,
              ease: "back.out(1.4)",
              clearProps: "transform",
            },
            0.56
          )
          // Stage 3: การ์ดดำ 3D ตรงกลางขยายตัวพร้อม Clip-Path & Elevation
          .fromTo(
            ".gsap-hero-card",
            {
              scale: 0.86,
              y: 44,
              opacity: 0,
              clipPath: "inset(10% 10% 10% 10% round 26px)",
            },
            {
              scale: 1,
              y: 0,
              opacity: 1,
              clipPath: "inset(0% 0% 0% 0% round 26px)",
              duration: 0.95,
              ease: "expo.out",
              clearProps: "clipPath",
            },
            0.36
          )
          // ลวดลายวงกลมเหลืองภายในการ์ดดำ
          .fromTo(
            ".gsap-hero-card-deco",
            { scale: 0.45, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.75,
              stagger: 0.08,
              ease: "back.out(1.5)",
            },
            0.6
          )
          // Stage 4: ลูกกีฬาพื้นหลังทั้ง 3 ลูก Pop-in เข้าประจำตำแหน่ง
          .fromTo(
            ".gsap-ball-entrance",
            { scale: 0.55, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.85,
              stagger: 0.12,
              ease: "back.out(1.6)",
            },
            0.46
          )
          // วาดเส้นคลื่นและเส้นซิกแซก (SVG Stroke Draw)
          .to(
            svgPaths,
            {
              strokeDashoffset: 0,
              duration: 0.95,
              stagger: 0.08,
              ease: "power3.inOut",
            },
            0.52
          )
          // จุด วงกลม และกากบาท ✕ รอบนอก Pop-in
          .fromTo(
            ".gsap-hero-deco",
            { scale: 0, opacity: 0, rotation: -35 },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: 0.6,
              stagger: 0.04,
              ease: "back.out(1.8)",
            },
            0.55
          );

        // Continuous Floating Animation สำหรับลูกกีฬาในพื้นหลัง
        gsap.to(".gsap-ball-soccer", {
          y: -18,
          rotation: "+=8",
          duration: 3.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".gsap-ball-volley", {
          y: 16,
          rotation: "-=10",
          duration: 4.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.5,
        });

        gsap.to(".gsap-ball-basket", {
          y: -20,
          rotation: "+=6",
          duration: 4.0,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.25,
        });

        // Subtle Scroll Parallax เมื่อเลื่อนหน้าจอลงจาก Hero ไปส่วนถัดไป
        const parallaxTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroEl,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        parallaxTl
          .to(
            ".gsap-ball-parallax-soccer",
            { yPercent: -32, rotation: -12, ease: "none" },
            0
          )
          .to(
            ".gsap-ball-parallax-volley",
            { yPercent: -48, rotation: 16, ease: "none" },
            0
          )
          .to(
            ".gsap-ball-parallax-basket",
            { yPercent: -38, rotation: 12, ease: "none" },
            0
          )
          .to(".gsap-hero-deco-layer", { yPercent: -14, ease: "none" }, 0)
          .to(".gsap-hero-card-parallax", { yPercent: -7, ease: "none" }, 0);
      },
      heroEl
    );
  }

  // 2. Three.js 3D Model Scene
  const container = containerRef.value;
  if (!container) return;

  const scene = new THREE.Scene();
  const clock = new THREE.Clock();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 2000);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.domElement.style.touchAction = "pan-y";
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.rotateSpeed = 0.8;
  const minPolar = Math.PI / 3.1;
  const maxPolar = Math.PI / 2.25;
  controls.minPolarAngle = minPolar;
  controls.maxPolarAngle = maxPolar;

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xb0bec5, 0.95);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2.3);
  dirLight.position.set(20, 35, 20);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.bias = -0.0005;
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0xffedd5, 0.9);
  fillLight.position.set(-20, 15, -20);
  scene.add(fillLight);

  let modelGroup: THREE.Group | null = null;
  let maxDim = 10;
  let horizRadius = 8;
  let modelHeight = 4;
  let isInitializedCamera = false;
  let isUserInteracting = false;

  const handleControlStart = () => {
    isUserInteracting = true;
  };
  const handleControlEnd = () => {
    isUserInteracting = false;
  };
  controls.addEventListener("start", handleControlStart);
  controls.addEventListener("end", handleControlEnd);

  const updateDimensions = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;

    const aspect = width / height;
    camera.aspect = aspect;

    const vFovRad = THREE.MathUtils.degToRad(camera.fov / 2);
    const hFovRad = Math.atan(aspect * Math.tan(vFovRad));

    const distForWidth = (horizRadius * 1.05) / Math.sin(hFovRad);
    const maxVertProj =
      horizRadius * Math.cos(minPolar) +
      (modelHeight / 2) * Math.sin(minPolar) +
      maxDim * 0.03;
    const distForHeight = (maxVertProj * 1.12) / Math.sin(vFovRad);
    const requiredDistance = Math.max(distForWidth, distForHeight);

    camera.near = Math.max(0.1, maxDim * 0.01);
    camera.far = Math.max(1000, maxDim * 20);

    if (!isInitializedCamera) {
      const isoDir = new THREE.Vector3(1.05, 0.68, 1.05).normalize();
      camera.position.copy(isoDir.multiplyScalar(requiredDistance));
    } else {
      camera.position.normalize().multiplyScalar(requiredDistance);
    }

    controls.target.set(0, 0, 0);
    controls.update();

    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  const loader = new GLTFLoader();
  loader.load(
    "/minimal-sports-gym.glb",
    (gltf) => {
      const loadedModel = gltf.scene;

      loadedModel.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });

      const box = new THREE.Box3().setFromObject(loadedModel);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      maxDim = Math.max(size.x, size.y, size.z);
      horizRadius = Math.hypot(size.x, size.z) / 2;
      modelHeight = size.y;

      loadedModel.position.set(-center.x, -center.y, -center.z);

      dirLight.position.set(maxDim * 1.5, maxDim * 2.5, maxDim * 1.5);
      dirLight.shadow.camera.left = -maxDim;
      dirLight.shadow.camera.right = maxDim;
      dirLight.shadow.camera.top = maxDim;
      dirLight.shadow.camera.bottom = -maxDim;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = maxDim * 6;
      dirLight.shadow.camera.updateProjectionMatrix();

      modelGroup = new THREE.Group();
      modelGroup.add(loadedModel);
      modelGroup.rotation.y = -Math.PI / 6;

      scene.add(modelGroup);
      updateDimensions();
      isInitializedCamera = true;

      // GSAP 3D Model Entrance Spin & Scale
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.fromTo(
          modelGroup.rotation,
          { y: -Math.PI / 1.85 },
          { y: -Math.PI / 6, duration: 1.45, ease: "expo.out" }
        );
        gsap.fromTo(
          modelGroup.scale,
          { x: 0.76, y: 0.76, z: 0.76 },
          { x: 1, y: 1, z: 1, duration: 1.2, ease: "back.out(1.35)" }
        );
      }
    },
    undefined,
    (error: unknown) => {
      console.error("Failed to load 3D model:", error);
    }
  );

  let animationFrameId: number;
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);

    if (modelGroup) {
      const elapsedTime = clock.getElapsedTime();
      modelGroup.position.y = Math.sin(elapsedTime * 1.2) * (maxDim * 0.02);

      if (!isUserInteracting) {
        modelGroup.rotation.y += Math.sin(elapsedTime * 0.5) * 0.0006;
      }
    }

    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  const resizeObserver = new ResizeObserver(() => {
    updateDimensions();
  });
  resizeObserver.observe(container);
  updateDimensions();

  cleanupThree = () => {
    resizeObserver.disconnect();
    cancelAnimationFrame(animationFrameId);
    controls.removeEventListener("start", handleControlStart);
    controls.removeEventListener("end", handleControlEnd);
    controls.dispose();
    renderer.dispose();
    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
  };
});

onUnmounted(() => {
  if (mm) {
    mm.revert();
  }
  if (cleanupThree) {
    cleanupThree();
  }
});
</script>

<template>
  <header
    id="hero"
    ref="heroRef"
    class="relative w-full max-w-full h-screen min-h-[600px] overflow-hidden bg-white select-none"
  >
    <!-- พื้นหลังแบ่งครึ่ง 50/50 ซ้ายเหลือง - ขวาขาว -->
    <div class="absolute inset-0 flex flex-row pointer-events-none">
      <div class="gsap-hero-bg-yellow w-1/2 h-full bg-brand-yellow will-change-transform" />
      <div class="w-1/2 h-full bg-white" />
    </div>

    <!-- ================= เลเยอร์ลูกกีฬาพื้นหลัง (อยู่หลังสุด z-[1], ซ่อนบนมือถือ/แท็บเล็ต, Opacity ต่ำ) ================= -->
    <div
      ref="ballsContainerRef"
      class="hidden lg:block absolute inset-0 pointer-events-none z-[1] overflow-hidden"
    >
      <!-- 1. ลูกฟุตบอล: มุมบนซ้าย (Top-Left Corner) -->
      <div class="gsap-ball-parallax-soccer absolute top-[8%] xl:top-[10%] left-[2%] xl:left-[3.5%] opacity-35 xl:opacity-45">
        <div class="gsap-ball-entrance">
          <div class="gsap-ball-soccer relative w-32 h-32 xl:w-44 xl:h-44 -rotate-12 filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.2)]">
            <img
              src="/asset/ball.png"
              alt="ลูกฟุตบอลตกแต่งพื้นหลัง"
              class="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      <!-- 2. ลูกวอลเลย์บอล: มุมล่างซ้าย (Bottom-Left Corner) -->
      <div class="gsap-ball-parallax-volley absolute bottom-[7%] xl:bottom-[9%] left-[3%] xl:left-[5%] opacity-35 xl:opacity-45">
        <div class="gsap-ball-entrance">
          <div class="gsap-ball-volley relative w-28 h-28 xl:w-40 xl:h-40 rotate-[14deg] filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.2)]">
            <img
              src="/asset/voleyball.png"
              alt="ลูกวอลเลย์บอลตกแต่งพื้นหลัง"
              class="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      <!-- 3. ลูกบาสเกตบอล: มุมบนขวา (Top-Right Corner) -->
      <div class="gsap-ball-parallax-basket absolute top-[12%] xl:top-[14%] right-[4%] xl:right-[6%] opacity-35 xl:opacity-45">
        <div class="gsap-ball-entrance">
          <div class="gsap-ball-basket relative w-32 h-32 xl:w-48 xl:h-48 -rotate-6 filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)]">
            <img
              src="/asset/basketball.png"
              alt="ลูกบาสเกตบอลตกแต่งพื้นหลัง"
              class="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ================= ของตกแต่งรอบนอก ================= -->
    <div class="gsap-hero-deco-layer absolute inset-0 pointer-events-none z-10 overflow-hidden">
      <!-- ของตกแต่งโซนบน-กลาง: แสดงเฉพาะจอคอมพิวเตอร์ (xl: 1280px ขึ้นไป) -->
      <span class="gsap-hero-deco hidden xl:block absolute left-[4%] top-[16%] w-1.5 h-1.5 bg-black" />
      <span class="gsap-hero-deco hidden xl:block absolute left-[36%] top-[11%] text-black font-bold text-sm leading-none">
        ✕
      </span>
      <svg
        class="hidden xl:block absolute left-[6%] top-[53%] w-36 h-5 text-white/60"
        viewBox="0 0 140 20"
        fill="none"
      >
        <path
          class="gsap-hero-svg-path"
          d="M2 10 Q 11 2, 20 10 T 38 10 T 56 10 T 74 10 T 92 10 T 110 10 T 128 10"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        />
      </svg>
      <span class="gsap-hero-deco hidden xl:block absolute left-[24%] top-[62%] w-1.5 h-1.5 bg-black rounded-full" />
      <span class="gsap-hero-deco hidden xl:block absolute left-[80%] bottom-[22%] w-1.5 h-1.5 bg-black rounded-full" />
      <div class="hidden xl:flex absolute right-[6%] top-[48%] items-center gap-6">
        <svg class="w-36 h-5 text-neutral-300" viewBox="0 0 140 20" fill="none">
          <path
            class="gsap-hero-svg-path"
            d="M2 10 Q 11 2, 20 10 T 38 10 T 56 10 T 74 10 T 92 10 T 110 10 T 128 10"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
          />
        </svg>
        <span class="gsap-hero-deco w-1.5 h-1.5 bg-black rounded-full" />
      </div>

      <!-- ของตกแต่งโซนล่าง: แสดงทั้งบนมือถือ/iPad และจอคอม -->
      <!-- 1. วงกลมโปร่ง + จุด มุมซ้ายล่าง -->
      <div class="gsap-hero-deco flex absolute left-[6%] sm:left-[8%] bottom-[5%] sm:bottom-[8%] xl:bottom-[14%] items-center">
        <span class="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-[2px] sm:border-[2.5px] border-black block" />
        <span class="w-1.5 h-1.5 bg-black rounded-full -mt-6 sm:-mt-8 ml-1.5 sm:ml-2 block" />
      </div>

      <!-- 2. กากบาท 3 ตัวเรียง ด้านล่างฝั่งเหลือง -->
      <div class="flex absolute left-[24%] sm:left-[26%] xl:left-[28%] bottom-[5%] sm:bottom-[8%] xl:bottom-[10%] items-center gap-2 sm:gap-2.5 text-black text-[10px] sm:text-xs font-bold">
        <span class="gsap-hero-deco">✕</span>
        <span class="gsap-hero-deco">✕</span>
        <span class="gsap-hero-deco">✕</span>
      </div>

      <!-- 3. วงกลมเส้นบางขนาดใหญ่ ซ้อนมุมขวาล่างของการ์ดดำ -->
      <div class="gsap-hero-deco block absolute left-[54%] sm:left-[58%] xl:left-[60%] bottom-[14%] sm:bottom-[12%] xl:bottom-[8%] w-28 h-28 sm:w-44 sm:h-44 xl:w-56 xl:h-56 rounded-full border-2 border-black" />

      <!-- 4. เส้นซิกแซก 2 ชั้น มุมขวาล่าง -->
      <div class="flex absolute right-[3%] bottom-[4%] sm:bottom-[6%] xl:bottom-[12%] flex-col gap-1.5 sm:gap-2 xl:gap-2.5">
        <svg class="w-20 sm:w-28 xl:w-36 h-3 sm:h-4 text-brand-yellow" viewBox="0 0 140 16" fill="none">
          <path
            class="gsap-hero-svg-path"
            d="M2 14 L 14 2 L 26 14 L 38 2 L 50 14 L 62 2 L 74 14 L 86 2 L 98 14 L 110 2 L 122 14 L 134 2"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg class="w-20 sm:w-28 xl:w-36 h-3 sm:h-4 text-black" viewBox="0 0 140 16" fill="none">
          <path
            class="gsap-hero-svg-path"
            d="M2 14 L 14 2 L 26 14 L 38 2 L 50 14 L 62 2 L 74 14 L 86 2 L 98 14 L 110 2 L 122 14 L 134 2"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <!-- ================= เลเยอร์ข้อความพาดผ่าน 2 ฝั่ง ================= -->
    <div class="relative z-10 w-full max-w-[1440px] mx-auto px-3 sm:px-6 md:px-10 xl:px-16 pointer-events-none flex flex-col justify-center min-h-screen overflow-hidden">
      <div class="w-full -mt-[420px] min-[390px]:-mt-[440px] sm:-mt-[490px] md:-mt-[530px] lg:-mt-[580px] xl:-mt-[430px]">
        <!-- บรรทัดที่ 1: ระบบ -->
        <h1 class="font-primary font-bold text-black text-[clamp(2.75rem,11vw,4rem)] sm:text-[clamp(3.25rem,7vw,4.5rem)] lg:text-[58px] xl:text-[72px] tracking-[0.14em] leading-tight uppercase">
          <span class="block overflow-hidden py-2 -my-2">
            <span class="gsap-hero-text-line block will-change-transform">
              ระบบ
            </span>
          </span>
        </h1>

        <!-- บรรทัดที่ 2: พาดข้ามฝั่งเหลือง ไปฝั่งขาว -->
        <div class="grid grid-cols-2 items-baseline mt-1 sm:mt-1.5 xl:mt-2 w-full">
          <div class="font-primary font-bold text-black text-[clamp(1.35rem,5.6vw,2.3rem)] sm:text-[clamp(2.1rem,4.8vw,3.2rem)] lg:text-[44px] xl:text-[62px] tracking-tight sm:tracking-[0.02em] xl:tracking-[0.08em] leading-tight uppercase whitespace-nowrap">
            <span class="block overflow-hidden py-2 -my-2">
              <span class="gsap-hero-text-line block will-change-transform">
                จัดการสนามกีฬา
              </span>
            </span>
          </div>
          <div class="font-primary font-bold text-black text-[clamp(1.5rem,6.4vw,2.5rem)] sm:text-[clamp(2.2rem,5.2vw,3.4rem)] lg:text-[46px] xl:text-[62px] tracking-[0.06em] sm:tracking-[0.1em] xl:tracking-[0.08em] leading-tight uppercase pl-2 sm:pl-5 md:pl-6 xl:pl-8 whitespace-nowrap">
            <span class="block overflow-hidden py-2 -my-2">
              <span class="gsap-hero-text-line block will-change-transform">
                ภายในชุมชน
              </span>
            </span>
          </div>
        </div>

        <!-- บรรทัดที่ 3: คำอธิบายเล็กฝั่งซ้าย & คำว่า ง่ายและรวดเร็ว ฝั่งขวา -->
        <div class="grid grid-cols-2 items-start mt-3 sm:mt-5 md:mt-6 xl:mt-10 w-full">
          <div class="max-w-[95%] sm:max-w-[280px] xl:max-w-[340px] pr-2">
            <p class="gsap-hero-subtext text-[clamp(0.8rem,3.4vw,1rem)] sm:text-sm md:text-base xl:text-sm text-black/85 font-secondary leading-relaxed">
              ลงทะเบียนได้ทั้งแบบเดี่ยวและกลุ่ม
              <br />
              มีรหัสยืนยันตัวตนที่ชัดเจน
            </p>

            <!-- กลุ่มปุ่ม Action หลัก (Hero CTA) -->
            <div class="gsap-hero-cta relative z-30 mt-4 sm:mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3 pointer-events-auto">
              <NuxtLink
                to="/booking"
                class="group relative inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-black text-white hover:bg-neutral-800 active:scale-95 font-primary font-bold text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200"
              >
                <span>จองสนามทันที</span>
                <svg
                  class="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </NuxtLink>
              <a
                href="#how-it-works"
                class="inline-flex items-center justify-center px-3.5 sm:px-4 py-2.5 border-2 border-black/80 text-black hover:bg-black hover:text-white active:scale-95 font-primary font-semibold text-xs sm:text-sm rounded-full transition-all duration-200"
              >
                <span>ดูวิธีใช้งาน</span>
              </a>
            </div>
          </div>
          <div class="font-primary font-semibold text-black text-[clamp(0.95rem,4.2vw,1.25rem)] sm:text-lg md:text-xl xl:text-[22px] tracking-[0.1em] sm:tracking-[0.16em] xl:tracking-[0.2em] uppercase pl-2 sm:pl-5 md:pl-6 xl:pl-8 xl:text-right xl:pr-4 mt-1">
            <span class="block overflow-hidden py-1.5 -my-1.5">
              <span class="gsap-hero-text-line block will-change-transform">
                ง่ายและรวดเร็ว
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= กรอบการ์ดสีดำตรงกลาง พร้อมโมเดล 3D ด้านใน ================= -->
    <div class="absolute inset-0 flex items-center justify-center z-20 pointer-events-none overflow-hidden">
      <div class="gsap-hero-card-parallax translate-y-10 sm:translate-y-12 md:translate-y-14 lg:translate-y-16">
        <div class="gsap-hero-card relative w-[94vw] sm:w-[88vw] sm:max-w-[580px] md:max-w-[640px] lg:w-[680px] lg:max-w-none xl:w-[740px] h-[290px] min-[390px]:h-[310px] sm:h-[360px] md:h-[390px] lg:h-[420px] xl:h-[450px] rounded-[20px] sm:rounded-[24px] xl:rounded-[26px] shadow-[0_28px_55px_rgba(0,0,0,0.36)] xl:shadow-[0_35px_70px_rgba(0,0,0,0.38)] overflow-hidden pointer-events-auto bg-[#0a0a0a] will-change-transform">
          <!-- ลวดลายเส้นโค้งสีเหลืองมุมซ้ายบนของการ์ดดำ -->
          <div class="gsap-hero-card-deco absolute -top-16 sm:-top-20 xl:-top-24 -left-6 sm:-left-8 w-44 sm:w-56 xl:w-64 h-44 sm:h-56 xl:h-64 rounded-full border-[14px] sm:border-[18px] xl:border-[22px] border-brand-yellow pointer-events-none" />

          <!-- ลวดลายเส้นโค้งสีเหลือง + จุด มุมขวาล่างของการ์ดดำ -->
          <div class="gsap-hero-card-deco absolute -bottom-16 sm:-bottom-20 xl:-bottom-24 -right-10 sm:-right-14 xl:-right-16 w-44 sm:w-56 xl:w-64 h-44 sm:h-56 xl:h-64 rounded-full border-[14px] sm:border-[18px] xl:border-[22px] border-brand-yellow pointer-events-none" />
          <span class="gsap-hero-card-deco absolute bottom-6 sm:bottom-8 xl:bottom-9 right-8 sm:right-11 xl:right-14 w-3.5 sm:w-4 xl:w-5 h-3.5 sm:h-4 xl:h-5 rounded-full bg-brand-yellow pointer-events-none z-10" />

          <!-- วงกลมเหลืองเล็กตกแต่งด้านในของการ์ด -->
          <span class="gsap-hero-card-deco absolute top-[32%] right-[14%] w-2 sm:w-2.5 xl:w-3 h-2 sm:h-2.5 xl:h-3 rounded-full border-2 border-brand-yellow pointer-events-none z-10" />

          <!-- 3D Model Canvas อยู่ตรงกลางการ์ดดำ -->
          <div
            ref="containerRef"
            class="relative z-20 w-full h-full cursor-grab active:cursor-grabbing"
          />
        </div>
      </div>
    </div>
  </header>
</template>
