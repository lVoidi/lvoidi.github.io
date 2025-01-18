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
            description: "Solves a 9x9 Sudoku puzzle ensuring each row, column, and 3x3 box contains digits 1-9 without repetition",
            complexity: "O(9^(n*n))",
            link: "backtracking/rat-maze.html"
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
        }
    ],
    numerical: [
        {
            name: "Newton's Method",
            category: "numerical",
            description: "Root-finding algorithm using function derivatives",
            complexity: "O(log n)",
            link: "numerical/newton.html"
        }
    ],
    randomized: [
        {
            name: "Monte Carlo Pi",
            category: "randomized",
            description: "Estimates the value of π using random point sampling",
            complexity: "O(n)",
            link: "randomized/monte-carlo-pi.html"
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

// Initial render
renderAlgorithms(); 
