<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import '@picocss/pico';
	import { invalidateAll } from '$app/navigation';
	import { Status } from '$lib/enums';

	export let data: PageData;

	onMount(() => {
		const interval = setInterval(() => {
			invalidateAll();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
	// на бек
	const getBest = () => {
		if (data.tasks.length === 0) return null;

		return data.tasks.reduce((prevTask, currentTask) => {
			return prevTask.result[0] > currentTask.result[0] ? prevTask : currentTask;
		});
	};
	$: bestTask = getBest();
</script>

<main>
	<h1>WordGrid UI</h1>
	<div class="container">
		<div>
			<h3>cluster status</h3>
			<ul>
				<li>topic name: {data.topic.name}</li>
				<li>partition size: {data.topic.partitions.length}</li>
				<li>free nodes: {data.nodeCount}</li>
			</ul>
		</div>
		<div>
			<h3>tasks status</h3>
			<ul class="overflow">
				{#each data.tasks as task}
					<li>task {task.id}: {task.status}</li>
					{#if task.status == Status.finished}
						<li>coverage {task.result[0]} words: {task.result[1].toString()}, grid: later...</li>
					{/if}
					<br />
				{/each}
			</ul>
		</div>
		<div>
			<h3>actions</h3>
			<form method="POST" action="?/init" use:enhance>
				<button
					>{data.topic.partitions.length == 0
						? 'Initialize topic'
						: 'Adjust partition size'}</button
				>
			</form>
			<br />
			{#if data.topic.partitions.length > 0 && data.nodeCount === 0}
				<form method="POST" action="?/delete" use:enhance>
					<button>Delete topic</button>
				</form>
                <br />
			{/if}
			{#if data.nodeCount > 0}
				<form method="POST" action="?/send" use:enhance>
					<button>Start sending</button>
				</form>
			{/if}
		</div>
		<div>
			{#if data.tasks.some((task) => task.status === 'finished')}
				<h3>Best result</h3>
                <span>task {bestTask?.id}: coverage {bestTask?.result[0]} words: {bestTask?.result[1].toString()}, grid: later...</span>
			{/if}
		</div>
	</div>
</main>

<style lang="scss">
	main {
		margin: 2rem;
	}
	.container {
		max-height: calc(100vh - 100px - 4rem);
		display: flex;
		margin: 0;
		gap: 2rem;
	}
	.overflow {
		max-height: 100%;
		overflow: auto;
	}
</style>
