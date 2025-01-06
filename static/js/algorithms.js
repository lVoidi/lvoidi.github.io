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
        }
    ],
    dynamic: [
        {
            name: "Fibonacci Dynamic Programming",
            category: "dynamic",
            description: "Efficiently calculates Fibonacci numbers using memoization",
            complexity: "O(n)",
            link: "dynamic/fibonacci.html"
        }
    ],
    greedy: [
        {
            name: "Kruskal's Algorithm",
            category: "greedy",
            description: "Finds the minimum spanning tree in a weighted graph",
            complexity: "O(E log E)",
            link: "greedy/kruskal.html"
        }
    ],
    backtracking: [
        {
            name: "N-Queens Problem",
            category: "backtracking",
            description: "Places N chess queens on an N×N chessboard so that no queens threaten each other",
            complexity: "O(N!)",
            link: "backtracking/n-queens.html"
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