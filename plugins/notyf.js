import { Notyf } from "notyf";
import "notyf/notyf.min.css";

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    console.log("Notyf plugin inicializado en el cliente");
    const notyf = new Notyf({
      position: {
        x: "right",
        y: "top",
      },
    });
    nuxtApp.provide("notyf", notyf);
  }
});
