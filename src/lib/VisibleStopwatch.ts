export class VisibleStopwatch {
	#startTime: DOMHighResTimeStamp = performance.now();
	#totalHiddenTime: DOMHighResTimeStamp = 0;
	#lastHiddenStartTime: DOMHighResTimeStamp = NaN;

	get visibleTime(): DOMHighResTimeStamp {
		return this.totalTime - this.#totalHiddenTime;
	}

	get totalTime(): DOMHighResTimeStamp {
		return performance.now() - this.#startTime;
	}

	reset() {
		this.#startTime = performance.now();
		this.#totalHiddenTime = 0;
		this.#lastHiddenStartTime =
			isNaN(this.#lastHiddenStartTime) ? NaN : performance.now();
	}

	update() {
		if (document.visibilityState === 'hidden') {
			this.#lastHiddenStartTime = performance.now();
		} else {
			if (!isNaN(this.#lastHiddenStartTime)) {
				this.#totalHiddenTime +=
					performance.now() - this.#lastHiddenStartTime;
				this.#lastHiddenStartTime = NaN;
			}
		}
	}
}
