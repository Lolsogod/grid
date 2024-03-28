// add some dictionary trimmer maybe?
// word limits when 5 milion mutations in one subtask
export const dictionary: string[] = [
    'random',
    'secret',
    'column',
    'write',
    'token',
    'row',
    'vertical',
    'cats',
    'token',
    'and',
    //4 nodes will solve it in 4 minutes - good for demo
    //'world',
    
    // 4 nodes will solve it in 3 hours
    //'horizontal',

    // okay so here page works kind of fine, still to much for partitoner //TODO: rewrite partitioner
    // 4 nodes will solve it in 10 hours
    //'cross', // about 1.2k subtasks 

    //at this point app actualy loads but, curent partitioning method not suited for that many tasks
    // also page will be realy slow and this amout of tasks will take 4 nodes about 6 days to solve
    //'help', //about 17k subtasks 

    // app will not crash but 250 k tasks will be to much to render on ui
    //'limit?', // about 250k subtasks 

    // there app will crush but not always
    //'limit.', - about 5 million subtask 

    // this is the limit - more words will cause guaranteed crash
];