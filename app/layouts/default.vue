<template>
  <div>
    <Drawer
      v-model:visible="visible"
      header="Basic Drawer"
      class="w-full! md:w-80!"
    >
      <p>
        A slide-in panel from the edge of the screen for contextual content.
      </p>
    </Drawer>
    <div>
      <div class="bg-pink-500 hb-3 n-10 flex juscenter items-centervenly">
        <Button @click="visible = true" iconOnly class="ml-5 mr-3">
          <i class="fa-solid fa-bars fa-2xl"></i>
        </Button>
        <h1 class="text-white 2xl">HEADER</h1>
      </div>
      <div>
        <slot />
      </div>
      <div class="bg-pink-500 h-10">FOOTER</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const visible = ref(false);
</script>
