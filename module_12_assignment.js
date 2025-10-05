// Problem 01:
class MinHeap {
  constructor() {
    this.heap = [];
  }

  insert(val) {
    this.heap.push(val);
    this._bubbleUp();
  }

  _bubbleUp() {
    let idx = this.heap.length - 1;
    while (idx > 0) {
      let parent = Math.floor((idx - 1) / 2);
      if (this.heap[idx] >= this.heap[parent]) break;
      [this.heap[idx], this.heap[parent]] = [this.heap[parent], this.heap[idx]];
      idx = parent;
    }
  }

  remove() {
    if (this.heap.length === 1) return this.heap.pop();
    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._sinkDown(0);
    return min;
  }

  _sinkDown(i) {
    const n = this.heap.length;
    while (true) {
      let left = 2 * i + 1;
      let right = 2 * i + 2;
      let smallest = i;

      if (left < n && this.heap[left] < this.heap[smallest]) smallest = left;
      if (right < n && this.heap[right] < this.heap[smallest]) smallest = right;

      if (smallest === i) break;

      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }

  top() {
    return this.heap[0];
  }

  size() {
      return this.heap.length;
    }
  }
  
  function find_kth_largest(nums, k) {
    if (!Array.isArray(nums) || nums.length === 0) return null;
    if (k > nums.length || k <= 0) return null;
  
    const heap = new MinHeap();
  
    for (let num of nums) {
      heap.insert(num);
      if (heap.size() > k) heap.remove();
    }
  
    return heap.top();
  }

  console.log(find_kth_largest([3, 2, 1, 5, 6, 4], 2)); //  5
  console.log(find_kth_largest([1], 1));               //  1
  console.log(find_kth_largest([], 1));                //  null (empty array)
  console.log(find_kth_largest([5, 3], 3));            //  null (k > length)
  console.log(find_kth_largest([9, 8, 7], 0));          //  null (invalid k)

// Problem 02:
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function range_sum_bst(root, low, high) {
  if (!root) return 0;

  let sum = 0;

  if (root.val > low) {
    sum += range_sum_bst(root.left, low, high); // Check left subtree
  }

  if (root.val < high) {
    sum += range_sum_bst(root.right, low, high); // Check right subtree
  }

  if (root.val >= low && root.val <= high) {
    sum += root.val; // Add current node if in range
  }

  return sum;
}

// BST:       10
//          /    \
//         5     15
//        / \      \
//       3   7     18

const root = new TreeNode(
  10,
  new TreeNode(5, new TreeNode(3), new TreeNode(7)),
  new TreeNode(15, null, new TreeNode(18))
);

const low = 7;
const high = 15;

console.log(range_sum_bst(root, low, high)); //  Output: 32

// Problem 03:
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class AutoComplete {
  constructor() {
    this.root = new TrieNode();
  }

  add_word(word) {
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  get_suggestions(prefix) {
    let node = this.root;
    for (let char of prefix) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }

    const result = [];

    const dfs = (curr, path) => {
      if (result.length === 3) return;
      if (curr.isEndOfWord) result.push(prefix + path);
      for (let key of Object.keys(curr.children).sort()) {
        dfs(curr.children[key], path + key);
      }
    };

    dfs(node, "");
    return result;
  }
}
const system = new AutoComplete();
system.add_word("apple");
system.add_word("application");
system.add_word("appetizer");
system.add_word("banana");
console.log(system.get_suggestions("app"));
// Output: ["appetizer", "apple", "application"]
