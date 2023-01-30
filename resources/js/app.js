import "./bootstrap";

// import Alpine from "alpinejs";
// import search from "./alpine/search";
import { createApp } from "vue/dist/vue.esm-bundler.js";
import Search from "./components/SearchModal.vue";
// import focus from "@alpinejs/focus";

const app = createApp({});

app.component("search", Search);

app.mount("#app");

// window.Alpine = Alpine;
// window.MeiliSearch = MeiliSearch;
// window.components = {
//     search,
// };
// Alpine.data("search", search);
// Alpine.plugin(focus);
// Alpine.start();
