interface Option {
  id: string;
  name: string;
}

interface State {
  options: { [key: string]: Option[] };
  selected: string | null;
}

import { defineStore } from "pinia";

export const useSelect = defineStore("select", {
  state: (): State => ({
    options: {},
    selected: null,
  }),

  actions: {
    async fetchOptions(model: string, isLoading: boolean) {
      const res = await fetch(`http://localhost:3307/${model}`);
      const data = await res.json();

      this.options[model] = data;
      isLoading = true;
      // console.log("lso optiomns", this.options);
      // console.log("lso optiomns", this.options[model]);
    },
  },
});
