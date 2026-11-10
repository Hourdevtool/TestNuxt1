<script setup lang="ts">
import Navbar from "~/components/Navbar.vue";
import Footer from "~/components/Footer.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white overflow-x-hidden">
    <Navbar />
    <div class="flex-1">
      <slot />
    </div>
    <Footer />
  </div>
</template>
