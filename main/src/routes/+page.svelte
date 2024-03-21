<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
    import type { PageData } from './$types';
    import '@picocss/pico'
	import { invalidateAll } from '$app/navigation';

    export let data: PageData;

    onMount(() => {
		const interval = setInterval(() => {
			invalidateAll();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<main>
    <h1>WordGrid UI</h1>
    <h3>status</h3>
    <ul>
        <li>topic name: {data.topic.name}</li>
        <li>partition size: {data.topic.partitions.length}</li>
        <li>free nodes: {data.nodeCount}</li>
    </ul>
    <br>
    <form method="POST" action="?/init" use:enhance>
        <button>{data.topic.partitions.length==0?'Initialize topic':'Adjust partition size'}</button>
    </form>
    <br>
    {#if data.topic.partitions.length > 0}
    <form method="POST" action="?/delete" use:enhance>
        <button>Delete topic</button>
    </form>
    {/if}
    <br>
    {#if data.nodeCount > 0}
    <form method="POST" action="?/send" use:enhance>
        <button>Start sending</button>
    </form>
    {/if}
</main>


<style lang="scss">
    main{
        margin: 2rem;
    }
</style>