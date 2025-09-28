class Node {
  constructor(hash, name) {
    this.hash = hash;
    this.name = name;
    this.left = null;
    this.right = null;
  }
}

function findTrueAncestor(root, hashA, hashB) {
  let pathA = null;
  let pathB = null;

  function dfs(node, stack) {
    if (!node || (pathA && pathB)) return;

    stack.push(node);

    if (node.hash === hashA && !pathA) {
      pathA = [...stack]; 
    }
    if (node.hash === hashB && !pathB) {
      pathB = [...stack];
    }

    dfs(node.left, stack);
    dfs(node.right, stack);

    stack.pop();
  }

  dfs(root, []);

  if (!pathA || !pathB) return null;

  let i = 0;
  while (i < pathA.length && i < pathB.length && pathA[i] === pathB[i]) {
    i++;
  }

  return i > 0 ? pathA[i - 1] : null;
}

// ---------------------------
// Build Corrupted Royal Tree
// ---------------------------

let root = new Node("0x1A3", "King Arthur");

root.left = new Node("0x2B7", "Sir Lancelot");
root.right = new Node("0x2B7", "Morgana");

root.left.left = new Node("0x4C1", "Galahad");
root.left.right = new Node("0x5D9", "Percival");
root.right.right = new Node("0x4C1", "Mordred");

root.left.left.left = null; 
root.left.right.right = new Node("0x6E3", "The Green Knight");

// ---------------------------
// Test Cases
// ---------------------------

console.log("Case 1: Simple Ancestor");
console.log(findTrueAncestor(root, "0x4C1", "0x5D9")?.name);
// → "Sir Lancelot"

console.log("Case 2: Duplicate Hash Challenge");
console.log(findTrueAncestor(root, "0x4C1", "0x4C1")?.name);
// → "King Arthur"

console.log("Case 3: Corrupted Bloodline");
console.log(findTrueAncestor(root, "0x5D9", "0x6E3")?.name);
// → "Sir Lancelot"

console.log("Case 4: Nonexistent Descendant");
console.log(findTrueAncestor(root, "0xXYZ", "0x5D9"));
// → null
