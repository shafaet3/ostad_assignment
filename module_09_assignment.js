// Task 1: 
function generateRandomArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 10000));
}

// Bubble Sort
function bubbleSort(arr) {
  let a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
  }
  return a;
}

// Selection Sort
function selectionSort(arr) {
  let a = [...arr];
  for (let i = 0; i < a.length; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[min]) {
        min = j;
      }
    }
    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
    }
  }
  return a;
}

// Insertion Sort
function insertionSort(arr) {
  let a = [...arr];
  for (let i = 1; i < a.length; i++) {
    let key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}

// Merge Sort
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

// Timing helper
function measureTime(fn, arr) {
  const start = performance.now();
  const sorted = fn(arr);
  const end = performance.now();
  return { time: ((end - start) / 1000).toFixed(3), sorted };
}

// Main execution
const array = generateRandomArray(1000);

const { time: bubbleTime, sorted: bubbleSorted } = measureTime(bubbleSort, array);
const { time: selectionTime, sorted: selectionSorted } = measureTime(selectionSort, array);
const { time: insertionTime, sorted: insertionSorted } = measureTime(insertionSort, array);
const { time: mergeTime, sorted: mergeSorted } = measureTime(mergeSort, array);

const jsSorted = [...array].sort((a, b) => a - b);

const allCorrect =
JSON.stringify(jsSorted) === JSON.stringify(bubbleSorted) &&
JSON.stringify(jsSorted) === JSON.stringify(selectionSorted) &&
JSON.stringify(jsSorted) === JSON.stringify(insertionSorted) &&
JSON.stringify(jsSorted) === JSON.stringify(mergeSorted);

console.log(Bubble Sort Time: bubbleTime sec);
console.log(Selection Sort Time:{selectionTime} sec);
console.log(Insertion Sort Time: insertionTime sec);
console.log(Merge Sort Time:{mergeTime} sec);
console.log(All sorts correct? ${allCorrect});


// Task 2: 
function sort_strings(strings) {
  // Custom bubble sort
  for (let i = 0; i < strings.length - 1; i++) {
    for (let j = 0; j < strings.length - i - 1; j++) {
      const a = strings[j];
      const b = strings[j + 1];

      // Primary: length
      if (a.length > b.length ||
         (a.length === b.length && a > b)) {
        // Swap
        [strings[j], strings[j + 1]] = [strings[j + 1], strings[j]];
      }
    }
  }
  return strings;
}

// Example
const input = ["apple", "tea", "pie", "banana", "kiwi"];
const output = sort_strings(input);
console.log(output); // ["pie", "tea", "kiwi", "apple", "banana"]
