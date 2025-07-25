<script lang="ts">
	import { mixColors, parseColor } from 'esm-color';
	import { linear } from 'svelte/easing';
	import { type TransitionConfig } from 'svelte/transition';

	const {
		totalAmount,
		correctAmount,
		streak,
		brokeStreakUpdater: brokeStreak,
	}: {
		totalAmount: number;
		correctAmount: number;
		streak: number;
		brokeStreakUpdater: boolean;
	} = $props();

	const percentCorrect = $derived(
		totalAmount === 0 ? 0 : (
			Math.round((correctAmount / totalAmount) * 100)
		),
	);

	function breakStreakTransition(node: Element): TransitionConfig {
		const style = window.getComputedStyle(node);
		const baseColor: string = style.color;
		const brokenColor: string = style.getPropertyValue(
			'--pico-form-element-invalid-focus-color',
		);
		const errorDuration = 500;
		const transitionDuration = 1000;
		const totalDuration = errorDuration + transitionDuration;
		return {
			duration: totalDuration,
			css: (t: number) => {
				const startTransitionAt = errorDuration / totalDuration;

				const state =
					t < startTransitionAt ? 0 : (
						linear((t - startTransitionAt) / (1 - startTransitionAt))
					);

				const newColor = parseColor(
					mixColors(baseColor, brokenColor, state),
				);

				const minWeight = 400;
				const maxWeight = 900;

				const weight = Math.round(
					minWeight + (maxWeight - minWeight) * (1 - state),
				);

				return `
                    color: rgb(${newColor[0]}, ${newColor[1]}, ${newColor[2]});
                    font-weight: ${weight};
                `;
			},
		};
	}
</script>

<article
	class="flex min-w-60 justify-center gap-5 rounded-2xl px-6 text-center text-xl leading-4">
	{#key brokeStreak}
		<span in:breakStreakTransition>{streak}🔥</span>
	{/key}
	<span
		>{correctAmount}/{totalAmount}
		<span class="font-light">({percentCorrect}%)</span></span>
</article>
