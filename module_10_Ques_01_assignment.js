function findTreasure(rotatedArray, treasure) {
    let left = 0;
    let right = rotatedArray.length - 1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);

        if (rotatedArray[mid] === treasure) return mid;

        // Check if left side is sorted
        if (rotatedArray[left] <= rotatedArray[mid]) {
            // Check if target lies within this range
            if (rotatedArray[left] <= treasure && treasure < rotatedArray[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        // Right side is sorted
        else {
            if (rotatedArray[mid] < treasure && treasure <= rotatedArray[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }

    return -1; // Treasure not found
}
console.log(findTreasure([4, 5, 6, 7, 0, 1, 2], 0)); // Output: 4
console.log(findTreasure([1, 3, 5], 5)); // Output: 2
console.log(findTreasure([5, 1, 3], 5)); // Output: 0
console.log(findTreasure([7, 8, 1, 2, 3, 4, 5, 6], 2)); // Output: 3
