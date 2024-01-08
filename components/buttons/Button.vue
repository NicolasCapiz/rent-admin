<script setup lang="ts">
  const props = defineProps<{
    icon?: string;
    title: string;
  }>();
</script>
<template>
  <button class="flex flex-col">
    <div class="inline-flex items-center gap-4 p-3 px-4 text-left text-[15px]">
      <Icon v-if="props.icon" :name="props.icon" class="h-5 w-5 text-muted-foreground" />
      <p class="truncate">
        {{ props.title }}
      </p>
    </div>
  </button>
</template>
