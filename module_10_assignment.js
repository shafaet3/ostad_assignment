// QUESTION NO: 01
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


// QUESTION NO: 02
function burgerFloor(rotatedMenu, budget) {
    let left = 0;
    let right = rotatedMenu.length - 1;
    let floor = -1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        let val = rotatedMenu[mid];

        if (val === budget) return val;

        // Check if left part is sorted
        if (rotatedMenu[left] <= val) {
            if (rotatedMenu[left] <= budget && budget > val) {
                floor = Math.max(floor, val);
                left = mid + 1;
            } else if (val <= budget) {
                floor = Math.max(floor, val);
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        // Right part is sorted
        else {
            if (val <= budget) {
                floor = Math.max(floor, val);
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }

    return floor;
}

console.log(burgerFloor([5, 6, 7, 1, 2, 3, 4], 4));  // Output: 4
console.log(burgerFloor([5, 6, 7, 1, 2, 3, 4], 7));  // Output: 7
console.log(burgerFloor([5, 6, 7, 1, 2, 3, 4], 10)); // Output: 7
console.log(burgerFloor([5, 6, 7, 1, 2, 3, 4], 0));  // Output: -1
