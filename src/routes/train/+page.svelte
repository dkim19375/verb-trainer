<script lang="ts">
	import TrainingQuickStatsInfo from './TrainingQuickStatsInfo.svelte';

	import { PersistentState } from '@friendofsvelte/state';
	import type { PageProps } from './$types';
	import { getDefaultVerbTrainerData } from '$lib/types';
	import TrainingHeader from './TrainingHeader.svelte';
	import TrainingBox from './TrainingBox.svelte';
	import { VerbConjugationStates } from './VerbConjugationStates.svelte';
	import { VisibleStopwatch } from '$lib/VisibleStopwatch';
	import { trackEvent } from '@lukulent/svelte-umami';

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
	let verbShownTime: VisibleStopwatch = new VisibleStopwatch();
	let incorrectTime: VisibleStopwatch | null = null;

	let brokeStreakUpdater = $state(false);

	let showConjugations = $state(false);
	let conjugationsShownWhenWrong = false;
	let conjugationsShownTotalTime: DOMHighResTimeStamp = 0;
	let conjugationsShownTime: VisibleStopwatch | null = null;

	function updateStopwatches() {
		verbShownTime.update();
		if (incorrectTime !== null) incorrectTime.update();
		if (conjugationsShownTime !== null) conjugationsShownTime.update();
	}

	function setCurrentInput(input: string) {
		currentInput = input;
	}

	function nextVerb(firstTry: boolean) {
		if (firstTry && !conjugationsShownWhenWrong) {
			totalAmount++;
			correctAmount++;
			streak++;
		}
		const baseAnalytics = {
			...getCurrentVerbAnalyticsInfo(),
			time_taken_ms: verbShownTime.visibleTime,
			first_try: firstTry.toString(),
		};
		if (incorrectTime !== null) {
			void trackEvent('correct', {
				...baseAnalytics,
				time_taken_to_get_incorrect_ms:
					verbShownTime.visibleTime - incorrectTime.visibleTime,
				time_taken_since_incorrect_ms: incorrectTime.visibleTime,
			});
		} else {
			void trackEvent('correct', {
				...baseAnalytics,
			});
		}
		currentVerb.getNewVerb();
		conjugationsShownWhenWrong = false;
		verbShownTime.reset();
		conjugationsShownTotalTime = 0;
	}

	function gotIncorrect() {
		totalAmount++;
		incorrectTime = new VisibleStopwatch();
		void trackEvent('incorrect', {
			...getCurrentVerbAnalyticsInfo(),
			time_taken_to_get_incorrect_ms: verbShownTime.visibleTime,
		});
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
		if (showConjugations) {
			conjugationsShownTime = new VisibleStopwatch();
			void trackEvent('show_conjugations', getCurrentVerbAnalyticsInfo());
		} else {
			if (conjugationsShownTime === null) {
				console.error('conjugationsShownTime is null');
				return;
			}
			const elapsedTime = conjugationsShownTime.visibleTime;
			conjugationsShownTotalTime += elapsedTime;
			conjugationsShownTime = null;
			void trackEvent('hide_conjugations', {
				...getCurrentVerbAnalyticsInfo(),
				this_time_conjugations_shown_time_ms: elapsedTime,
			});
		}
	}

	$effect(() => {
		void trackEvent('training_page_load', {
			pronouns: verbConfig.current.pronouns,
			tenses: verbConfig.current.tenses,
			include_reflexive: verbConfig.current.includeReflexive,
			include_irregular: verbConfig.current.includeIrregular,
			verb_list_types: verbConfig.current.verbListTypes,
			verb_list_top_num: verbConfig.current.verbListTopNum,
			verb_list_custom: verbConfig.current.verbListCustom,
			endings: verbConfig.current.endings,
			prompt_language: verbConfig.current.promptLanguage,
		});
		verbShownTime.reset();
	});

	function getCurrentVerbAnalyticsInfo(): {
		infinitive_spanish: string;
		infinitive_english: string;
		reflexive: string;
		frequency_ranking: number;
		ending: string;
		is_irregular: string;
		conjugation: string;
		prompt_language: string;
		current_input: string;
		is_correct: string;
		conjugations_shown_when_wrong: string;
		total_verbs: number;
		correct_verbs: number;
		streak: number;
		accuracy: number;
		conjugations_shown_total_time_ms: number;
	} {
		return {
			infinitive_spanish: currentVerb.currentVerb.infinitive,
			infinitive_english: currentVerb.currentVerb.english.infinitive,
			reflexive: currentVerb.currentVerb.reflexive.toString(),
			frequency_ranking: currentVerb.currentVerb.frequencyRanking,
			ending: currentVerb.currentVerb.ending,
			is_irregular: currentVerb.currentConjugation.isIrregular.toString(),
			conjugation: currentVerb.currentConjugation.conjugation,
			prompt_language: verbConfig.current.promptLanguage,
			current_input: currentInput,
			is_correct: isCorrect.toString(),
			conjugations_shown_when_wrong: conjugationsShownWhenWrong.toString(),
			total_verbs: totalAmount,
			correct_verbs: correctAmount,
			streak: streak,
			accuracy: totalAmount > 0 ? (correctAmount / totalAmount) * 100 : 0,
			conjugations_shown_total_time_ms: conjugationsShownTotalTime,
		};
	}
</script>

<svelte:document onvisibilitychange={updateStopwatches} />

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
