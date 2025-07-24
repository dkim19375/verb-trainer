<script lang="ts">
	import type { Pronoun, Tense, VerbData } from '$lib/types';

	const {
		currentVerb,
		currentTense,
		currentPronoun,
		nextVerb,
	}: {
		currentVerb: VerbData;
		currentTense: Tense;
		currentPronoun: Pronoun;
		nextVerb: () => void;
	} = $props();

	const currentConjugation = $derived.by(
		() => currentVerb.conjugations[currentTense][currentPronoun],
	);
	const isCorrect = $derived.by(
		() =>
			currentInput.trim().toLowerCase() ==
			currentConjugation.conjugation.toLowerCase(),
	);

	let currentInput = $state('');

	let displayCorrect = $state(false);
	let displayIncorrect = $state(false);

	function checkAnswer(e: Event) {
		e.preventDefault();
		if (currentInput.trim() == '') {
			return;
		}
		if (displayIncorrect) {
			return;
		}
		if (!isCorrect) {
			displayIncorrect = true;
			return;
		}
		displayIncorrect = false;
		displayCorrect = true;
		nextVerb();
		currentInput = '';
	}

	const accentMap = {
		A: 'á',
		E: 'é',
		I: 'í',
		O: 'ó',
		U: 'ú',
	};

	function checkInput(
		e: Event & { currentTarget: EventTarget & HTMLInputElement },
	) {
		for (const [original, accent] of Object.entries(accentMap)) {
			if (e.currentTarget.value.includes(original)) {
				e.currentTarget.value = e.currentTarget.value.replaceAll(
					original,
					accent,
				);
			}
		}
		e.currentTarget.value = e.currentTarget.value
			.trimStart()
			.replaceAll(/[^a-záéíóúñ ]/gm, '')
			.replaceAll(/ {2,}/gm, ' ');
		if (!displayIncorrect) {
			return;
		}
		if (!isCorrect) {
			return;
		}
		displayIncorrect = false;
		displayCorrect = true;
		nextVerb();
		currentInput = '';
	}
</script>

<div class="flex flex-100 flex-col items-center">
	<form onsubmit={checkAnswer}>
		<input
			type="text"
			class="mt-3 h-12 w-100 text-center text-2xl"
			placeholder="Conjugate here!"
			aria-invalid={displayIncorrect && !displayCorrect ? 'true' : null}
			bind:value={currentInput}
			oninput={checkInput}
			autocorrect="off"
			autocapitalize="off"
			spellcheck="false"
			translate="no"
			writingsuggestions="false" />
	</form>
	{#if displayIncorrect}
		<span class="error text-xl"
			>The correct answer is <span class="font-bold"
				>{currentConjugation.conjugation}</span
			></span>
	{:else if displayCorrect}
		<span class="success text-xl font-bold">Correct!</span>
	{/if}
</div>

<style>
	.error {
		color: var(--pico-form-element-invalid-focus-color);
	}
	.success {
		color: var(--pico-form-element-valid-focus-color);
	}
</style>
