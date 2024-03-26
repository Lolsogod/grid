<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<main>
	<h1>WordGrid UI</h1>
    
    <a href="/">Main</a>
	<a href="/build">Grid</a>
	
	<slot />
</main>
<style>
    main {
		margin: 2rem;
	}
</style>