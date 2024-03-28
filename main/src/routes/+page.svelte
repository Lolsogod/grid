<script lang="ts">
	import '@picocss/pico';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import { Status } from '$lib/enums';

	export let data: PageData;

	const getBest = (tasks: any[]): Task => {
		return tasks.reduce((prevTask, currentTask) => {
			return prevTask.result[0] > currentTask.result[0] ? prevTask : currentTask;
		});
	};

	$: finTasks = data.tasks.filter((task) => {
		return task.status === 'finished';
	});
	/* позже разобраться
	$: best = finTasks.reduce((prevTask, currentTask) => {
			return prevTask.result[0] > currentTask.result[0] ? prevTask : currentTask;
	});*/

	onMount(() => {
		const interval = setInterval(() => {
			invalidateAll();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="container">
	<div>
		<h3>cluster status</h3>
		<ul>
			<li>topic name: </li>
			<li>partition size: </li>
			<li>free nodes: </li>
		</ul>
	</div>
	<div>
		<h3>tasks status - {finTasks.length}/{data.tasks.length}</h3>
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
		<form method="POST" action="?/send" use:enhance>
			<button>Start sending</button>
		</form>
		<br />

		<form method="POST" action="?/reset" use:enhance>
			<button>Reset</button>
		</form>
	</div>
	<div>
		{#if finTasks.length}
			<h3>Best result</h3>
			<span
				>task {getBest(finTasks)?.id}: coverage {getBest(finTasks)?.result[0]} words: {getBest(
					finTasks
				)?.result[1].toString()}, grid: later...</span
			>
		{/if}
	</div>
</div>

<style lang="scss">
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
