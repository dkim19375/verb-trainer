export enum Pronoun {
	FirstPersonSingular = 'FirstPersonSingular',
	SecondPersonSingular = 'SecondPersonSingular',
	ThirdPersonSingular = 'ThirdPersonSingular',
	FirstPersonPlural = 'FirstPersonPlural',
	SecondPersonPlural = 'SecondPersonPlural',
	ThirdPersonPlural = 'ThirdPersonPlural',
}

export const PronounExamples: Record<Pronoun, string> = {
	[Pronoun.FirstPersonSingular]: 'Yo',
	[Pronoun.SecondPersonSingular]: 'Tú',
	[Pronoun.ThirdPersonSingular]: 'Él, Ella, Usted',
	[Pronoun.FirstPersonPlural]: 'Nosotros, Nosotras',
	[Pronoun.SecondPersonPlural]: 'Vosotros, Vosotras',
	[Pronoun.ThirdPersonPlural]: 'Ellos, Ellas, Ustedes',
};

export enum Tense {
	IndicativePresent = 'IndicativePresent',
	IndicativePreterite = 'IndicativePreterite',
	IndicativeFuture = 'IndicativeFuture',
	IndicativePresentPerfect = 'IndicativePresentPerfect',
	IndicativePastPerfect = 'IndicativePastPerfect',
	IndicativeFuturePerfect = 'IndicativeFuturePerfect',
	IndicativePresentProgressive = 'IndicativePresentProgressive',
	IndicativeImperfect = 'IndicativeImperfect',
	IndicativeConditional = 'IndicativeConditional',
	ImperativeAffirmative = 'ImperativeAffirmative',
	ImperativeNegative = 'ImperativeNegative',
	IndicativeConditionalPerfect = 'IndicativeConditionalPerfect',
	SubjunctivePresent = 'SubjunctivePresent',
}

export const TenseDisplayNames: Record<Tense, string> = {
	[Tense.IndicativePresent]: 'Present',
	[Tense.IndicativePresentProgressive]: 'Present Progressive',
	[Tense.IndicativeFuture]: 'Future',
	[Tense.IndicativeConditional]: 'Conditional',
	[Tense.IndicativePreterite]: 'Preterite',
	[Tense.IndicativeImperfect]: 'Imperfect',
	[Tense.IndicativePresentPerfect]: 'Present Perfect',
	[Tense.IndicativeFuturePerfect]: 'Future Perfect',
	[Tense.IndicativePastPerfect]: 'Past Perfect',
	[Tense.IndicativeConditionalPerfect]: 'Conditional Perfect',
	[Tense.SubjunctivePresent]: 'Subjunctive',
	[Tense.ImperativeAffirmative]: 'Imperative (Affirmative)',
	[Tense.ImperativeNegative]: 'Imperative (Negative)',
};

export const TenseExamples: Record<Tense, string> = {
	[Tense.IndicativePresent]: 'Yo hablo',
	[Tense.IndicativePresentProgressive]: 'Yo estoy hablando',
	[Tense.IndicativeFuture]: 'Yo hablaré',
	[Tense.IndicativeConditional]: 'Yo hablaría',
	[Tense.IndicativePreterite]: 'Yo hablé',
	[Tense.IndicativeImperfect]: 'Yo hablaba',
	[Tense.IndicativePresentPerfect]: 'Yo he hablado',
	[Tense.IndicativeFuturePerfect]: 'Yo habré hablado',
	[Tense.IndicativePastPerfect]: 'Yo había hablado',
	[Tense.IndicativeConditionalPerfect]: 'Yo habría hablado',
	[Tense.SubjunctivePresent]: 'Yo hable',
	[Tense.ImperativeAffirmative]: '¡Habla!',
	[Tense.ImperativeNegative]: '¡No hables!',
};

export type EnglishData = {
	infinitive: string;
	present: string;
	present3rdPerson: string;
	gerund: string;
	past: string;
	pastParticiple: string;
	disambiguation: string;
};

export type ConjugationData = {
	conjugation: string;
	isIrregular: boolean;
};

export enum InclusionType {
	Include = 'Include',
	Exclude = 'Exclude',
	Only = 'Only',
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace InclusionType {
	export function isIncluded(
		inclusionType: InclusionType,
		exists: boolean,
	): boolean {
		switch (inclusionType) {
			case InclusionType.Include:
				return true;
			case InclusionType.Exclude:
				return !exists;
			case InclusionType.Only:
				return exists;
		}
	}

	export const values: InclusionType[] = [
		InclusionType.Include,
		InclusionType.Exclude,
		InclusionType.Only,
	];
}

export enum VerbListType {
	All = 'All',
	Top = 'Top',
	Custom = 'Custom',
}

export enum VerbEnding {
	AR = 'ar',
	ER = 'er',
	IR = 'ir',
}

export const VerbEndingDisplays = {
	[VerbEnding.AR]: '-ar',
	[VerbEnding.ER]: '-er',
	[VerbEnding.IR]: '-ir',
};

export enum Language {
	Spanish = 'Spanish',
	English = 'English',
}

export type VerbTrainerData = {
	pronouns: Pronoun[];
	tenses: Tense[];
	includeReflexive: InclusionType;
	includeIrregular: InclusionType;
	verbListType: VerbListType;
	verbListTopNum: string;
	verbListCustom: string;
	endings: VerbEnding[];
	promptLanguage: Language;
};

const defaultVerbTrainerData: VerbTrainerData = {
	pronouns: Object.values(Pronoun),
	tenses: Object.values(Tense),
	includeReflexive: InclusionType.Include,
	includeIrregular: InclusionType.Include,
	verbListType: VerbListType.All,
	verbListTopNum: '',
	verbListCustom: '',
	endings: Object.values(VerbEnding),
	promptLanguage: Language.English,
};

export function getDefaultVerbTrainerData(): VerbTrainerData {
	return structuredClone(defaultVerbTrainerData);
}

export type VerbData = {
	infinitive: string;
	english: EnglishData;
	reflexive: boolean;
	frequencyRanking: number;
	ending: VerbEnding;
	conjugations: { [key in Tense]: { [key in Pronoun]: ConjugationData } };
};

export function jsonToTenseData(
	json:
		| {
				Yo: string[] | string;
				Tu: string[] | string;
				El: string[] | string;
				Nosotros: string[] | string;
				Vosotros: string[] | string;
				Ellos: string[] | string;
		  }
		| undefined,
): Map<Pronoun, string> {
	const map = new Map<Pronoun, string>();
	if (!json) {
		return map;
	}
	function addIfExists(pronoun: Pronoun, value: string | string[]) {
		if (value && value.length > 0) {
			const str = Array.isArray(value) ? value[0] : value;
			if (str.length > 0) {
				map.set(pronoun, str);
			}
		}
	}
	addIfExists(Pronoun.FirstPersonSingular, json.Yo);
	addIfExists(Pronoun.SecondPersonSingular, json.Tu);
	addIfExists(Pronoun.ThirdPersonSingular, json.El);
	addIfExists(Pronoun.FirstPersonPlural, json.Nosotros);
	addIfExists(Pronoun.SecondPersonPlural, json.Vosotros);
	addIfExists(Pronoun.ThirdPersonPlural, json.Ellos);
	return map;
}

export function jsonToEnding(ending: string): VerbEnding {
	switch (ending) {
		case 'ar':
			return VerbEnding.AR;
		case 'er':
			return VerbEnding.ER;
		case 'ir':
			return VerbEnding.IR;
		default:
			throw new Error(`Unknown verb ending: ${ending}`);
	}
}
