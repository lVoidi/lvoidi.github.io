// Algorithm database
const algorithms = {
    sorting: [
        {
            name: "Quick Sort",
            category: "sorting",
            description: "A highly efficient, comparison-based sorting algorithm using divide-and-conquer strategy",
            complexity: "Average: O(n log n), Worst: O(n²)",
            link: "sorting/quicksort.html"
        },
        {
            name: "Merge Sort",
            category: "sorting",
            description: "A stable, divide-and-conquer sorting algorithm with guaranteed O(n log n) performance",
            complexity: "O(n log n)",
            link: "sorting/mergesort.html"
        },
        {
            name: "Heap Sort",
            category: "sorting",
            description: "A comparison-based sorting algorithm using a binary heap data structure",
            complexity: "O(n log n)",
            link: "sorting/heapsort.html"
        },
        {
            name: "Shell Sort",
            category: "sorting",
            description: "An in-place comparison sort that generalizes insertion sort by allowing the exchange of items that are far apart",
            complexity: "O(n log n) to O(n²) depending on gap sequence",
            link: "sorting/shellsort.html"
        },
        {
            name: "Counting Sort",
            category: "sorting",
            description: "A non-comparison based sorting algorithm that works by counting the frequency of elements",
            complexity: "O(n + k) where k is the range of input",
            link: "sorting/countingsort.html"
        },
        {
            name: "Radix Sort",
            category: "sorting",
            description: "A non-comparative sorting algorithm that sorts integers by processing each digit position, from least significant to most significant",
            complexity: "O(d * (n + k)) where d is the number of digits and k is the range of each digit",
            link: "sorting/radixsort.html"
        },
        {
            name: "Bucket Sort",
            category: "sorting",
            description: "A distribution-based sorting algorithm that distributes elements into buckets and then sorts these buckets individually",
            complexity: "O(n + k) average case, O(n²) worst case",
            link: "sorting/bucketsort.html"
        },
        {
            name: "Simple pancake sort",
            category: "sorting",
            description: "Pancake sorting is the mathematical problem of sorting a disordered stack of pancakes in order of size when a spatula can be inserted at any point in the stack and used to flip all pancakes above it",
            complexity: "O(n²)",
            link: "sorting/pancake.html"
        },
        {
            name: "Insertion Sort",
            category: "sorting",
            description: "A simple sorting algorithm that builds the final sorted array one item at a time",
            complexity: "O(n²)",
            link: "sorting/insertionsort.html"
        },
        {
            name: "Selection Sort",
            category: "sorting",
            description: "A simple comparison-based sorting algorithm that divides the input into a sorted and unsorted region, repeatedly selecting the smallest element from the unsorted region",
            complexity: "O(n²)",
            link: "sorting/selectionsort.html"
        },
        {
            name: "Bubble Sort",
            category: "sorting",
            description: "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order",
            complexity: "O(n²)",
            link: "sorting/bubblesort.html"
        }
    ],
    searching: [
        {
            name: "Binary Search",
            category: "searching",
            description: "Efficient search algorithm for sorted arrays using divide-and-conquer approach",
            complexity: "O(log n)",
            link: "searching/binary-search.html"
        },
        {
            name: "Breadth First Search",
            category: "searching",
            description: "Efficient search algorithm for sorted arrays using divide-and-conquer approach",
            complexity: "O(log n)",
            link: "searching/bfs.html"
        },
        {
            name: "Depth First Search",
            category: "searching",
            description: "Graph traversal algorithm that explores as far as possible along each branch before backtracking",
            complexity: "O(V + E)",
            link: "searching/dfs.html"
        }
    ],
    graph: [
        {
            name: "Dijkstra's Algorithm",
            category: "graph",
            description: "Finds the shortest path between nodes in a weighted graph",
            complexity: "O((V + E) log V)",
            link: "graph/dijkstra.html"
        },
        {
            name: "A* Algorithm",
            category: "graph",
            description: "Finds the shortest path between nodes in a weighted graph",
            complexity: "O((V + E) log V)",
            link: "graph/astar.html"
        },
        {
            name: "Bellman-Ford Algorithm",
            category: "graph",
            description: "Finds shortest paths from source vertex to all vertices, handles negative weights",
            complexity: "O(VE)",
            link: "graph/bellman-ford.html"
        },
        {
            name: "Floyd-Warshall Algorithm",
            category: "graph",
            description: "Finds the shortest paths between all pairs of vertices in a weighted graph",
            complexity: "O(V³)",
            link: "graph/floyd-warshall.html"
        },
        {
            name: "Prim's Algorithm",
            category: "graph",
            description: "Finds the minimum spanning tree in a weighted graph",
            complexity: "O(E log E)",
            link: "graph/prim.html"
        },
        {
            name: "Kahn's Algorithm",
            category: "graph",
            description: "Finds the minimum spanning tree in a weighted graph",
            complexity: "O(E log E)",
            link: "graph/kahn.html"
        },
        {
            name: "Kosaraju's Algorithm",
            category: "graph",
            description: "Finds the minimum spanning tree in a weighted graph",
            complexity: "O(E log E)",
            link: "graph/kosaraju.html"
        },
        {
            name: "Tarjan's Algorithm",
            category: "graph",
            description: "Finds the minimum spanning tree in a weighted graph",
            complexity: "O(E log E)",
            link: "graph/tarjan.html"
        },
        {
            name: "Ford-Fulkerson Algorithm",
            category: "graph",
            description: "Finds the maximum flow in a flow network",
            complexity: "O(E * f)",
            link: "graph/ford-fulkerson.html"
        }
    ],
    dynamic: [
        {
            name: "Fibonacci Dynamic Programming",
            category: "dynamic",
            description: "Efficiently calculates Fibonacci numbers using memoization",
            complexity: "O(n)",
            link: "dynamic/fibonacci.html"
        },
        {
            name: "Longest Common Subsequence",
            category: "dynamic",
            description: "Finds the longest subsequence present in two sequences using dynamic programming",
            complexity: "Time: O(mn), Space: O(mn)",
            link: "dynamic/lcs.html"
        },
        {
            name: "0/1 Knapsack",
            category: "dynamic",
            description: "Solves the problem of selecting items with given weights and values to maximize value while keeping total weight under a limit",
            complexity: "Time: O(nW), Space: O(nW)",
            link: "dynamic/knapsack.html"
        },
        {
            name: "Edit Distance",
            category: "dynamic",
            description: "Calculates the minimum number of operations required to transform one string into another",
            complexity: "Time: O(mn), Space: O(mn)",
            link: "dynamic/editdistance.html"
        },
        {
            name: "Subset Sum",
            category: "dynamic",
            description: "Determines if there exists a subset of elements in an array that sums to a given target value",
            complexity: "Time: O(n*sum), Space: O(n*sum)",
            link: "dynamic/subsetsum.html"
        }
    ],
    greedy: [
        {
            name: "Activity Selection Problem",
            category: "greedy",
            description: "Selects the maximum number of non-overlapping activities that can be performed by a single person",
            complexity: "O(n log n)",
            link: "greedy/activity-selection.html"
        },
        {
            name: "Job Sequencing with Deadlines",
            category: "greedy",
            description: "Maximizes profit by scheduling jobs before their deadlines, with each job taking one unit of time",
            complexity: "O(n² log n)",
            link: "greedy/job-sequencing.html"
        },
        {
            name: "Kruskal's Algorithm",
            category: "greedy",
            description: "Finds the minimum spanning tree in a weighted graph",
            complexity: "O(E log E)",
            link: "greedy/kruskal.html"
        },
        {
            name: "Huffman Coding",
            category: "greedy",
            description: "Huffman coding is a popular algorithm used for lossless data compression",
            complexity: "O(n log n)",
            link: "greedy/huffman.html"
        }
    ],
    backtracking: [
        {
            name: "N-Queens Problem",
            category: "backtracking",
            description: "Places N chess queens on an N×N chessboard so that no queens threaten each other",
            complexity: "O(N!)",
            link: "backtracking/n-queens.html"
        },
        {
            name: "Sudoku Solver",
            category: "backtracking",
            description: "Solves a 9x9 Sudoku puzzle ensuring each row, column, and 3x3 box contains digits 1-9 without repetition",
            complexity: "O(9^(n*n))",
            link: "backtracking/sudoku.html"
        },
        {
            name: "Rat Maze",
            category: "backtracking",
            description: "Determines if a rat can cross a maze from the top-left corner to the bottom-right corner, avoiding obstacles",
            complexity: "O(n^2)",
            link: "backtracking/rat-maze.html"
        },
        {
            name: "Word Break Problem",
            category: "backtracking",
            description: "Determines if a string can be segmented into space-separated sequence of dictionary words",
            complexity: "O(2^n)",
            link: "backtracking/word-break.html"
        },
        {
            name: "String Permutations",
            category: "backtracking",
            description: "Generates all possible permutations of a given string",
            complexity: "O(n!)",
            link: "backtracking/string-permutations.html"
        }
    ],
    cryptographic: [
        {
            name: "RSA Algorithm",
            category: "cryptographic",
            description: "Public-key cryptosystem for secure data transmission",
            complexity: "Key Generation: O(log N), Encryption: O(log N), Decryption: O(log N)",
            link: "cryptographic/rsa.html"
        },
        {
            name: "AES (Advanced Encryption Standard)",
            category: "cryptographic",
            description: "A symmetric block cipher algorithm used worldwide",
            complexity: "O(1) per block",
            link: "cryptographic/aes.html"
        },
        {
            name: "ChaCha20",
            category: "cryptographic",
            description: "A stream cipher algorithm used worldwide",
            complexity: "O(1) per block",
            link: "cryptographic/chacha20.html"
        },
        {
            name: "SHA",
            category: "cryptographic",
            description: "A cryptographic hash function used worldwide",
            complexity: "O(1) per block",
            link: "cryptographic/sha.html"
        }
    ],
    machine_learning: [
        {
            name: "Linear Regression",
            category: "machine_learning",
            description: "Predicts a dependent variable value based on independent variables",
            complexity: "Training: O(n³), Prediction: O(n)",
            link: "machine-learning/linear-regression.html"
        },
        {
            name: "Support Vector Machine (SVM)",
            category: "machine_learning",
            description: "A supervised learning algorithm that finds an optimal hyperplane to separate data points into different classes while maximizing the margin",
            complexity: "O(n²) to O(n³) depending on implementation, where n is the number of training samples",
            link: "machine-learning/svm.html"
        }
    ],
    string: [
        {
            name: "KMP Algorithm",
            category: "string",
            description: "Knuth-Morris-Pratt pattern matching algorithm for efficient string searching",
            complexity: "O(n + m)",
            link: "string/kmp.html"
        },
        {
            name: "Markov Chain",
            category: "string",
            description: "Markov chain for efficient string searching",
            complexity: "O(n + m)",
            link: "string/markov.html"
        },
        {
            name: "Rabin-Karp Algorithm",
            category: "string",
            description: "A string searching algorithm that uses hashing to find an exact match of a pattern string in a text",
            complexity: "Average: O(n + m), Worst: O(nm)",
            link: "string/rabin-karp.html"
        }
    ],
    numerical: [
        {
            name: "Newton's Method",
            category: "numerical",
            description: "Root-finding algorithm using function derivatives",
            complexity: "O(log n)",
            link: "numerical/newton.html"
        },
        {
            name: "Fast Fourier Transform",
            category: "numerical",
            description: "An efficient algorithm for computing the Discrete Fourier Transform (DFT) of a sequence",
            complexity: "O(n log n)",
            link: "numerical/fft.html"
        },
        {
            name: "Gaussian Elimination",
            category: "numerical",
            description: "A method for solving systems of linear equations by converting the augmented matrix to row echelon form",
            complexity: "O(n³)",
            link: "numerical/gaussian-elimination.html"
        },
        {
            name: "Bisection Method",
            category: "numerical",
            description: "A root-finding algorithm that repeatedly bisects an interval and selects a subinterval containing a root",
            complexity: "O(log((b-a)/ε))",
            link: "numerical/bisection.html"
        },
        {
            name: "Secant Method",
            category: "numerical",
            description: "A root-finding algorithm that uses a succession of roots of secant lines to better approximate a root of a function",
            complexity: "O(log n)",
            link: "numerical/secant.html"
        },
        {
            name: "Gauss-Seidel Method",
            category: "numerical",
            description: "An iterative method for solving systems of linear equations by improving an initial guess through successive substitutions",
            complexity: "O(kn²) where k is iterations",
            link: "numerical/gauss-seidel.html"
        },
        {
            name: "Gaussian Quadrature",
            category: "numerical",
            description: "A numerical integration method that approximates definite integrals using optimal abscissas and weights",
            complexity: "O(n) where n is number of points",
            link: "numerical/gaussian-quadrature.html"
        },
        {
            name: "Gauss-Legendre Algorithm",
            category: "numerical",
            description: "A high-precision method for computing π using arithmetic-geometric mean and Legendre's relation",
            complexity: "O(M(n) log n) where M(n) is multiplication complexity",
            link: "numerical/gauss-legendre.html"
        },
        {
            name: "Gauss-Newton Algorithm",
            category: "numerical",
            description: "An iterative method for solving non-linear least squares problems, combining Gauss's method with Newton's method",
            complexity: "O(mn²) per iteration, where m is number of observations and n is number of parameters",
            link: "numerical/gauss-newton.html"
        }
    ],
    randomized: [
        {
            name: "Monte Carlo Pi",
            category: "randomized",
            description: "Estimates the value of π using random point sampling",
            complexity: "O(n)",
            link: "randomized/monte-carlo-pi.html"
        },
        {
            name: "Karger's Min Cut Algorithm",
            category: "randomized",
            description: "A randomized algorithm to find minimum cuts in a graph",
            complexity: "O(V²E)",
            link: "randomized/kargers-min-cut.html"
        }
    ]
};

// Function to render algorithms
function renderAlgorithms(filteredAlgorithms = null) {
    const grid = document.getElementById('algorithmsGrid');
    const algorithmsToRender = filteredAlgorithms || Object.values(algorithms).flat();
    
    grid.innerHTML = algorithmsToRender.map(algo => `
        <div class="algorithm-card">
            <h3>${algo.name}</h3>
            <p>${algo.description}</p>
            <div class="algo-meta">
                <span class="category">${algo.category}</span>
                <span class="complexity">${algo.complexity}</span>
            </div>
            <a href="${algo.link}" class="btn btn-outline-light mt-3">Learn More</a>
        </div>
    `).join('');

    // Actualizar contadores después de renderizar
    updateCounters();
}

// Search functionality
document.getElementById('searchBar').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = Object.values(algorithms)
        .flat()
        .filter(algo => 
            algo.name.toLowerCase().includes(searchTerm) ||
            algo.description.toLowerCase().includes(searchTerm)
        );
    renderAlgorithms(filtered);
});

// Random algorithm selection
function selectRandomAlgorithm() {
    const allAlgorithms = Object.values(algorithms).flat();
    const randomAlgo = allAlgorithms[Math.floor(Math.random() * allAlgorithms.length)];
    window.location.href = randomAlgo.link;
}

// Category filtering
document.querySelectorAll('.category-item input').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const selectedCategories = Array.from(document.querySelectorAll('.category-item input:checked'))
            .map(input => input.value);
        
        if (selectedCategories.length === 0) {
            renderAlgorithms();
            return;
        }

        const filtered = Object.values(algorithms)
            .flat()
            .filter(algo => selectedCategories.includes(algo.category));
        renderAlgorithms(filtered);
    });
});

function updateCounters() {
    const categoryCounts = {};
    let total = 0;
    
    // Contar algoritmos por categoría
    Object.keys(algorithms).forEach(category => {
        categoryCounts[category] = algorithms[category].length;
        total += algorithms[category].length;
    });
    
    // Actualizar contadores en el DOM
    Object.keys(categoryCounts).forEach(category => {
        const counterElement = document.getElementById(`${category}-counter`);
        if (counterElement) {
            counterElement.textContent = `(${categoryCounts[category]})`;
        }
    });
    
    // Actualizar contador total
    document.getElementById('totalCounter').textContent = total;
}

// Agregar la llamada inicial cuando se carga el documento
document.addEventListener('DOMContentLoaded', function() {
    renderAlgorithms();
}); 
