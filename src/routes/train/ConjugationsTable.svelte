<script lang="ts">
	import { Pronoun } from '$lib/types';
	import type { VerbConjugationStates } from './VerbConjugationStates.svelte';

	const {
		currentVerb,
	}: {
		currentVerb: VerbConjugationStates;
	} = $props();
</script>

<table class="notranslate mb-0 w-auto table-fixed" translate="no">
	<tbody>
		<tr>
			{@render conjugationCell(Pronoun.FirstPersonSingular, 'left')}
			{@render conjugationCell(Pronoun.FirstPersonPlural, 'right')}
		</tr>
		<tr>
			{@render conjugationCell(Pronoun.SecondPersonSingular, 'left')}
			{@render conjugationCell(Pronoun.SecondPersonPlural, 'right')}
		</tr>
		<tr>
			{@render conjugationCell(Pronoun.ThirdPersonSingular, 'left', true)}
			{@render conjugationCell(Pronoun.ThirdPersonPlural, 'right', true)}
		</tr>
	</tbody>
</table>

{#snippet conjugationCell(
	pronoun: Pronoun,
	side: 'left' | 'right',
	isLast: boolean = false,
)}
	<td
		class="min-w-30 bg-inherit px-8 text-center {side == 'left' ?
			'border-r-1'
		:	''} {isLast ? 'border-b-0' : ''}">
		{currentVerb.currentVerb.conjugations[currentVerb.currentTense][
			pronoun
		].conjugation}
	</td>

	<style>
		td {
			border-color: var(--pico-table-border-color);
			overflow: hidden;
			white-space: nowrap;
		}
	</style>
{/snippet}
