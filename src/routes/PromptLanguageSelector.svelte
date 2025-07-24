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
	<h4 class="mb-1">Prompt in:</h4>
	<div role="group">
		{#each Object.values(Language) as language (language)}
			<button
				class:secondary={promptLanguage !== language}
				class="px-0 py-1.5"
				onclick={() => setPromptLanguage(language)}>
				{language}
			</button>
		{/each}
	</div>
</article>
