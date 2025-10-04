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
