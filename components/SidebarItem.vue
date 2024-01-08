<template>
  <div class="flex flex-col">
    <template v-for="(l, i) in links" :key="i">
      <NuxtLink
        v-if="!l.items"
        to="/"
        class="inline-flex items-center gap-4 p-3 px-4 text-left text-[15px]"
      >
        <Icon v-if="l.icon" :name="l.icon" class="h-5 w-5 text-muted-foreground" />
        <p class="truncate">
          {{ l.title }}
        </p>
      </NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    links?: any[];
  }>();
</script>
