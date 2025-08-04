<script lang="ts">
	import TrainingQuickStatsInfo from './TrainingQuickStatsInfo.svelte';

	import { PersistentState } from '@friendofsvelte/state';
	import type { PageProps } from './$types';
	import { getDefaultVerbTrainerData } from '$lib/types';
	import TrainingHeader from './TrainingHeader.svelte';
	import TrainingBox from './TrainingBox.svelte';
	import { VerbConjugationStates } from './VerbConjugationStates.svelte';

	const { data }: PageProps = $props();
	const verbs = data.verbs;

	const verbConfig = new PersistentState(
		'data',
		getDefaultVerbTrainerData(),
	);

	const currentVerb = new VerbConjugationStates(verbs, verbConfig);

	let currentInput = $state('');
	const isCorrect = $derived.by(
		() =>
			currentInput.trim().toLowerCase() ===
			currentVerb.currentConjugation.conjugation.toLowerCase(),
	);

	let totalAmount = $state(0);
	let correctAmount = $state(0);
	let streak = $state(0);

	let brokeStreakUpdater = $state(false);

	let showConjugations = $state(false);
	let conjugationsShownWhenWrong = false;

	function setCurrentInput(input: string) {
		currentInput = input;
	}

	function nextVerb(firstTry: boolean) {
		currentVerb.getNewVerb();
		if (firstTry && !conjugationsShownWhenWrong) {
			totalAmount++;
			correctAmount++;
			streak++;
		}
		conjugationsShownWhenWrong = false;
	}

	function gotIncorrect() {
		totalAmount++;
		if (streak <= 0) {
			return;
		}
		streak = 0;
		brokeStreakUpdater = !brokeStreakUpdater;
	}

	function toggleConjugations() {
		const alreadyShowedConjugations = conjugationsShownWhenWrong;
		showConjugations = !showConjugations;
		if (showConjugations && !alreadyShowedConjugations && !isCorrect) {
			gotIncorrect();
			conjugationsShownWhenWrong = true;
		}
	}
</script>

<div class="flex-1">
	<TrainingHeader />
</div>
<main class="flex flex-1 flex-col items-center justify-center gap-5">
	<div class="flex flex-col items-center">
		<article
			class="flex h-80 w-130 items-center justify-center rounded-4xl p-0">
			<TrainingBox
				{currentVerb}
				promptLanguage={verbConfig.current.promptLanguage}
				{nextVerb}
				{gotIncorrect}
				{showConjugations}
				{currentInput}
				{setCurrentInput}
				{isCorrect} />
		</article>
	</div>

	<TrainingQuickStatsInfo
		{totalAmount}
		{correctAmount}
		{streak}
		{brokeStreakUpdater}
		areConjugationsShown={showConjugations}
		{toggleConjugations} />
</main>
<div class="flex-1"></div>

<style>
	:global(html),
	:global(body) {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
</style>
