<template>
  <div>
    <h2>ชื่อ: {{ name }}</h2>
    <h2>แผนก: {{ department }}</h2>
  </div>
</template>

<script setup>
const name = ref("ศุภวิชญ์ ร่องพืช")
const department = ref("เทคนิคคอมพิวเตอร์")
</script>
