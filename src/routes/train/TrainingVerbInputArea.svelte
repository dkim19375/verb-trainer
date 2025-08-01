<script lang="ts">
	import type { Pronoun, Tense, VerbData } from '$lib/types';
	import { tick } from 'svelte';
	import { fade } from 'svelte/transition';

	const {
		currentVerb,
		currentTense,
		currentPronoun,
		nextVerb,
		gotIncorrect,
	}: {
		currentVerb: VerbData;
		currentTense: Tense;
		currentPronoun: Pronoun;
		nextVerb: (firstTry: boolean) => void;
		gotIncorrect: () => void;
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
	let outTransitionEnabled = $state(false);

	async function showCorrectNotification() {
		displayCorrect = true;
		await tick();
		outTransitionEnabled = true;
		displayCorrect = false;
		await tick();
		outTransitionEnabled = false;
	}

	function checkAnswer(e: Event) {
		e.preventDefault();
		if (currentInput.trim() == '') {
			return;
		}
		if (displayIncorrect) {
			return;
		}
		if (!isCorrect) {
			gotIncorrect();
			displayIncorrect = true;
			return;
		}
		displayIncorrect = false;
		nextVerb(true);
		currentInput = '';
		void showCorrectNotification();
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
		const textBefore = e.currentTarget.value;
		const selection =
			e.currentTarget.selectionStart === null ?
				0
			:	e.currentTarget.selectionStart;
		e.currentTarget.value = e.currentTarget.value
			.replaceAll(/[^a-záéíóúñ ]/gm, '')
			.replaceAll(/ {2,}/gm, ' ');
		if (selection !== null && selection > 2) {
			e.currentTarget.value = e.currentTarget.value.trimStart();
		}
		if (
			textBefore !== e.currentTarget.value &&
			textBefore.length >= e.currentTarget.value.length
		) {
			e.currentTarget.setSelectionRange(selection - 1, selection - 1);
		}
		currentInput = e.currentTarget.value;
		if (!displayIncorrect) {
			return;
		}
		if (!isCorrect) {
			return;
		}
		displayIncorrect = false;
		nextVerb(false);
		currentInput = '';
		void showCorrectNotification();
	}
</script>

<div class="flex flex-col items-center">
	<form onsubmit={checkAnswer}>
		<input
			type="text"
			class="mt-3 h-12 w-100 rounded-lg text-center text-2xl"
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
		<span
			class="success text-xl font-bold"
			out:fade={{
				delay: outTransitionEnabled ? 1000 : 0,
				duration: outTransitionEnabled ? 500 : 0,
			}}>Correct!</span>
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
