// types/notify.d.ts
import { NotificationOptions } from "notifyjs-browser";

declare module "#app" {
  interface NuxtApp {
    $notify(title: string, options?: NotificationOptions): void;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $notify(title: string, options?: NotificationOptions): void;
  }
}
