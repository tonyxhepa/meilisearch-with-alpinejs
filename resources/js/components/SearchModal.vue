<template>
    <div class="fixed inset-0 flex items-center justify-center">
        <button
            type="button"
            @click="openModal"
            class="rounded-md bg-indigo-300 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
            Open dialog
        </button>
    </div>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-10">
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-black bg-opacity-25" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div
                    class="flex min-h-full items-center justify-center p-4 text-center"
                >
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <DialogPanel
                            class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                        >
                            <div class="w-full">
                                <input
                                    id="query"
                                    v-model="query"
                                    class="w-full border-none block"
                                    name="query"
                                    placeholder="Search"
                                    type="search"
                                    autocomplete="off"
                                    @keyup.enter="onHitEnter"
                                    @keydown.up="focusPreviousResult()"
                                    @keydown.down="focusNextResult()"
                                />
                                <template v-if="results">
                                    <div class="py-2 px-3 border-b border-gray-200">
                                        Found <span v-text="results.estimatedTotalHits"></span> results
                                        <a href=""
                                            v-for="(hit, index) in results.hits"
                                            :key="index"
                                            class="block w-full py-2 px-3 border-b border-gray-200"
                                            :class="{ 'bg-blue-300': index === selectedHitIndex }">
                                            <h1 v-text="hit.title"></h1>
                                        </a>
                                    </div>
                                </template>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup>
import {onMounted, onUnmounted, ref, watchEffect} from 'vue'
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/vue'
import {MeiliSearch} from "meilisearch";

const isOpen = ref(true)
const query = ref("");
const results = ref(null);
const client = ref(null);
const selectedHitIndex = ref(0);
function closeModal() {
    isOpen.value = false;
    reset();
}
function openModal() {
    isOpen.value = true
}
const search = async (query) => {
    if (client.value === null) {
        results.value = null;
    } else {
        results.value = await client.value.index("articles").search(query, {limit: 5});
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
    window.addEventListener("keydown", onKeyDown);
});
onUnmounted(() => window.removeEventListener("keydown", onKeyDown));
function focusPreviousResult() {
    if (selectedHitIndex.value === 0) {
        selectedHitIndex.value = results.value.hits.length - 1;
    } else {
        selectedHitIndex.value--;
    }
}
function focusNextResult() {
    if (selectedHitIndex.value < results.value.hits.length - 1) {
        selectedHitIndex.value++;
    } else {
        selectedHitIndex.value = 0;
    }
}
function onHitEnter() {
    const hit = results.value.hits[selectedHitIndex.value];
    window.location = `/articles/${hit.id}`;
    reset();
}
function reset() {
    query.value = "";
    results.value = null;
    selectedHitIndex.value = 0;
}

const onKeyDown = (event) => {
    if (isOpen.value) return;

    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        isOpen.value = true;
    }
};
</script>
