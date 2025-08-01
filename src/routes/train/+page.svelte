<script lang="ts">
	import TrainingQuickStatsInfo from './TrainingQuickStatsInfo.svelte';

	import { PersistentState } from '@friendofsvelte/state';
	import type { PageProps } from './$types';
	import {
		Pronoun,
		Tense,
		InclusionType,
		type VerbData,
		PronounExamples,
		getDefaultVerbTrainerData,
		Language,
	} from '$lib/types';
	import TrainingHeader from './TrainingHeader.svelte';
	import TrainingBox from './TrainingBox.svelte';

	const { data }: PageProps = $props();
	const verbs = data.verbs;

	const verbConfig = new PersistentState(
		'data',
		getDefaultVerbTrainerData(),
	);

	let currentVerb = $state(getRandomVerb());
	let currentTense = $state(getRandomTense());
	let currentPronoun = $state(getRandomPronoun());
	let currentPronounExample = $state(getRandomPronounExample());

	let totalAmount = $state(0);
	let correctAmount = $state(0);
	let streak = $state(0);

	let brokeStreakUpdater = $state(false);

	let showConjugations = $state(false);
	let conjugationsShown = false;
	$effect(() => {
		if (showConjugations) {
			conjugationsShown = true;
		}
	});

	const verbDisplay = $derived(
		verbConfig.current.promptLanguage === Language.English ?
			currentVerb.english.infinitive
		:	currentVerb.infinitive,
	);

	const verbDisplayAlt = $derived.by(() => {
		const english = currentVerb.english;
		const clarifier =
			english.disambiguation ? ` (${english.disambiguation})` : '';
		if (verbConfig.current.promptLanguage === Language.English) {
			return clarifier;
		}
		return `${english.infinitive}${clarifier}`;
	});

	function getRandomVerb(): VerbData {
		return verbs[(Math.random() * verbs.length) | 0];
	}

	function getRandomTense(): Tense {
		const regularOnly =
			verbConfig.current.includeIrregular == InclusionType.Exclude;
		const irregularOnly =
			verbConfig.current.includeIrregular == InclusionType.Only;
		const availableTenses =
			!regularOnly && !irregularOnly ?
				verbConfig.current.tenses.filter(
					(tense) =>
						Object.entries(currentVerb.conjugations[tense]).filter(
							([pronoun, conjugation]) =>
								verbConfig.current.pronouns.includes(pronoun as Pronoun) &&
								conjugation,
						).length,
				)
			:	verbConfig.current.tenses.filter(
					(tense) =>
						Object.entries(currentVerb.conjugations[tense]).filter(
							([pronoun, conjugation]) =>
								verbConfig.current.pronouns.includes(pronoun as Pronoun) &&
								conjugation &&
								(regularOnly ?
									!conjugation.isIrregular
								:	conjugation.isIrregular),
						).length,
				);
		return availableTenses[(Math.random() * availableTenses.length) | 0];
	}

	function getRandomPronoun(): Pronoun {
		const regularOnly =
			verbConfig.current.includeIrregular == InclusionType.Exclude;
		const irregularOnly =
			verbConfig.current.includeIrregular == InclusionType.Only;
		const availablePronouns = verbConfig.current.pronouns.filter(
			(pronoun) => {
				const { conjugation, isIrregular } =
					currentVerb.conjugations[currentTense][pronoun];
				return (
					conjugation &&
					(regularOnly ? !isIrregular
					: irregularOnly ? isIrregular
					: true)
				);
			},
		);
		return availablePronouns[
			(Math.random() * availablePronouns.length) | 0
		];
	}

	function getRandomPronounExample(): string {
		const examples = PronounExamples[currentPronoun].split(',');
		return examples[(Math.random() * examples.length) | 0].trim();
	}

	function nextVerb(firstTry: boolean) {
		currentVerb = getRandomVerb();
		currentTense = getRandomTense();
		currentPronoun = getRandomPronoun();
		currentPronounExample = getRandomPronounExample();
		if (firstTry && !conjugationsShown) {
			totalAmount++;
			correctAmount++;
			streak++;
		}
		conjugationsShown = false;
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
		const alreadyShowedConjugations = conjugationsShown;
		showConjugations = !showConjugations;
		if (showConjugations && !alreadyShowedConjugations) {
			gotIncorrect();
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
				{currentTense}
				{currentPronoun}
				{currentPronounExample}
				{verbDisplay}
				{verbDisplayAlt}
				{nextVerb}
				{gotIncorrect}
				{showConjugations} />
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
