<script lang="ts">
	import { VerbListType } from '$lib/types';

	const {
		verbListType,
		verbListTopNum,
		verbListCustom,
		verbsList,
		updateListType,
	}: {
		verbListType: VerbListType;
		verbListTopNum: string;
		verbListCustom: string;
		verbsList: string[];
		updateListType: (
			type: VerbListType,
			topNum: string,
			list: string,
		) => void;
	} = $props();

	const maxTopNum = 500;

	const isTopVerbsValid = $derived(
		!isNaN(Number(verbListTopNum)) &&
			Number(verbListTopNum) >= 1 &&
			Number(verbListTopNum) <= maxTopNum,
	);

	const invalidVerbsReason = $derived.by(() => {
		if (verbListType !== VerbListType.Custom) {
			return '';
		}
		const verbs = verbListCustom
			.split(',')
			.map((v) => v.trim())
			.filter((v) => v.length > 0);
		if (verbs.length <= 0) {
			return 'No verbs provided';
		}
		const unknown = verbs.filter(
			(v) => !verbsList.includes(v.toLowerCase()),
		);
		if (unknown.length > 0) {
			return `Unknown verbs: ${unknown.join(', ')}`;
		}
		return '';
	});

	const isCustomVerbsValid = $derived(invalidVerbsReason === '');
</script>

<article class="flex flex-1 flex-col gap-2 rounded-lg">
	<h4 class="mb-2">Verbs</h4>
	<label>
		<input
			type="radio"
			name="verbListAll"
			checked={verbListType === VerbListType.All}
			onchange={() =>
				updateListType(
					VerbListType.All,
					verbListTopNum,
					verbListCustom,
				)} />
		{VerbListType.All}
	</label>
	<label class="mb-0 flex w-auto items-center">
		<input
			type="radio"
			name="verbListTop"
			class="aspect-square"
			checked={verbListType === VerbListType.Top}
			onchange={() =>
				updateListType(
					VerbListType.Top,
					verbListTopNum,
					verbListCustom,
				)} />
		<span class="mx-1">{VerbListType.Top}</span>
		<input
			type="number"
			placeholder="100"
			class="my-0 ml-1 h-7 w-max pr-0 pl-1.5"
			aria-invalid={verbListType === VerbListType.Top ?
				isTopVerbsValid ? 'false'
				:	'true'
			:	null}
			value={verbListTopNum}
			min="1"
			max={maxTopNum}
			oninput={(e) =>
				updateListType(
					VerbListType.Top,
					e.currentTarget.value,
					verbListCustom,
				)}
			onkeyup={(e) =>
				updateListType(
					VerbListType.Top,
					e.currentTarget.value,
					verbListCustom,
				)} />
	</label>
	<div class="mt-0.4 flex items-start">
		<input
			type="radio"
			name="verbListCustom"
			class="mt-1 mr-3 aspect-square"
			checked={verbListType === VerbListType.Custom}
			onchange={() =>
				updateListType(
					VerbListType.Custom,
					verbListTopNum,
					verbListCustom,
				)} />
		<div>
			<input
				type="text"
				placeholder="andar, beber, vivir"
				class="m-0 h-7 p-1.5 text-sm"
				aria-invalid={verbListType === VerbListType.Custom ?
					isCustomVerbsValid ? 'false'
					:	'true'
				:	null}
				aria-describedby="custom-verbs-invalid-description"
				value={verbListCustom}
				oninput={(e) =>
					updateListType(
						VerbListType.Custom,
						verbListTopNum,
						e.currentTarget.value,
					)}
				onkeyup={(e) =>
					updateListType(
						VerbListType.Custom,
						verbListTopNum,
						e.currentTarget.value,
					)} />
			<small
				id="custom-verbs-invalid-description"
				class="m-0 mt-1 p-0 leading-3">{invalidVerbsReason}</small>
		</div>
	</div>
</article>

<style>
	small {
		margin-bottom: -0.6rem;
	}
</style>
