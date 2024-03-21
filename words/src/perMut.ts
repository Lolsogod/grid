export const factorial = (n: number): number => {
    if (n === 0 || n === 1) {return 1;}
    return n * factorial(n - 1);
};

export const getPermutationByIndex = <T>(elements: T[], index: number): T[] | null => {
    const n = elements.length;
    const numPermutations = factorial(n);
    if (index < 0 || index >= numPermutations) {return null;} 

    const result: T[] = [];
    let available = [...elements];

    let remainingIndex = index;
    for (let i = 1; i <= n; i++) {
        const currentFactorial = factorial(n - i);
        const selectedElementIndex = Math.floor(remainingIndex / currentFactorial);
        result.push(available[selectedElementIndex]!);
        available = available.filter((_, index) => index !== selectedElementIndex);
        remainingIndex %= currentFactorial;
    }

    return result;
};

export const getPermutationByRange = <T>(elements: T[], start: number, end: number): T[][] | null => {
    const permutations = [];
    for(let i = start; i <= end; i++) {
        const permutation = getPermutationByIndex(elements, i);
        if (permutation) {permutations.push(permutation)}
    }
    return permutations;
}