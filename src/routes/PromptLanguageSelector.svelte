<script lang="ts">
	import { Language } from '$lib/types';

	const {
		promptLanguage,
		setPromptLanguage,
	}: {
		promptLanguage: Language;
		setPromptLanguage: (language: Language) => void;
	} = $props();
</script>

<article class="m-0 flex flex-col gap-2.5 pt-3 pb-0">
	<h4 class="mb-1">English:</h4>
	<div role="group">
		{@render languageButton(Language.English, 'Show')}
		{@render languageButton(Language.Spanish, 'Hide')}
	</div>
</article>

{#snippet languageButton(language: Language, text: string)}
	<button
		class:secondary={promptLanguage !== language}
		class="px-0 py-1.5"
		onclick={() => setPromptLanguage(language)}>
		{text}
	</button>
{/snippet}
