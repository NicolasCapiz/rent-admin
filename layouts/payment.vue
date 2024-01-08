<template>
  <div class="payment">
    <h1>payment</h1>
    <slot />
  </div>
</template>
<style scoped>
  .payment {
    border: 1px solid #b9e39e;
    padding: 1rem;
    position: relative;
    background-color: #b8e39e87;
  }
  .payment::before {
    content: "layouts/payment.vue";
    position: absolute;
    top: 2px;
    left: 5px;
    color: #68b538;
    font-family: monospace;
  }
</style>
