export default function (meilisearchConfig, index, searchConfig) {
    const defaultSearchConfig = {
        limit: 10,
    };
    searchConfig = { ...defaultSearchConfig, ...searchConfig };
    return {
        query: "",
        index: null,
        results: null,
        selectedHitIndex: "",

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
            this.selectedHitIndex = "";
        },
        selectNextHit() {
            if (this.selectedHitIndex === "") {
                this.selectedHitIndex = 0;
            } else {
                this.selectedHitIndex++;
            }
            if (this.selectedHitIndex === this.results.hits.length) {
                this.selectedHitIndex = 0;
            }
            this.focusSelectedHit();
        },
        selectPreviousHit() {
            console.log(this.results);
            if (this.selectedHitIndex === "") {
                this.selectedHitIndex = this.results.hits.length - 1;
            } else {
                this.selectedHitIndex--;
            }
            if (this.selectedHitIndex < 0) {
                this.selectedHitIndex = this.results.hits.length - 1;
            }
            this.focusSelectedHit();
        },
        focusSelectedHit() {
            this.$refs.results.children[
                this.selectedHitIndex + 1
            ].scrollIntoView({ block: "nearest" });
        },
        goToUrl(hit) {
            let currentHit = hit
                ? hit
                : this.results.hits[this.selectedHitIndex];
            window.location = `/articles/${currentHit.id}`;
        },
        init() {
            const client = new window.MeiliSearch(meilisearchConfig);
            this.index = client.index(index);
            this.watchQuery();
        },
    };
}
