import { findWordsWithoutCrossing } from "./finder";
import { Grid, grid } from "./consts/grid";
import { dictionary2 } from "./consts/dictionary";
import { factorial, getPermutationByRange } from "./perMut";
import { ITopicConfig, Kafka, Partitioners } from "kafkajs";

const kafka = new Kafka({
  clientId: "app",
  brokers: ["localhost:19092"],
});
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
const admin = kafka.admin();

const init = async () => {
  await admin.connect();
  console.log(await admin.listTopics())
  
  await admin.createTopics({
    waitForLeaders: false,
    topics: [{ topic: "task", numPartitions: 5 }],
  });
  console.log(await admin.listTopics())
}

init();
//will create proper types later...
// eslint-disable-next-line @typescript-eslint/no-explicit-any 
const exampleCode = async (...args: any) => {
  console.log("--------------------------------");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return args[0]+args[1]
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const program: {args: any[], code: string} = {
  args: [],
  code: exampleCode.toString(),
};
//создавать после генерации тасков
const send = async (program: {args: any[], code: string}) => {
  await producer.connect()
  producer.send({
    topic: "task",
    messages: [
      {
        value: JSON.stringify(program),
      },
    ],
  });
};

//run();



const sendTasks = async(maxNumber: number, intervalLength: number) => {

  let start = 0;
  let end = intervalLength - 1;
  
  while (end < maxNumber) {
      program.args[0] = start;
      program.args[1] = end;
      //генерить масив из программ
      // eslint-disable-next-line no-await-in-loop
      await send(program)
      start += intervalLength;
      end += intervalLength;
  }
  
  if (start < maxNumber) {
    program.args[0] = start;
    program.args[1] = maxNumber;
    await send(program)
  }
  
}

// Example usage:
const maxNumber = 45;
const intervalLength = 10;
sendTasks(maxNumber, intervalLength);

// old stuff refactor
/* const displayWordGrid = (grid: string[][]): void => {
  for (let i = 0; i < grid.length; i++) {
    console.log(grid[i]!.join(" "));
  }
};

const coverage = (strings: string[], grid: Grid): number =>
  (strings.reduce((sum, str) => sum + str.length, 0) /
    (grid.length * grid[0]!.length)) *
  100;

const rangedSearch = (
  dictionary: string[],
  grid: Grid,
  start: number,
  end: number
): [number, string[], Grid] => {
  const exampleTask = getPermutationByRange(dictionary, start, end);
  let maxCoverage = 0;
  let bestWords: string[] = [];
  let bestGrid: Grid = [];

  exampleTask?.forEach((permutation) => {
    let [foundGrid, foundWords] = findWordsWithoutCrossing(grid, permutation);
    const curCoverage = coverage(foundWords, grid);
    if (curCoverage > maxCoverage) {
      maxCoverage = curCoverage;
      bestWords = foundWords;
      bestGrid = foundGrid;
    }
  });
  return [maxCoverage, bestWords, bestGrid];
};
const prettyOut = (coverage: number, words: string[], grid: Grid) => {
  console.log(`found: ${words}`);
  console.log(`coverage: ${coverage}%`);
  displayWordGrid(grid);
};

console.log("-------example-task----------");
//console.log(`max mutations: ${factorial(dictionary2.length)}`)
const [resCoverage, resWords, resGrid] = rangedSearch(
  dictionary2,
  grid,
  100,
  500
);

prettyOut(resCoverage, resWords, resGrid);
/*
console.log('-------just-testing----------')
let array: number[] = [];
for (let i = 1; i <= 4; i++) {
  array.push(i);
}
console.log(array);
console.log(getPermutationByRange(array, 6, 10));
*/
