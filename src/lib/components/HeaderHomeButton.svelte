<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
</script>

<button
	class="contrast m-0 border-none p-0 text-3xl leading-0 font-bold outline outline-none"
	onclick={() => goto(resolve('/'))}>Verb Trainer</button>
