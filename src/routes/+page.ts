import type { PageLoad } from './$types';
import verbs from '$lib/data/verbs.json';
import { type VerbData } from '$lib/types';

export const load = (() => {
	const allVerbs = Object.values(verbs as { [key: string]: VerbData });
	return {
		verbs: allVerbs,
	};
}) satisfies PageLoad;

export const ssr = false;
