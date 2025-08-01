<script lang="ts">
	import { TenseDisplayNames } from '$lib/types';
	import type { VerbConjugationStates } from './VerbConjugationStates.svelte';

	const {
		currentVerb,
	}: {
		currentVerb: VerbConjugationStates;
	} = $props();
</script>

<div class="flex flex-col items-center">
	<span class="mb-3 text-center text-2xl font-light"
		>{TenseDisplayNames[currentVerb.currentTense]}</span>
	<span class="text-center text-4xl"
		>{currentVerb.currentPronounExample}
		<span class="m-0 text-center font-bold">{currentVerb.verbDisplay}</span
		></span>
	<span class="text-2xl font-extralight"
		>{currentVerb.verbDisplayAlt}</span>
</div>
