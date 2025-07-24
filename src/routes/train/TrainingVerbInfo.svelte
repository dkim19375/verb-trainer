<script lang="ts">
	import { Tense, TenseDisplayNames } from '$lib/types';

	const {
		currentTense,
		currentPronounExample,
		verbDisplay,
		verbDisplayAlt,
	}: {
		currentTense: Tense;
		currentPronounExample: string;
		verbDisplay: string;
		verbDisplayAlt: string;
	} = $props();
</script>

<div class="flex flex-100 flex-col items-center">
	<span class="mb-3 text-center text-2xl font-light"
		>{TenseDisplayNames[currentTense]}</span>
	<span class="text-center text-4xl"
		>{currentPronounExample}
		<span class="m-0 text-center font-bold">{verbDisplay}</span></span>
	<span class="text-2xl font-extralight">{verbDisplayAlt}</span>
</div>
