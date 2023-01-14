import "./bootstrap";

import Alpine from "alpinejs";
import search from "./alpine/search";
import { MeiliSearch } from "meilisearch";

window.Alpine = Alpine;
window.MeiliSearch = MeiliSearch;
window.components = {
    search,
};

Alpine.start();
