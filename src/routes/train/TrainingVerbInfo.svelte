<script lang="ts">
	import { Language, TenseDisplayNames } from '$lib/types';
	import type { VerbConjugationStates } from './VerbConjugationStates.svelte';

	const {
		currentVerb,
		promptLanguage,
	}: {
		currentVerb: VerbConjugationStates;
		promptLanguage: Language;
	} = $props();

	const shouldTranslate = $derived(promptLanguage !== Language.Spanish);
</script>

<div class="flex flex-col items-center">
	<span class="mb-3 text-center text-2xl font-light"
		>{TenseDisplayNames[currentVerb.currentTense]}</span>
	<span class="notranslate text-center text-4xl" translate="no"
		>{currentVerb.currentPronounExample}
		<span
			class="m-0 text-center font-bold"
			class:notranslate={!shouldTranslate}
			translate={shouldTranslate ? 'yes' : 'no'}
			>{currentVerb.verbDisplay}</span
		></span>
	<span class="text-2xl font-extralight"
		>{currentVerb.verbDisplayAlt}</span>
</div>
