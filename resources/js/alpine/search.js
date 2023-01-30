import MeiliSearch from "meilisearch";
export default function () {
    const searchConfig = {
        limit: 10,
    };
    const meilisearchConfig = {
        host: "http://127.0.0.1:7700",
    };
    return {
        modelOpen: false,
        query: "",
        index: null,
        results: null,
        selectedHitIndex: 0,

        watchQuery() {
            this.$watch("query", (query) => {
                if (query === "") {
                    this.results = null;
                    return;
                }
                this.search(query);
            });
        },
        async search(query) {
            this.results = await this.index.search(query, searchConfig);
        },
        reset() {
            this.results = null;
            this.selectedHitIndex = 0;
            this.query = "";
            this.modelOpen = false;
        },
        // selectNextHit() {
        //     if (this.selectedHitIndex === "") {
        //         this.selectedHitIndex = 0;
        //     } else {
        //         this.selectedHitIndex++;
        //     }
        //     if (this.selectedHitIndex === this.results.hits.length) {
        //         this.selectedHitIndex = 0;
        //     }
        //     this.focusSelectedHit();
        // },
        // selectPreviousHit() {
        //     if (this.selectedHitIndex === "") {
        //         this.selectedHitIndex = this.results.hits.length - 1;
        //     } else {
        //         this.selectedHitIndex--;
        //     }
        //     if (this.selectedHitIndex < 0) {
        //         this.selectedHitIndex = this.results.hits.length - 1;
        //     }
        //     this.focusSelectedHit();
        // },
        // focusSelectedHit() {
        //     this.$refs.results.children[this.selectedHitIndex + 1];
        // },
        goToUrl(hit) {
            let currentHit = hit
                ? hit
                : this.results.hits[this.selectedHitIndex];
            window.location = `/articles/${currentHit.id}`;
        },
        init() {
            const client = new MeiliSearch(meilisearchConfig);
            this.index = client.index("articles");
            this.watchQuery();
        },

        navigateResults(event) {
            switch (event.code) {
                case "ArrowDown":
                    if (
                        this.selectedHitIndex ===
                        this.results.hits.length - 1
                    ) {
                        this.selectedHitIndex = 0;
                    } else {
                        this.selectedHitIndex++;
                    }
                    break;
                case "ArrowUp":
                    if (this.selectedHitIndex === 0) {
                        this.selectedHitIndex = this.results.hits.length - 1;
                    } else {
                        this.selectedHitIndex--;
                    }
                    break;
            }

            this.$refs.results[this.selectedHitIndex]?.scrollIntoView(false);
        },

        onTermKeydown(event) {
            if (["ArrowUp", "ArrowDown"].includes(event.code)) {
                event.preventDefault();
                this.navigateResults(event);
            }
        },
        onKeyOpen(event) {
            if (this.modelOpen) return;

            if ((event.metaKey || event.ctrlKey) && event.key === "k") {
                this.modelOpen = true;
            }
        },
    };
}
