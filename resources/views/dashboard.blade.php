<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-3xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div x-data="window.components.search({
                    host: '{{ config('scout.meilisearch.host') }}'
                }, 'articles', {
                    limit: 5
                })" class="bg-white border-b border-gray-100">
                    <x-text-input id="query" x-model="query" class="w-full border-none block" name="query"
                        placeholder="Search" type="search" autocomplete="off" x-on:click.outside="reset()"
                        x-on:keyup.escape="reset()" x-on:keyup.down="selectNextHit" x-on:keyup.up="selectPreviousHit"
                        x-on:keyup.enter="goToUrl()" />
                    <template x-if="results">
                        <div class="py-2 px-3 border-b border-gray-200">
                            Found <span x-text="results.estimatedTotalHits"></span> results
                            <template x-if="results" x-for="(hit, index) in results.hits">
                                <button x-on:click.prevent="goToUrl(hit)"
                                    class="block w-full py-2 px-3 border-b border-gray-200"
                                    :class="{ 'bg-gray-300 outline-none': index === selectedHitIndex }">
                                    <h1 x-text="hit.title"></h1>
                                </button>
                            </template>
                        </div>
                </div>
            </div>
        </div>
</x-app-layout>
