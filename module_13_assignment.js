class SocialNetwork {
  constructor(adjacency = {}) {
    this.adj = new Map();
    for (const [node, neighbors] of Object.entries(adjacency)) {
      this.adj.set(node, new Set(neighbors));
    }
  }

  find_friends_at_distance(start, distance) {
    // BFS to collect nodes at exact distance
    if (!this.adj.has(start) || distance < 1) return new Set();
    const visited = new Set([start]);
    let queue = [start];
    let currentDepth = 0;

    while (queue.length && currentDepth < distance) {
      const next = [];
      for (const node of queue) {
        const neighbors = this.adj.get(node) || new Set();
        for (const nb of neighbors) {
          if (!visited.has(nb)) {
            visited.add(nb);
            next.push(nb);
          }
        }
      }
      queue = next;
      currentDepth++;
      if (queue.length === 0) break;
    }

    // queue contains nodes at depth==distance
    return new Set(queue);
  }

  are_connected(person_a, person_b, max_depth = 6) {
    // BFS up to max_depth to check connection
    if (person_a === person_b) return true;
    if (!this.adj.has(person_a) || !this.adj.has(person_b)) return false;

    const visited = new Set([person_a]);
    let queue = [person_a];
    let depth = 0;

    while (queue.length && depth < max_depth) {
      const next = [];
      for (const node of queue) {
        const neighbors = this.adj.get(node) || new Set();
        for (const nb of neighbors) {
          if (nb === person_b) return true;
          if (!visited.has(nb)) {
            visited.add(nb);
            next.push(nb);
          }
        }
      }
      queue = next;
      depth++;
    }
    return false;
  }
}

// -------- WebCrawler (DFS crawl + BFS shortest path) --------
class WebCrawler {
  constructor(pages = {}) {
    this.graph = new Map();
    for (const [url, links] of Object.entries(pages)) {
      this.graph.set(url, new Set(links));
    }
  }

  // DFS crawl collecting visited pages up to max_depth
  crawl(start_url, max_depth = 2) {
    if (!this.graph.has(start_url)) return new Set(); // start not in domain
    const visited = new Set();
    const path = []; 

    const dfs = (url, depth) => {
      if (depth > max_depth) return;
      if (visited.has(url)) return;
      visited.add(url);
      path.push({ url, depth });
      const neighbors = this.graph.get(url) || new Set();
      for (const nb of neighbors) {
        dfs(nb, depth + 1);
      }
    };

    dfs(start_url, 0);
    return visited; // Set of crawled pages
  }

  // Find shortest click path from page_a to page_b (BFS)
  find_route(page_a, page_b) {
    if (page_a === page_b) return [page_a];
    if (!this.graph.has(page_a) || !this.graph.has(page_b)) return null;
    const visited = new Set([page_a]);
    const queue = [page_a];
    const parent = new Map(); // for path reconstruction

    while (queue.length) {
      const node = queue.shift();
      const neighbors = this.graph.get(node) || new Set();
      for (const nb of neighbors) {
        if (!visited.has(nb)) {
          visited.add(nb);
          parent.set(nb, node);
          if (nb === page_b) {
            // build path
            const path = [];
            let cur = page_b;
            while (cur !== undefined) {
              path.push(cur);
              cur = parent.get(cur);
            }
            return path.reverse();
          }
          queue.push(nb);
        }
      }
    }
    return null; // no route
  }
}

// -------- GraphFlow (Edmonds-Karp) --------
class GraphFlow {
  // capacities: object of { from: { to: capacity, ... }, ... }
  // if undirected required, user should add both directions manually
  constructor(capacities = {}) {
    // build node list
    this.nodes = new Set();
    this.capacity = {}; // adjacency map capacity[u][v] = number
    for (const u of Object.keys(capacities)) {
      this.nodes.add(u);
      this.capacity[u] = Object.assign({}, capacities[u]);
      for (const v of Object.keys(capacities[u])) {
        this.nodes.add(v);
      }
    }
    // ensure zero entries exist for missing adjacency
    for (const u of this.nodes) {
      if (!this.capacity[u]) this.capacity[u] = {};
      for (const v of this.nodes) {
        if (this.capacity[u][v] === undefined) {
          // leave undefined to save space; interpret as 0 when used
        }
      }
    }
  }

  _cap(u, v) {
    const cu = this.capacity[u];
    if (!cu) return 0;
    return cu[v] || 0;
  }

  // Return {maxFlow, augmentations: [{path, flow, residualSnapshot}, ...]}
  max_flow(source, sink) {
    // Build residual capacity structure as adjacency map
    const nodes = Array.from(this.nodes);
    const residual = {};
    for (const u of nodes) {
      residual[u] = {};
      for (const v of nodes) {
        residual[u][v] = this._cap(u, v);
      }
    }
    // Ensure reverse edges exist with 0 capacity if not present
    for (const u of nodes) {
      for (const v of nodes) {
        if (residual[u][v] === undefined) residual[u][v] = 0;
        if (residual[v][u] === undefined) residual[v][u] = residual[v][u] || 0;
      }
    }

    const augmentations = [];
    let maxFlow = 0;

    while (true) {
      // BFS to find shortest augmenting path in residual graph
      const parent = {};
      const visited = new Set([source]);
      const queue = [source];
      let found = false;
      while (queue.length) {
        const u = queue.shift();
        for (const v of nodes) {
          if (!visited.has(v) && residual[u][v] > 0) {
            parent[v] = u;
            visited.add(v);
            queue.push(v);
            if (v === sink) {
              found = true;
              break;
            }
          }
        }
        if (found) break;
      }
      if (!found) break; // no more augmenting paths

      // find bottleneck
      let path = [];
      let v = sink;
      let bottleneck = Infinity;
      while (v !== source) {
        const u = parent[v];
        path.push(v);
        bottleneck = Math.min(bottleneck, residual[u][v]);
        v = u;
      }
      path.push(source);
      path = path.reverse();

      // augment
      v = sink;
      while (v !== source) {
        const u = parent[v];
        residual[u][v] -= bottleneck;
        residual[v][u] = (residual[v][u] || 0) + bottleneck; // reverse edge increases
        v = u;
      }

      maxFlow += bottleneck;

      // snapshot of residual for visualization (shallow copy)
      const residualSnapshot = {};
      for (const a of nodes) {
        residualSnapshot[a] = {};
        for (const b of nodes) {
          if (residual[a][b] !== undefined && residual[a][b] !== 0) {
            residualSnapshot[a][b] = residual[a][b];
          }
        }
      }

      augmentations.push({
        path,
        flow: bottleneck,
        residual: residualSnapshot,
      });
    }

    return { maxFlow, augmentations, residual };
  }

  // utility to pretty print residual snapshot
  static visualizeResidual(snapshot) {
    // snapshot: object[u][v] = cap (sparse); convert to edges list
    const edges = [];
    for (const u of Object.keys(snapshot)) {
      for (const v of Object.keys(snapshot[u])) {
        edges.push(`${u}->${v}=${snapshot[u][v]}`);
      }
    }
    return edges.join(", ") || "(no edges)";
  }
}

// ----------------- Tests & Examples -----------------

function runSocialNetworkTests() {
  console.log("\n=== SocialNetwork Tests ===");
  const adj = {
    A: ["B", "C"],
    B: ["A", "D", "E"],
    C: ["A", "F"],
    D: ["B"],
    E: ["B"],
    F: ["C"],
    // isolated node
    X: []
  };
  const sn = new SocialNetwork(adj);

  console.log("Friends at distance 1 from A:", Array.from(sn.find_friends_at_distance("A", 1)));
  console.log("Friends at distance 2 from A:", Array.from(sn.find_friends_at_distance("A", 2)));
  console.log("Friends at distance 3 from A:", Array.from(sn.find_friends_at_distance("A", 3)));

  console.log("Are A and E connected (max_depth 2)?", sn.are_connected("A", "E", 2)); // true
  console.log("Are A and F connected (max_depth 1)?", sn.are_connected("A", "F", 1)); // true
  console.log("Are A and X connected?", sn.are_connected("A", "X")); // false (X isolated)
  console.log("Edge case: start missing:", Array.from(sn.find_friends_at_distance("Z", 1))); // empty
}

function runWebCrawlerTests() {
  console.log("\n=== WebCrawler Tests ===");
  const pages = {
    "home": ["about", "products", "blog"],
    "about": ["team", "home"],
    "products": ["item1", "item2"],
    "item1": ["checkout"],
    "item2": ["checkout"],
    "checkout": [],
    "blog": ["post1", "post2"],
    "post1": ["blog"],
    "isolated": []
  };
  const wc = new WebCrawler(pages);

  console.log("Crawl from 'home' depth 1:", Array.from(wc.crawl("home", 1)));
  console.log("Crawl from 'home' depth 2:", Array.from(wc.crawl("home", 2)));
  console.log("Find route home -> checkout:", wc.find_route("home", "checkout")); // shortest path
  console.log("Find route blog -> post2:", wc.find_route("blog", "post2")); // direct or via link
  console.log("Find route home -> isolated:", wc.find_route("home", "isolated")); // null
  console.log("Edge cases: crawl start missing:", Array.from(wc.crawl("nope", 2)));
}

function runGraphFlowTests() {
  console.log("\n=== GraphFlow (Edmonds-Karp) Tests ===");

  // Example from CLRS commonly used (directed):
  // Graph:
  // s->v (16), s->w (13)
  // w->v (4)
  // v->t (12)
  // w->x (14)
  // x->v (9)
  // x->t (20)
  const capacities = {
    s: { v: 16, w: 13 },
    v: { t: 12 },
    w: { v: 4, x: 14 },
    x: { v: 9, t: 20 },
    t: {}
  };
  const gf = new GraphFlow(capacities);
  const result = gf.max_flow("s", "t");
  console.log("Max flow (CLRS example) computed:", result.maxFlow);
  console.log("Augmentations:");
  result.augmentations.forEach((aug, i) => {
    console.log(`  #${i+1}: path=${aug.path.join("->")} flow=${aug.flow}`);
    console.log(`     residual: ${GraphFlow.visualizeResidual(aug.residual)}`);
  });

  // Known correct max flow for this network is 23
  console.log("Expected known max flow: 23");

  // Edge cases:
  console.log("\nEdge case: empty graph");
  const gfEmpty = new GraphFlow({});
  const resEmpty = gfEmpty.max_flow("s", "t");
  console.log(" empty graph maxFlow:", resEmpty.maxFlow);

  console.log("\nSingle node graph (source==sink):");
  const gfSingle = new GraphFlow({ s: {} });
  const resSingle = gfSingle.max_flow("s", "s");
  console.log(" single node maxFlow (s->s):", resSingle.maxFlow);

  console.log("\nDisconnected graph:");
  const gfDisc = new GraphFlow({ s: { a: 10 }, a: {}, t: {} });
  const resDisc = gfDisc.max_flow("s", "t");
  console.log(" disconnected graph maxFlow (no path):", resDisc.maxFlow);

  // Undirected graph test (simulate by adding both directions)
  console.log("\nUndirected example (simulate by symmetric capacities):");
  const undirected = {
    A: { B: 3, C: 2 },
    B: { A: 3, C: 1, D: 2 },
    C: { A: 2, B: 1, D: 2 },
    D: { B: 2, C: 2 }
  };
  const gUnd = new GraphFlow(undirected);
  const resUnd = gUnd.max_flow("A", "D");
  console.log(" undirected (symmetric) A->D maxFlow:", resUnd.maxFlow);
}

// Run all tests
function runAll() {
  runSocialNetworkTests();
  runWebCrawlerTests();
  runGraphFlowTests();
}

runAll();
