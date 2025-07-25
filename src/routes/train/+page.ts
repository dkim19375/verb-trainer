import type { PageLoad } from './$types';
import { getDefaultVerbTrainerData, type VerbData } from '$lib/types';
import { PersistentState } from '@friendofsvelte/state';
import { error } from '@sveltejs/kit';
import { getFilteredVerbs } from '$lib/verb-filtering';
import verbs from '$lib/data/verbs.json';

export const load = (() => {
	const verbTrainerData = new PersistentState(
		'data',
		getDefaultVerbTrainerData(),
	).current;
	const allVerbs = Object.values(verbs as { [key: string]: VerbData });
	const filteredVerbs = getFilteredVerbs(verbTrainerData, allVerbs);
	if (filteredVerbs.length === 0) {
		error(400, 'No verbs found');
	}
	return {
		verbs: filteredVerbs,
	};
}) satisfies PageLoad;

export const ssr = false;
