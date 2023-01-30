<script setup>
import { onMounted, ref, watchEffect } from "vue";
import { MeiliSearch } from "meilisearch";

const query = ref("");
const results = ref(null);
const client = ref(null);

const search = async (query) => {
  if (client.value === null) {
    results.value = null;
  } else {
    results.value = await client.value.index("articles").search(query, 5);
  }
};

watchEffect(() => {
  if (query.value === "") {
    results.value = null;
  }
  search(query.value);
});

onMounted(() => {
  client.value = new MeiliSearch({ host: "http://127.0.0.1:7700" });
});
</script>
<template>
  <div class="bg-white border-b border-gray-100">
    <input
      id="query"
      v-model="query"
      class="w-full border-none block"
      name="query"
      placeholder="Search"
      type="search"
      autocomplete="off"
    />
    <template v-if="results">
      <div class="py-2 px-3 border-b border-gray-200">
        Found <span v-text="results.estimatedTotalHits"></span> results
        <button
          v-for="(hit, index) in results.hits"
          :key="index"
          class="block w-full py-2 px-3 border-b border-gray-200"
        >
          <h1 v-text="hit.title"></h1>
        </button>
      </div>
    </template>
  </div>
</template>