<script lang="ts">
	import '@picocss/pico';
	import type { PageData } from './$types';

	export let data: PageData;
	//код дублируется ужас
	const getBest = (tasks: any[]): Task => {
		if (tasks.length > 0) {
			return tasks.reduce((prevTask, currentTask) => {
				return prevTask.result[0] > currentTask.result[0] ? prevTask : currentTask;
			});
		}
		return data.tasks[0];
	};

	$: finTasks = data.tasks.filter((task) => {
		return task.status === 'finished';
	});

	const getFoundLetter = (i: number, j: number) => {
		if (getBest(finTasks).result.length > 0) {
			return getBest(finTasks).result[2][i][j] === '.' ? true : false;
		}
		return false;
	};

	const getFoundWord = (word: string) => {
		if (getBest(finTasks).result.length > 0) {
			return getBest(finTasks).result[1].includes(word) ? true : false;
		}
		return false;
	};
</script>

<div class="container">
	<div class="grid" style="--cols: {data.grid.length}; --rows: {data.grid[0].length};">
		{#each data.grid as row, i}
			{#each row as letter, j}
				<input
					bind:value={letter}
					maxlength="1"
					class={`letter ${getFoundLetter(i, j) ? 'found' : ''}`}
				/>
			{/each}
		{/each}
	</div>
	<div class="dictionary">
		{#each data.dictionary as word}
			<input bind:value={word} class={getFoundWord(word) ? 'found' : ''} />
		{/each}
	</div>
</div>

<style>
	.container {
		display: flex;
		margin: 0;
		gap: 2rem;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(var(--cols), 2rem);
		grid-template-rows: repeat(var(--rows), 2rem);
		grid-column-gap: 0.3rem;
		grid-row-gap: 0.3rem;
	}
	.dictionary {
		width: 500px;
	}
	input {
		height: 2rem;

		margin: 0.3rem;
	}
	.letter {
		padding: 0;
		align-items: center;
		width: 2rem;
		height: 2rem;
		text-align: center;
	}
	.found {
		background-color: green;
	}
</style>
