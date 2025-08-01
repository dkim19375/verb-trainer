import {
	type VerbData,
	Tense,
	InclusionType,
	Pronoun,
	PronounExamples,
	type VerbTrainerData,
	type ConjugationData,
	Language,
} from '$lib/types';
import type { PersistentState } from '@friendofsvelte/state';

export class VerbConjugationStates {
	#currentVerb: VerbData;
	#currentTense: Tense;
	#currentPronoun: Pronoun;
	#currentPronounExample: string;

	#verbs: VerbData[];
	#verbConfig: PersistentState<VerbTrainerData>;

	constructor(
		verbs: VerbData[],
		verbConfig: PersistentState<VerbTrainerData>,
	) {
		this.#verbs = verbs;
		this.#verbConfig = verbConfig;
		this.#currentVerb = $state(this.getRandomVerb());
		this.#currentTense = $state(this.getRandomTense());
		this.#currentPronoun = $state(this.getRandomPronoun());
		this.#currentPronounExample = $state(this.getRandomPronounExample());
	}

	get currentVerb(): VerbData {
		return this.#currentVerb;
	}
	get currentTense(): Tense {
		return this.#currentTense;
	}
	get currentPronoun(): Pronoun {
		return this.#currentPronoun;
	}
	get currentPronounExample(): string {
		return this.#currentPronounExample;
	}
	get currentConjugation(): ConjugationData {
		return this.#currentVerb.conjugations[this.#currentTense][
			this.#currentPronoun
		];
	}
	get verbDisplay(): string {
		if (this.#verbConfig.current.promptLanguage === Language.English) {
			return this.#currentVerb.english.infinitive;
		}
		return this.#currentVerb.infinitive;
	}
	get verbDisplayAlt(): string {
		const english = this.#currentVerb.english;
		const clarifier =
			english.disambiguation ? ` (${english.disambiguation})` : '';
		if (this.#verbConfig.current.promptLanguage === Language.English) {
			return clarifier;
		}
		return `${english.infinitive}${clarifier}`;
	}

	getNewVerb() {
		this.#currentVerb = this.getRandomVerb();
		this.#currentTense = this.getRandomTense();
		this.#currentPronoun = this.getRandomPronoun();
		this.#currentPronounExample = this.getRandomPronounExample();
	}

	getRandomVerb(): VerbData {
		return this.#verbs[(Math.random() * this.#verbs.length) | 0];
	}

	getRandomTense(): Tense {
		const regularOnly =
			this.#verbConfig.current.includeIrregular == InclusionType.Exclude;
		const irregularOnly =
			this.#verbConfig.current.includeIrregular == InclusionType.Only;
		const availableTenses =
			!regularOnly && !irregularOnly ?
				this.#verbConfig.current.tenses.filter(
					(tense) =>
						Object.entries(this.#currentVerb.conjugations[tense]).filter(
							([pronoun, conjugation]) =>
								this.#verbConfig.current.pronouns.includes(
									pronoun as Pronoun,
								) && conjugation,
						).length,
				)
			:	this.#verbConfig.current.tenses.filter(
					(tense) =>
						Object.entries(this.#currentVerb.conjugations[tense]).filter(
							([pronoun, conjugation]) =>
								this.#verbConfig.current.pronouns.includes(
									pronoun as Pronoun,
								) &&
								conjugation &&
								(regularOnly ?
									!conjugation.isIrregular
								:	conjugation.isIrregular),
						).length,
				);
		return availableTenses[(Math.random() * availableTenses.length) | 0];
	}

	getRandomPronoun(): Pronoun {
		const regularOnly =
			this.#verbConfig.current.includeIrregular == InclusionType.Exclude;
		const irregularOnly =
			this.#verbConfig.current.includeIrregular == InclusionType.Only;
		const availablePronouns = this.#verbConfig.current.pronouns.filter(
			(pronoun) => {
				const { conjugation, isIrregular } =
					this.#currentVerb.conjugations[this.#currentTense][pronoun];
				return (
					conjugation &&
					(regularOnly ? !isIrregular
					: irregularOnly ? isIrregular
					: true)
				);
			},
		);
		return availablePronouns[
			(Math.random() * availablePronouns.length) | 0
		];
	}

	getRandomPronounExample(): string {
		const examples = PronounExamples[this.#currentPronoun].split(',');
		return examples[(Math.random() * examples.length) | 0].trim();
	}
}
