import {
	InclusionType,
	VerbListType,
	type VerbData,
	type VerbTrainerData,
} from '$lib/types';

export function getFilteredVerbs(
	verbTrainerData: VerbTrainerData,
	verbs: VerbData[],
): VerbData[] {
	const customVerbs = verbTrainerData.verbListCustom
		.split(',')
		.map((v) => v.trim().toLowerCase())
		.filter((v) => v.length > 0);

	const filteredVerbs = verbs.filter((verb) => {
		if (
			!InclusionType.isIncluded(
				verbTrainerData.includeReflexive,
				verb.reflexive,
			)
		) {
			return false;
		}
		if (!verbTrainerData.endings.includes(verb.ending)) {
			return false;
		}
		let isVerbIncluded = verbTrainerData.verbListTypes.includes(
			VerbListType.All,
		);
		if (
			verbTrainerData.verbListTypes.includes(VerbListType.Custom) &&
			customVerbs.includes(verb.infinitive.toLowerCase())
		) {
			isVerbIncluded = true;
		}
		if (verbTrainerData.verbListTypes.includes(VerbListType.Top)) {
			const topNum = parseInt(verbTrainerData.verbListTopNum);
			if (topNum) {
				if (verb.frequencyRanking <= topNum) {
					isVerbIncluded = true;
				}
			}
		}
		if (!isVerbIncluded) {
			return false;
		}
		let isRegular = false;
		let isIrregular = false;
		for (const tense of verbTrainerData.tenses) {
			const tenseData = verb.conjugations[tense];
			if (!tenseData) continue;
			for (const pronoun of verbTrainerData.pronouns) {
				const conjugation = tenseData[pronoun];
				if (!conjugation.conjugation) {
					continue;
				}
				if (conjugation.isIrregular) {
					isIrregular = true;
				} else {
					isRegular = true;
				}
			}
		}
		if (!isRegular && !isIrregular) {
			return false;
		}
		switch (verbTrainerData.includeIrregular) {
			case InclusionType.Include:
				break;
			case InclusionType.Exclude:
				if (!isRegular) {
					// If only irregular verbs are found, then exclude
					return false;
				}
				break;
			case InclusionType.Only:
				if (!isIrregular) {
					// If only regular verbs are found, then exclude
					return false;
				}
				break;
		}
		return true;
	});
	return filteredVerbs;
}
