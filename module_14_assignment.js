// 1. Minimum Cut Analysis using Karger's Algorithm (Medium-Hard)
function kargerMinCut(originalGraph, iterations = 100) {
  let minCut = Infinity;

  for (let i = 0; i < iterations; i++) {
    const graph = JSON.parse(JSON.stringify(originalGraph));
    const cut = runKarger(graph);
    minCut = Math.min(minCut, cut);
  }

  return minCut;
}

function runKarger(graph) {
  // While more than 2 vertices remain
  while (Object.keys(graph).length > 2) {
    const { u, v } = getRandomEdge(graph);
    contractEdge(graph, u, v);
  }

  // Remaining vertices will have identical edge count
  const remainingVertices = Object.keys(graph);
  return graph[remainingVertices[0]].length;
}

// Pick a random edge (u, v)
function getRandomEdge(graph) {
  const vertices = Object.keys(graph);
  const u = vertices[Math.floor(Math.random() * vertices.length)];
  const neighbors = graph[u];
  const v = neighbors[Math.floor(Math.random() * neighbors.length)];
  return { u, v };
}

// Contract vertex v into u
function contractEdge(graph, u, v) {
  // Merge v's adjacency list into u's
  graph[u] = graph[u].concat(graph[v]);

  // Replace all references of v with u in the graph
  for (const vertex of graph[v]) {
    graph[vertex] = graph[vertex].map(x => (x === v ? u : x));
  }

  // Remove self-loops
  graph[u] = graph[u].filter(x => x !== u);

  // Delete vertex v
  delete graph[v];
}

// Example usage:
const graph = {
  A: ['B', 'C', 'D'],
  B: ['A', 'C', 'D'],
  C: ['A', 'B', 'D'],
  D: ['A', 'B', 'C']
};

console.log("Estimated Minimum Cut:", kargerMinCut(graph, 100));


// 2. Strongly Connected Components using Tarjan's Algorithm (Hard)
function tarjan_scc(graph) {
  const indices = {};
  const lowlinks = {};
  const stack = [];
  const onStack = {};
  const sccs = [];
  let index = 0;

  // Depth-First Search (DFS) function
  function strongConnect(node) {
    indices[node] = index;
    lowlinks[node] = index;
    index++;
    stack.push(node);
    onStack[node] = true;

    // Explore all neighbors
    for (const neighbor of graph[node]) {
      if (indices[neighbor] === undefined) {
        // If neighbor not visited, recurse
        strongConnect(neighbor);
        lowlinks[node] = Math.min(lowlinks[node], lowlinks[neighbor]);
      } else if (onStack[neighbor]) {
        // Update lowlink if neighbor is in stack
        lowlinks[node] = Math.min(lowlinks[node], indices[neighbor]);
      }
    }

    // If node is a root of SCC
    if (lowlinks[node] === indices[node]) {
      const scc = [];
      let w;
      do {
        w = stack.pop();
        onStack[w] = false;
        scc.push(w);
      } while (w !== node);
      sccs.push(scc);
    }
  }

  // Apply Tarjan’s algorithm to each node
  for (const node in graph) {
    if (indices[node] === undefined) {
      strongConnect(node);
    }
  }

  return sccs;
}

// Example directed graph
const graph1 = {
  A: ['B'],
  B: ['C', 'E'],
  C: ['A', 'D'],
  D: [],
  E: ['F'],
  F: ['B']
};

console.log("Strongly Connected Components:", tarjan_scc(graph1));

// 3. Network Isomorphism Check (Medium)
function are_isomorphic(graph1, graph2) {
  const nodes1 = Object.keys(graph1);
  const nodes2 = Object.keys(graph2);

  // Must have same number of vertices
  if (nodes1.length !== nodes2.length) return false;

  // Must have same number of edges
  const edgeCount = g => Object.values(g).reduce((sum, nbrs) => sum + nbrs.length, 0);
  if (edgeCount(graph1) !== edgeCount(graph2)) return false;

  // Compare degree sequences (sorted)
  const degreeSeq1 = nodes1.map(n => graph1[n].length).sort((a, b) => a - b);
  const degreeSeq2 = nodes2.map(n => graph2[n].length).sort((a, b) => a - b);
  for (let i = 0; i < degreeSeq1.length; i++) {
    if (degreeSeq1[i] !== degreeSeq2[i]) return false;
  }

  return true;
}

// Example graphs
const g1 = {
  A: ['B', 'C'],
  B: ['A', 'C'],
  C: ['A', 'B']
};

const g2 = {
  X: ['Y', 'Z'],
  Y: ['X', 'Z'],
  Z: ['X', 'Y']
};

console.log("Graphs are isomorphic:", are_isomorphic(g1, g2));

