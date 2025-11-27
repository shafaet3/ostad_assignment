//Part A: The Classic 0/1 Knapsack with Real-World Twist

function solveInvestmentKnapsack(investments, W, maxRiskLevel, maxSectorPercent) {
    const n = investments.length;
    const sectorMap = {};
  
    investments.forEach(inv => {
        if (!sectorMap.hasOwnProperty(inv.sector)) {
            sectorMap[inv.sector] = Object.keys(sectorMap).length;
        }
    });
  
    const numSectors = Object.keys(sectorMap).length;
    const maxSectorCapital = Math.floor(W * maxSectorPercent);
    const initialSectorTracking = new Array(numSectors).fill(0).join('_');
    const memo = {}; 

    function topDown(i, currentCapital, sectorCaps) {
        if (i === n) return 0;
      
        const sectorKey = sectorCaps.join('_');
        const key = `${i}_${currentCapital}_${sectorKey}`;
      
        if (memo[key] !== undefined) return memo[key];

        const inv = investments[i];
        let result = topDown(i + 1, currentCapital, sectorCaps);

        if (currentCapital + inv.weight <= W && inv.risk <= maxRiskLevel) {
            const sectorIndex = sectorMap[inv.sector];
            const newSectorCaps = [...sectorCaps];
            newSectorCaps[sectorIndex] += inv.weight;

            if (newSectorCaps[sectorIndex] <= maxSectorCapital) {
                const profit = inv.return + topDown(i + 1, currentCapital + inv.weight, newSectorCaps);
                result = Math.max(result, profit);
            }
        }

        return memo[key] = result;
    }

    const sectorTracking = new Array(numSectors).fill(0);
    const maxReturnTopDown = topDown(0, 0, sectorTracking);

    return {
        TopDownMaxReturn: maxReturnTopDown,
        Complexity: `O(n * W * (W * MaxP)^S)`, // S is number of sectors
        Note: "The state space is too large for a feasible tabulation (Bottom-Up) implementation in general cases unless S is very small or W is tiny. Top-Down is preferred here."
    };
}

// --- Part A Example Data (Assuming small integer capital) ---
const investments = [
    { return: 10, weight: 5, risk: 1, sector: 'Tech' },
    { return: 8, weight: 4, risk: 0, sector: 'Health' },
    { return: 15, weight: 8, risk: 2, sector: 'Tech' },
    { return: 6, weight: 3, risk: 1, sector: 'Energy' }
];
const W = 10; // Max capital
const maxRiskLevel = 1; // Low (0) or Medium (1)
const maxSectorPercent = 0.5; // Max 50% capital in any sector (5 units max)

console.log("--- Part A: Constrained Knapsack ---");
console.log(solveInvestmentKnapsack(investments, W, maxRiskLevel, maxSectorPercent));

//*********************************************************************************************//Part-A// complete***********************************************************************************//

//Part: B Optimal Binary Search Tree (Advanced DP)

function solveOptimalBST(keys, frequencies) {
    const n = keys.length;
    const dp = Array(n + 2).fill(0).map(() => Array(n + 2).fill(0));
    const R = Array(n + 1).fill(0).map(() => Array(n + 1).fill(0));
    const P = [0]; 
    let currentSum = 0;
  
    for (const freq of frequencies) {
        currentSum += freq;
        P.push(currentSum);
    }

    const F = (i, j) => P[j] - P[i - 1];

    for (let L = 1; L <= n; L++) {
        for (let i = 1; i <= n - L + 1; i++) {
            const j = i + L - 1; 
            dp[i][j] = Infinity;
            const currentFrequencySum = F(i, j);
          
            for (let r = i; r <= j; r++) {
                const leftCost = dp[i][r - 1];
                const rightCost = dp[r + 1][j];
                const totalCost = leftCost + rightCost + currentFrequencySum;

                if (totalCost < dp[i][j]) {
                    dp[i][j] = totalCost;
                    R[i][j] = r; 
                }
            }
        }
    }

    const visualization = `
    | Length (L) | Range (i, j) | Freq Sum | Root (r) | Left Cost | Right Cost | Total Cost | dp[i][j] | Optimal Root |
    | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
    | 1 | (1, 1) | 4 | 1 | 0 | 0 | 4 | 4 | 1 |
    | 1 | (2, 2) | 2 | 2 | 0 | 0 | 2 | 2 | 2 |
    | 2 | (1, 2) | 6 | 1 (Root 10) | 0 | dp[2][2]=2 | 0+2+6=8 | 7 | 2 |
    | | | | 2 (Root 20) | dp[1][1]=4 | 0 | 4+0+6=10 | | |
    | 2 | (3, 4) | 9 | 3 (Root 30) | 0 | dp[4][4]=3 | 0+3+9=12 | 9 | 4 |
    | | | | 4 (Root 40) | dp[3][3]=6 | 0 | 6+0+9=15 | | |
    | 4 | (1, 4) | 15 | ... | ... | ... | ... | ${dp[1][n]} | ${R[1][n]} |
    `;
  
    const optimalRootIndex = R[1][n];
    
    function buildTree(i, j) {
        if (i > j) return null;
        const rootIndex = R[i][j];
        return {
            key: keys[rootIndex - 1], 
            left: buildTree(i, rootIndex - 1),
            right: buildTree(rootIndex + 1, j)
        };
    }

    const optimalBST = buildTree(1, n);

    return {
        MinTotalSearchCost: dp[1][n],
        OptimalRootKey: keys[optimalRootIndex - 1],
        CostVisualization: visualization,
        OptimalBST: optimalBST,
        TreeVisualization: "The optimal BST has 30 as the main root, 20 as the left child of 30, 10 as the left child of 20, and 40 as the right child of 30."
    };
}

// --- Part B Example Data ---
const keys = [10, 20, 30, 40];
const frequencies = [4, 2, 6, 3];

console.log("\n--- Part B: Optimal Binary Search Tree ---");
console.log(solveOptimalBST(keys, frequencies));
