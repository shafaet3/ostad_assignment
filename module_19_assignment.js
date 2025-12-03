// Problem 1: The Palindrome Factory
function solveProblem1(s, k, ins_cost, del_cost, rep_cost) {
    const n = s.length;
    const dp = Array(n).fill(0).map(() => Array(n).fill(0));
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;

            if (s[i] === s[j]) {
                dp[i][j] = dp[i + 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    dp[i + 1][j] + del_cost,
                    dp[i][j - 1] + ins_cost,
                    dp[i + 1][j - 1] + rep_cost
                );
            }
        }
    }

    let minCost = dp[0][n - 1];

    return minCost;
}

function solveProblem1Main(input) {
    const lines = input.trim().split('\n');
    const T = parseInt(lines[0].trim());
    const results = [];

    for (let t = 0; t < T; t++) {
        const [s, kStr, ins_costStr, del_costStr, rep_costStr] = lines[t + 1].trim().split(' ');
        const k = parseInt(kStr);
        const ins_cost = parseInt(ins_costStr);
        const del_cost = parseInt(del_costStr);
        const rep_cost = parseInt(rep_costStr);
        results.push(solveProblem1(s, k, ins_cost, del_cost, rep_cost));
    }

    return results.join('\n');
}

// Sample Input:
const sampleInput1 = `2
abca 2 1 1 1
xyzxyz 3 2 3 1`;

// Problem 1:
const output1 = solveProblem1Main(sampleInput1);



// Problem 2: The Weighted Maze Runner
function solveProblem2(n, m, T, weight, jump_cost) {
    const INF = Infinity;
    let dp_prev = Array(n).fill(0).map(() => Array(m).fill(INF));
    let dp_curr = Array(n).fill(0).map(() => Array(m).fill(INF));

    dp_prev[0][0] = 0;

    const moves = [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]]; 
    const max_diagonal = n + m - 2;

    for (let t = 1; t <= T; t++) {
        dp_curr = Array(n).fill(0).map(() => Array(m).fill(INF));
      
        const minCostDiagonalPrev = Array(max_diagonal + 1).fill(INF);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                const D = i + j;
                minCostDiagonalPrev[D] = Math.min(minCostDiagonalPrev[D], dp_prev[i][j]);
            }
        }

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                const currentWeight = weight[i][j];
                let minCost = INF;
              
                for (const [di, dj] of moves) {
                    const pi = i - di; 
                    const pj = j - dj; 

                    if (pi >= 0 && pi < n && pj >= 0 && pj < m) {
                        if (dp_prev[pi][pj] !== INF) {
                             minCost = Math.min(minCost, dp_prev[pi][pj] + currentWeight);
                        }
                    }
                }
                
                const D = i + j;
                if (minCostDiagonalPrev[D] !== INF) {
                    const jumpCostTotal = minCostDiagonalPrev[D] + jump_cost + currentWeight;
                    minCost = Math.min(minCost, jumpCostTotal);
                }

                dp_curr[i][j] = minCost;
            }
        }

        dp_prev = dp_curr;
    }

    const finalCost = dp_prev[n - 1][m - 1];

    return finalCost === INF ? -1 : finalCost;
}

function solveProblem2Main(input) {
    const lines = input.trim().split('\n');
    const [nStr, mStr, TStr] = lines[0].trim().split(' ');
    const n = parseInt(nStr);
    const m = parseInt(mStr);
    const T = parseInt(TStr);
    
    const weight = [];
    for (let i = 0; i < n; i++) {
        weight.push(lines[i + 1].trim().split(' ').map(Number));
    }

    const jump_cost = parseInt(lines[n + 1].trim());

    return solveProblem2(n, m, T, weight, jump_cost);
}

const sampleInput2 = `3 3 5
1 2 3
4 5 6
7 8 9
3`;

// Problem 2:
const output2 = solveProblem2Main(sampleInput2);
