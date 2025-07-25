<script lang="ts">
	import { InclusionType } from '$lib/types';

	const {
		title,
		inclusionType,
		setInclusion,
	}: {
		title: string;
		inclusionType: InclusionType;
		setInclusion: (type: InclusionType) => void;
	} = $props();
</script>

<article class="flex flex-1 flex-col gap-2 rounded-lg">
	<h4 class="mb-2">{title}</h4>
	{#each InclusionType.values as type (type)}
		<label>
			<input
				type="radio"
				name="inclusion-{title}"
				checked={inclusionType === type}
				onchange={() => setInclusion(type)} />
			{type}
		</label>
	{/each}
</article>
