<script setup lang="ts">
  import type { Sidebar } from '@/types/sidebar'
  const props = defineProps<{
    links?: Sidebar[];
  }>();
</script>
<template>
  <div class="flex flex-col">
    <template v-for="(l) in props.links" :key="i">
      <NuxtLink
        :to="{ path: l.link }"
        class="inline-flex items-center gap-4 p-3 px-4 text-left text-[15px]"
      >
        <Icon v-if="l.icons" :name="l.icons" class="h-5 w-5 text-muted-foreground" />
        <p class="truncate">
          {{ l.title }}
        </p>
      </NuxtLink>
    </template>
  </div>
</template>
