interface Option {
  id: string;
  name: string;
}

interface State {
  options: { [key: string]: Option[] };
  selected: string | null;
}

import { defineStore } from "pinia";
const baseURL = "http://localhost:3307";

export const useSelect = defineStore("select", {
  state: (): State => ({
    options: {},
    selected: null,
  }),

  actions: {
    async fetchOptions(model: string, isLoading: boolean, token: string) {
      const res: any = await fetch(`${baseURL}/${model}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      this.options[model] = data;
      isLoading = true;
      // console.log("lso optiomns", this.options);
      // console.log("lso optiomns", this.options[model]);
    },
  },
});
