<script lang="ts">
	import ConjugationsTable from './ConjugationsTable.svelte';
	import TrainingVerbInfo from './TrainingVerbInfo.svelte';
	import TrainingVerbInputArea from './TrainingVerbInputArea.svelte';
	import autoAnimate from '@formkit/auto-animate';
	import type { VerbConjugationStates } from './VerbConjugationStates.svelte';

	const {
		currentVerb,
		nextVerb,
		gotIncorrect,
		showConjugations,
		currentInput,
		setCurrentInput,
		isCorrect,
	}: {
		currentVerb: VerbConjugationStates;
		nextVerb: (firstTry: boolean) => void;
		gotIncorrect: () => void;
		showConjugations: boolean;
		currentInput: string;
		setCurrentInput: (input: string) => void;
		isCorrect: boolean;
	} = $props();
</script>

<div
	class="flex h-full flex-1 flex-col items-center justify-center"
	use:autoAnimate={{ duration: 200 }}>
	<TrainingVerbInfo {currentVerb} />
	<hr class="my-6 w-120" />
	{#if showConjugations}
		<div>
			<ConjugationsTable {currentVerb} />
		</div>
	{:else}
		<TrainingVerbInputArea
			{nextVerb}
			{gotIncorrect}
			{currentInput}
			{setCurrentInput}
			currentConjugation={currentVerb.currentConjugation}
			{isCorrect} />
	{/if}
</div>
