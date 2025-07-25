<script lang="ts">
	import { VerbListType } from '$lib/types';

	const {
		verbListTypes,
		verbListTopNum,
		verbListCustom,
		verbsList,
		updateListTypes,
	}: {
		verbListTypes: VerbListType[];
		verbListTopNum: string;
		verbListCustom: string;
		verbsList: string[];
		updateListTypes: (
			types: VerbListType[],
			topNum: string,
			list: string,
		) => void;
	} = $props();

	const maxTopNum = 500;

	const isTopVerbsValid = $derived(isValidTopNum(verbListTopNum));

	function isValidTopNum(num: string): boolean {
		const parsed = Number(num);
		return !isNaN(parsed) && parsed >= 1 && parsed <= maxTopNum;
	}

	const invalidVerbsReason = $derived.by(() => {
		if (!verbListTypes.includes(VerbListType.Custom)) {
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

	function getNewVerbListTypes(
		selected: VerbListType,
		enable: boolean,
	): VerbListType[] {
		if (!enable) {
			return verbListTypes.filter((type) => type !== selected);
		}
		if (selected === VerbListType.All) {
			return [VerbListType.All];
		}
		const otherTypes = verbListTypes.filter(
			(type) => type !== VerbListType.All && type !== selected,
		);
		return [...otherTypes, selected];
	}
</script>

<article class="flex flex-1 flex-col gap-2 rounded-lg">
	<h4 class="mb-2">Verbs</h4>
	<label>
		<input
			type="radio"
			name="verbListAll"
			checked={verbListTypes.includes(VerbListType.All)}
			onchange={() =>
				updateListTypes(
					getNewVerbListTypes(VerbListType.All),
					verbListTopNum,
					verbListCustom,
				)} />
		{VerbListType.All}
	</label>
	<label class="mb-0 flex w-auto items-center">
		<input
			type="checkbox"
			name="verbListTop"
			class="aspect-square"
			checked={verbListTypes.includes(VerbListType.Top)}
			onchange={(e) =>
				updateListTypes(
					getNewVerbListTypes(VerbListType.Top, e.currentTarget.checked),
					verbListTopNum,
					verbListCustom,
				)} />
		<span class="mx-1">{VerbListType.Top}</span>
		<input
			type="number"
			placeholder="100"
			class="my-0 ml-1 h-7 w-max pr-0 pl-1.5"
			aria-invalid={verbListTypes.includes(VerbListType.Top) ?
				isTopVerbsValid ? 'false'
				:	'true'
			:	null}
			value={verbListTopNum}
			min="1"
			max={maxTopNum}
			oninput={(e) => {
				if (e.currentTarget.value.length <= 0) {
					e.currentTarget.value = '';
				}
				if (
					e.currentTarget.value.length >
					maxTopNum.toString().length + 1
				) {
					e.currentTarget.value = e.currentTarget.value.slice(
						0,
						maxTopNum.toString().length + 1,
					);
				}
				while (
					e.currentTarget.value.length > 0 &&
					e.currentTarget.value.length <= maxTopNum.toString().length
				) {
					if (e.currentTarget.value.startsWith('0')) {
						e.currentTarget.value = e.currentTarget.value.slice(1);
						continue;
					}
					if (!isValidTopNum(e.currentTarget.value)) {
						e.currentTarget.value = maxTopNum.toString();
					}
					break;
				}
				updateListTypes(
					getNewVerbListTypes(VerbListType.Top, true),
					e.currentTarget.value,
					verbListCustom,
				);
			}}
			onkeyup={(e) => {
				console.log(e.currentTarget.value);
				updateListTypes(
					getNewVerbListTypes(VerbListType.Top, true),
					e.currentTarget.value,
					verbListCustom,
				);
			}} />
	</label>
	<div class="mt-0.4 flex items-start">
		<input
			type="checkbox"
			name="verbListCustom"
			class="mt-1 mr-3 aspect-square"
			checked={verbListTypes.includes(VerbListType.Custom)}
			onchange={(e) =>
				updateListTypes(
					getNewVerbListTypes(
						VerbListType.Custom,
						e.currentTarget.checked,
					),
					verbListTopNum,
					verbListCustom,
				)} />
		<div>
			<input
				type="text"
				placeholder="andar, beber, vivir"
				class="m-0 h-7 p-1.5 text-sm"
				aria-invalid={verbListTypes.includes(VerbListType.Custom) ?
					isCustomVerbsValid ? 'false'
					:	'true'
				:	null}
				aria-describedby="custom-verbs-invalid-description"
				value={verbListCustom}
				oninput={(e) =>
					updateListTypes(
						getNewVerbListTypes(VerbListType.Custom, true),
						verbListTopNum,
						e.currentTarget.value,
					)}
				onkeyup={(e) =>
					updateListTypes(
						getNewVerbListTypes(VerbListType.Custom, true),
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
