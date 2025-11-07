// 1. 
function generateSlotsFromInterval(interval, duration) {
  // interval: [startHour, endHour] where endHour is exclusive (e.g., (9,10) -> can start at 9 for duration 60)
  const [s, e] = interval;
  const res = [];
  const startMin = s * 60;
  const endMin = e * 60;
  for (let t = startMin; t + duration <= endMin; t += 15) { // step 15 min to reduce space (change to 1 if needed)
    res.push([t, t + duration]);
  }
  return res;
}

function buildPossibleInterviews(candidates, interviewers, duration) {
  // candidates/interviewers maps: name -> array of [startHour,endHour]
  const items = []; // each item: {cand, intr, start, end}
  for (const cand of Object.keys(candidates)) {
    for (const cInterval of candidates[cand]) {
      const candSlots = generateSlotsFromInterval(cInterval, duration);
      for (const intr of Object.keys(interviewers)) {
        for (const iInterval of interviewers[intr]) {
          const intrSlots = generateSlotsFromInterval(iInterval, duration);
          // intersection of candSlots and intrSlots:
          const candSet = new Set(candSlots.map(s => s[0] + ':' + s[1]));
          for (const s of intrSlots) {
            const key = s[0] + ':' + s[1];
            if (candSet.has(key)) {
              items.push({ cand, intr, start: s[0], end: s[1] });
            }
          }
        }
      }
    }
  }
  // sort by start time (helps pruning / deterministic)
  items.sort((a, b) => a.start - b.start || a.end - b.end || a.cand.localeCompare(b.cand));
  return items;
}

function intervalsOverlap(aStart, aEnd, bStart, bEnd) {
  return !(aEnd <= bStart || bEnd <= aStart);
}

function findAllMaxSchedules(candidates, interviewers, duration, max_per_person) {
  const items = buildPossibleInterviews(candidates, interviewers, duration);
  const N = items.length;
  let bestCount = 0;
  const bestSchedules = [];

  // Precompute for optimistic upper bound: remaining items count from index i
  const remainingUpper = new Array(N + 1).fill(0);
  for (let i = N - 1; i >= 0; --i) remainingUpper[i] = remainingUpper[i + 1] + 1;

  function canAssign(item, counts, times) {
    if ((counts[item.cand] || 0) >= max_per_person) return false;
    if ((counts[item.intr] || 0) >= max_per_person) return false;
    // time conflicts
    const candTimes = times[item.cand] || [];
    for (const t of candTimes) if (intervalsOverlap(t.start, t.end, item.start, item.end)) return false;
    const intrTimes = times[item.intr] || [];
    for (const t of intrTimes) if (intervalsOverlap(t.start, t.end, item.start, item.end)) return false;
    return true;
  }

  function place(item, counts, times) {
    counts[item.cand] = (counts[item.cand] || 0) + 1;
    counts[item.intr] = (counts[item.intr] || 0) + 1;
    times[item.cand] = (times[item.cand] || []).concat([{ start: item.start, end: item.end }]);
    times[item.intr] = (times[item.intr] || []).concat([{ start: item.start, end: item.end }]);
  }

  function unplace(item, counts, times) {
    counts[item.cand] -= 1;
    counts[item.intr] -= 1;
    times[item.cand].pop();
    times[item.intr].pop();
  }

  // main DFS
  function dfs(idx, assigned, counts, times) {
    // pruning: optimistic bound
    const optimisticMax = assigned.length + remainingUpper[idx];
    if (optimisticMax < bestCount) return;

    if (idx === N) {
      if (assigned.length > bestCount) {
        bestCount = assigned.length;
        bestSchedules.length = 0;
        bestSchedules.push(assigned.slice());
      } else if (assigned.length === bestCount) {
        bestSchedules.push(assigned.slice());
      }
      return;
    }

    const item = items[idx];

    // Option 1: try include if possible
    if (canAssign(item, counts, times)) {
      place(item, counts, times);
      assigned.push(item);
      dfs(idx + 1, assigned, counts, times);
      assigned.pop();
      unplace(item, counts, times);
    }

    // Option 2: skip this item
    if (assigned.length + remainingUpper[idx + 1] >= bestCount) {
      dfs(idx + 1, assigned, counts, times);
    }
  }

  dfs(0, [], {}, {});

  // convert minute-based schedule back to hour tuple string if desired
  const printable = bestSchedules.map(schedule =>
    schedule.map(s => [s.cand, s.intr, [s.start / 60, s.end / 60]])
  );
  return { maxInterviews: bestCount, schedules: printable, rawSchedules: bestSchedules };
}

// Example 
const candidates = {
  "Alice": [[9, 10], [14, 16], [17, 18]],
  "Bob": [[10, 12], [15, 17]],
  "Charlie": [[9, 11], [13, 15]]
};

const interviewers = {
  "John": [[9, 12], [14, 18]],
  "Sarah": [[10, 13], [15, 17]],
  "Mike": [[11, 14], [16, 18]]
};

const duration = 60;
const max_per_person = 2;

const result = findAllMaxSchedules(candidates, interviewers, duration, max_per_person);
console.log("Max interviews:", result.maxInterviews);
console.log("Schedules (converted to hours):", JSON.stringify(result.schedules, null, 2));


// 2.

// Sudoku solver (classic, diagonal, killer)
// Board uses 0 for empty cells. Rows/cols indexed 0..8

function deepCloneBoard(board) {
  return board.map(row => row.slice());
}

function solve_sudoku(board, variation = "classic", constraints = null) {
  // board: 9x9 array (0 for empty)
  // variation: "classic" | "diagonal" | "killer"
  // constraints: for killer, { cages: [ { cells: [[r,c],...], sum: S }, ... ] } or a map-like
  const solutions = [];
  const N = 9;
  const allNums = new Set([1,2,3,4,5,6,7,8,9]);

  // helper to build cages
  const cages = [];
  if (variation === "killer" && constraints && constraints.cages) {
    for (const [cellsTuple, sum] of Object.entries(constraints.cages || {})) {
      // input might be either object with keys as stringified tuples, or array — allow user to pass either format
      // We'll attempt to support both: if key parseable as JSON array-of-pairs, use that; else assume constraints.cages is array
    }
    // If constraints.cages was a plain object where keys are stringified cell lists, normalize:
    if (Array.isArray(constraints.cages)) {
      for (const c of constraints.cages) cages.push({ cells: c.cells, sum: c.sum });
    } else {
      // assume object with keys like "((0,0),(0,1))": parse by expecting JSON-like input maybe not exact.
      for (const k of Object.keys(constraints.cages)) {
        const sum = constraints.cages[k];
        // try to parse a JSON-ish list of pairs by replacing parentheses with brackets
        let parsed = null;
        try {
          const fixed = k.replace(/\(/g,'[').replace(/\)/g,']');
          parsed = JSON.parse(fixed);
        } catch (e) {
          // fallback: if user supplied a real-array-key style, skip (user can supply constraints.cages as array of objects)
          parsed = null;
        }
        if (parsed) cages.push({ cells: parsed, sum });
      }
    }
  }

  // Precompute rows, cols, boxes sets of numbers already present
  const rows = Array.from({ length: N }, () => new Set());
  const cols = Array.from({ length: N }, () => new Set());
  const boxes = Array.from({ length: N }, () => new Set());
  const diag1 = new Set();
  const diag2 = new Set();

  // Map cell->cage index (if killer)
  const cellToCage = {};
  for (let i=0;i<cages.length;i++){
    const cage = cages[i];
    cage.assignedSum = 0;
    cage.assignedCount = 0;
    for (const [r,c] of cage.cells) {
      cellToCage[`${r},${c}`] = i;
    }
  }

  // initialize sets from board
  for (let r = 0; r < N; ++r) {
    for (let c = 0; c < N; ++c) {
      const v = board[r][c];
      if (v !== 0) {
        rows[r].add(v);
        cols[c].add(v);
        const b = Math.floor(r/3)*3 + Math.floor(c/3);
        boxes[b].add(v);
        if (variation === "diagonal") {
          if (r === c) diag1.add(v);
          if (r + c === 8) diag2.add(v);
        }
        if (variation === "killer" && cellToCage[`${r},${c}`] !== undefined) {
          const ci = cellToCage[`${r},${c}`];
          cages[ci].assignedSum += v;
          cages[ci].assignedCount += 1;
        }
      }
    }
  }

  // compute candidates for a cell given current state
  function candidatesFor(r, c) {
    if (board[r][c] !== 0) return [];
    const used = new Set();
    rows[r].forEach(x => used.add(x));
    cols[c].forEach(x => used.add(x));
    boxes[Math.floor(r/3)*3 + Math.floor(c/3)].forEach(x => used.add(x));
    if (variation === "diagonal") {
      if (r === c) diag1.forEach(x => used.add(x));
      if (r + c === 8) diag2.forEach(x => used.add(x));
    }
    const cands = [];
    for (let n = 1; n <= 9; ++n) {
      if (used.has(n)) continue;
      // killer check: uniqueness within cage handled by used; additional sum feasibility:
      if (variation === "killer" && cellToCage[`${r},${c}`] !== undefined) {
        const ci = cellToCage[`${r},${c}`];
        const cage = cages[ci];
        // if n already present in rest of cage? need to ensure uniqueness in cage (like sudoku) - cage may contain numbers that are in same row/col/box though but uniqueness is required only within cage typically
        // We'll check if any filled cell in cage equals n:
        let duplicate = false;
        for (const [rr,cc] of cage.cells) {
          const val = board[rr][cc];
          if (val === n) { duplicate = true; break; }
        }
        if (duplicate) continue;
        // sum feasibility: min and max possible sums for remaining cells after placing n
        const remainingCells = cage.cells.length - cage.assignedCount - 1; // after placing n
        const minPossible = cage.assignedSum + n + (remainingCells>0 ? (remainingCells * 1) : 0);
        const maxPossible = cage.assignedSum + n + (remainingCells>0 ? (remainingCells * 9) : 0);
        if (minPossible > cage.sum) continue;
        if (maxPossible < cage.sum) continue;
        // additional: if remainingCells == 0, ensure exact sum:
        if (remainingCells === 0 && (cage.assignedSum + n) !== cage.sum) continue;
      }
      cands.push(n);
    }
    return cands;
  }

  // MRV: pick empty cell with fewest candidates
  function selectCell() {
    let best = null;
    let bestCount = 1000;
    for (let r = 0; r < N; ++r) {
      for (let c = 0; c < N; ++c) {
        if (board[r][c] === 0) {
          const cands = candidatesFor(r, c);
          if (cands.length === 0) return { r, c, cands }; // immediate dead-end
          if (cands.length < bestCount) {
            bestCount = cands.length;
            best = { r, c, cands };
            if (bestCount === 1) return best; // can't do better than 1
          }
        }
      }
    }
    return best; // may be null if filled
  }

  function placeNumber(r, c, n) {
    board[r][c] = n;
    rows[r].add(n);
    cols[c].add(n);
    boxes[Math.floor(r/3)*3 + Math.floor(c/3)].add(n);
    if (variation === "diagonal") {
      if (r === c) diag1.add(n);
      if (r + c === 8) diag2.add(n);
    }
    if (variation === "killer" && cellToCage[`${r},${c}`] !== undefined) {
      const ci = cellToCage[`${r},${c}`];
      cages[ci].assignedSum += n;
      cages[ci].assignedCount += 1;
    }
  }

  function removeNumber(r, c, n) {
    board[r][c] = 0;
    rows[r].delete(n);
    cols[c].delete(n);
    boxes[Math.floor(r/3)*3 + Math.floor(c/3)].delete(n);
    if (variation === "diagonal") {
      if (r === c) diag1.delete(n);
      if (r + c === 8) diag2.delete(n);
    }
    if (variation === "killer" && cellToCage[`${r},${c}`] !== undefined) {
      const ci = cellToCage[`${r},${c}`];
      cages[ci].assignedSum -= n;
      cages[ci].assignedCount -= 1;
    }
  }

  function backtrack() {
    const sel = selectCell();
    if (!sel) {
      // filled -> found solution
      solutions.push(deepCloneBoard(board));
      return;
    }
    const { r, c, cands } = sel;
    // try candidates (order could be small->large or heuristics)
    for (const n of cands) {
      // forward checking: placing n should not break cage sum exactness if a cage becomes full
      let violate = false;
      if (variation === "killer" && cellToCage[`${r},${c}`] !== undefined) {
        const ci = cellToCage[`${r},${c}`];
        const cage = cages[ci];
        const remainingAfter = cage.cells.length - (cage.assignedCount + 1);
        const newSum = cage.assignedSum + n;
        if (remainingAfter === 0) {
          if (newSum !== cage.sum) violate = true;
        } else {
          // quick pruning: newSum + remainingAfter*1 <= cage.sum <= newSum + remainingAfter*9
          if (newSum + remainingAfter*1 > cage.sum) violate = true;
          if (newSum + remainingAfter*9 < cage.sum) violate = true;
        }
      }
      if (violate) continue;

      placeNumber(r, c, n);
      backtrack();
      removeNumber(r, c, n);
    }
  }

  backtrack();
  return solutions;
}

// Example usage:

// Classic example board (0 is empty)
const classic_board = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9]
];

const solutionsClassic = solve_sudoku(classic_board, "classic");
console.log("Classic solutions found:", solutionsClassic.length);
// prints first solution:
if (solutionsClassic.length > 0) console.log(solutionsClassic[0]);

// Diagonal example: pass variation "diagonal" and a board that requires diagonal constraint

// Killer example: constraints formatted as an array:
const killer_board = [
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0]
];
// Example cage array format:
// constraints = { cages: [ { cells: [[0,0],[0,1],[1,0],[1,1]], sum: 15 }, ... ] }

