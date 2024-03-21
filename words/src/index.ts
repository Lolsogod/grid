import { findWordsWithoutCrossing } from "./finder";
import { Grid, grid } from "./consts/grid";
import { dictionary2 } from "./consts/dictionary";
import { factorial, getPermutationByRange } from "./perMut";
import {
  ConfigResourceTypes,
  ITopicConfig,
  Kafka,
  Partitioners,
} from "kafkajs";

type ProcessedTask = {
  code: string;
  args: any[];
};
type Task = {
  code: Function;
  args: any[];
};
//task generation
const generateTaskString = (task: Task): string => {
  const processed: ProcessedTask = {
    code: task.code.toString(),
    args: task.args, // а если в аргументах будут не строки? ..подумать
  };
  return JSON.stringify(processed);
};

const getTaskStrings = (tasks: Task[]): string[] => {
  const result: string[] = [];
  tasks.forEach((task) => {
    result.push(generateTaskString(task));
  });
  return result;
};

// simple task example
const simpleTaskCode = (...args: any) => {
  console.log("--------------------------------");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return args[0] + args[1];
};

const generateSimpleTasks = (
  max: number,
  interval: number,
  code: Function
): Task[] => {
  const tasks: Task[] = [];

  let start = 0;
  let end = interval - 1;

  while (end < max) {
    const task = {
      code: code,
      args: [start, end],
    };
    tasks.push(task);
    start += interval;
    end += interval;
  }

  if (start < max) {
    const task = {
      code: code,
      args: [start, max - 1],
    };
    tasks.push(task);
  }

  return tasks;
};

const test = generateSimpleTasks(210, 10, simpleTaskCode);
const testStrings = getTaskStrings(test);

//инициализация кафки
const kafka = new Kafka({
  clientId: "app",
  brokers: ["localhost:19092"],
});

const admin = kafka.admin();
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

const deleteTopic = async () => {
  await admin.connect();
  const topics = await admin.listTopics();
  console.log(topics)
  await admin.deleteTopics({ topics: ["task"] });
  await admin.disconnect();
}

const expandTopic = async (taskStrings: string[]) => {
  const topic = await admin.fetchTopicMetadata({ topics: ["task"] });
  console.log('start expansion current: ', topic.topics[0]!.partitions.length, ' required: ', taskStrings.length);
  if (topic.topics[0]!.partitions.length < taskStrings.length) {
    console.log("expanding topic to " + taskStrings.length);
    await admin.createPartitions({
      topicPartitions: [{ topic: "task", count: taskStrings.length }],
    });
  }
};

const init = async (taskStrings: string[]) => {
  await admin.connect();

  const topics = await admin.listTopics();
  if (topics.includes("task")) {
    expandTopic(taskStrings);
  } else {
    await admin.createTopics({
      waitForLeaders: false,
      topics: [{ topic: "task", numPartitions: taskStrings.length }],
    });
  }
};

//отправка тасков
const send = async (taskStrings: string[]) => {
  console.log("sending!");
  await producer.connect();
  producer.send({
    topic: "task",
    messages: taskStrings.map((task) => ({ value: task })),
  });
};


init(testStrings).then(() => send(testStrings));

//deleteTopic()

//endTasks(maxNumber, intervalLength);

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
