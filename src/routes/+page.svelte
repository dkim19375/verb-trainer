<script lang="ts">
	import PronounsSelector from './PronounsSelector.svelte';

	import {
		getDefaultVerbTrainerData,
		InclusionType,
		Language,
		VerbListType,
	} from '$lib/types';
	import TensesSelector from './TensesSelector.svelte';
	import IncludeExcludeSelector from './IncludeExcludeSelector.svelte';

	import VerbListSelector from './VerbListSelector.svelte';
	import VerbEndingsSelector from './VerbEndingsSelector.svelte';
	import { PersistentState } from '@friendofsvelte/state';
	import { getFilteredVerbs } from '$lib/verb-filtering';
	import type { PageProps } from './$types';
	import MainHeader from './MainHeader.svelte';
	import PromptLanguageSelector from './PromptLanguageSelector.svelte';

	export const data = new PersistentState(
		'data',
		getDefaultVerbTrainerData(),
	);

	const { data: loadedData }: PageProps = $props();
	const verbs = loadedData.verbs;

	const currentVerbAmount = $derived(
		getFilteredVerbs(data.current, verbs).length,
	);

	function toggle<T>(array: T[], item: T) {
		if (array.includes(item)) {
			array.splice(array.indexOf(item), 1);
		} else {
			array.push(item);
		}
	}
</script>

<MainHeader verbsAmount={currentVerbAmount} />
<main class="mx-auto flex max-w-5xl justify-center gap-4 text-sm">
	<section class="flex flex-1/5 flex-col gap-4">
		<PronounsSelector
			pronouns={data.current.pronouns}
			togglePronoun={(pronoun) =>
				toggle(data.current.pronouns, pronoun)} />
		<VerbEndingsSelector
			endings={data.current.endings}
			toggleEnding={(ending) => toggle(data.current.endings, ending)} />
		<PromptLanguageSelector
			promptLanguage={data.current.promptLanguage}
			setPromptLanguage={(language: Language) =>
				(data.current.promptLanguage = language)} />
	</section>
	<section class="mb-0 flex flex-4/5 flex-col flex-wrap gap-4">
		<TensesSelector
			tenses={data.current.tenses}
			toggleTense={(tense) => toggle(data.current.tenses, tense)} />
		<section class="mb-0 flex gap-4">
			<IncludeExcludeSelector
				title="Reflexive"
				inclusionType={data.current.includeReflexive}
				setInclusion={(type: InclusionType) =>
					(data.current.includeReflexive = type)} />
			<IncludeExcludeSelector
				title="Irregular"
				inclusionType={data.current.includeIrregular}
				setInclusion={(type: InclusionType) =>
					(data.current.includeIrregular = type)} />
			<VerbListSelector
				verbListType={data.current.verbListType}
				verbListTopNum={data.current.verbListTopNum}
				verbListCustom={data.current.verbListCustom}
				verbsList={verbs.map((v) => v.infinitive.toLowerCase())}
				updateListType={(
					type: VerbListType,
					topNum: string,
					list: string,
				) => {
					data.current.verbListType = type;
					data.current.verbListTopNum = topNum;
					data.current.verbListCustom = list;
				}} />
		</section>
	</section>
</main>
