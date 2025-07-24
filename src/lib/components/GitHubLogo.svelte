<button class="contrast m-0 p-0">
	<a href="https://github.com/dkim19375/verb-trainer">
		<img src="/github-mark.svg" alt="GitHub Logo" class="dark-logo" />
		<img
			src="/github-mark-white.svg"
			alt="GitHub Logo"
			class="light-logo" />
	</a>
</button>

<style>
	@media only screen and (prefers-color-scheme: dark) {
		:root:not([data-theme]) .dark-logo {
			display: none;
		}
	}

	@media only screen and not (prefers-color-scheme: dark) {
		:root:not([data-theme]) .light-logo {
			display: none;
		}
	}

	button {
		background: none;
		border: none;
	}

	a:focus {
		-webkit-box-shadow: none;
		box-shadow: none;
	}
</style>
