class DailySelection {
    constructor() {
        this.lastUpdate = localStorage.getItem('lastDailyUpdate');
        this.currentDate = new Date().toDateString();
        
        if (this.lastUpdate !== this.currentDate) {
            this.updateSelections();
        } else {
            this.loadFromStorage();
        }
    }
    
    updateSelections() {
        // Seleccionar algoritmo aleatorio
        const allCategories = Object.keys(algorithms);
        const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
        const categoryAlgorithms = algorithms[randomCategory];
        const randomAlgorithm = categoryAlgorithms[Math.floor(Math.random() * categoryAlgorithms.length)];
        
        // Seleccionar artículo de singularity
        const randomSingularity = SINGULARITY_POSTS[Math.floor(Math.random() * SINGULARITY_POSTS.length)];
        
        // Seleccionar artículo de void
        const randomVoid = VOID_POSTS[Math.floor(Math.random() * VOID_POSTS.length)];
        
        // Guardar selecciones
        const selections = {
            algorithm: randomAlgorithm,
            singularity: randomSingularity,
            void: randomVoid
        };
        
        localStorage.setItem('dailySelections', JSON.stringify(selections));
        localStorage.setItem('lastDailyUpdate', this.currentDate);
        
        this.updateUI(selections);
    }
    
    loadFromStorage() {
        const selections = JSON.parse(localStorage.getItem('dailySelections'));
        this.updateUI(selections);
    }
    
    updateUI(selections) {
        // Actualizar algoritmo
        document.getElementById('dailyAlgorithm').textContent = selections.algorithm.name;
        document.getElementById('dailyAlgorithmDesc').textContent = selections.algorithm.description;
        document.getElementById('dailyAlgorithmLink').href = `algorithms/${selections.algorithm.link}`;
        
        // Actualizar singularity
        document.getElementById('dailySingularity').textContent = selections.singularity.title;
        document.getElementById('dailySingularityDesc').textContent = selections.singularity.description;
        document.getElementById('dailySingularityLink').href = `singularity/pages/${selections.singularity.id}.html`;
        
        // Actualizar void
        document.getElementById('dailyVoid').textContent = selections.void.title;
        document.getElementById('dailyVoidDesc').textContent = selections.void.description;
        document.getElementById('dailyVoidLink').href = `void/pages/${selections.void.id}.html`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DailySelection();
}); 