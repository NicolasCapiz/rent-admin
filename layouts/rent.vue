<template>
  <div class="rent">
    <h1>Rent</h1>
    <slot />
  </div>
</template>
<style scoped>
  .rent {
    border: 1px solid #b9e39e;
    padding: 1rem;
    position: relative;
    background-color: #b8e39e87;
  }
  .rent::before {
    content: "layouts/rent.vue";
    position: absolute;
    top: 2px;
    left: 5px;
    color: #68b538;
    font-family: monospace;
  }
</style>
