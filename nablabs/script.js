// ===== NOTA: Navbar y Footer ahora se manejan en components/loader.js =====
// Este código se ha movido a loader.js para evitar duplicación

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== SISTEMA MODULAR DE CURSOS =====
// Aquí puedes agregar tus cursos de manera fácil y escalable

const courses = [
    {
        id: "nlpy-1",
        title: "NLPY-1 - Introducción a la programación con Python",
        description: "Aprende los fundamentos de programación con Python desde cero.",
        duration: "10 semanas",
        level: "Principiante",
        status: "available",
        tags: ["Python", "Programación", "Fundamentos", "Principiante"],
        pricing: {
            perHour: 3000,
            hoursPerWeek: 4,
            biweekly: 2 * 4 * 3000,
            currency: "₡"
        }
    },
    // Ejemplo de más cursos:
    // {
    //     id: "nlia-1",
    //     title: "NLIA-1 - Fundamentos de Inteligencia Artificial",
    //     description: "Introducción a los conceptos básicos de IA y Machine Learning",
    //     duration: "14 semanas",
    //     level: "Intermedio",
    //     status: "coming-soon",
    //     tags: ["IA", "Machine Learning", "Inteligencia Artificial", "Intermedio"]
    // }
];

// Estado de filtros
let currentFilters = {
    search: '',
    level: 'all',
    status: 'all',
    tags: []
};

// Función para obtener todos los tags únicos
function getAllTags() {
    const allTags = courses.flatMap(course => course.tags || []);
    return [...new Set(allTags)].sort();
}

// Función para filtrar cursos
function filterCourses() {
    return courses.filter(course => {
        // Filtro de búsqueda (título y descripción)
        const searchMatch = !currentFilters.search ||
            course.title.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
            course.description.toLowerCase().includes(currentFilters.search.toLowerCase());

        // Filtro de nivel
        const levelMatch = currentFilters.level === 'all' || course.level === currentFilters.level;

        // Filtro de estado
        const statusMatch = currentFilters.status === 'all' || course.status === currentFilters.status;

        // Filtro de tags
        const tagsMatch = currentFilters.tags.length === 0 ||
            currentFilters.tags.some(tag => (course.tags || []).includes(tag));

        return searchMatch && levelMatch && statusMatch && tagsMatch;
    });
}

// Función para renderizar los cursos
function renderCourses(coursesToRender = courses) {
    const container = document.getElementById('coursesContainer');

    if (coursesToRender.length === 0) {
        container.innerHTML = '<p class="no-results"><i class="fas fa-search"></i> No se encontraron cursos que coincidan con los filtros seleccionados.</p>';
        return;
    }

    container.innerHTML = coursesToRender.map(course => `
        <a href="courses/${course.id}.html" class="course-card-link">
            <div class="course-card">
                <h3>${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-meta">
                    <span class="course-duration"><i class="far fa-clock"></i> ${course.duration}</span>
                    <span class="course-level"><i class="fas fa-book"></i> ${course.level}</span>
                </div>
                ${course.pricing ? `
                    <div class="course-pricing">
                        <span class="price-badge">
                            <i class="fas fa-tag"></i> ${course.pricing.currency}${course.pricing.biweekly.toLocaleString()}/quincena
                        </span>
                    </div>
                ` : ''}
                ${(course.tags || []).length > 0 ? `
                    <div class="course-tags">
                        ${course.tags.slice(0, 3).map(tag => `<span class="course-tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                <span class="course-badge ${course.status}">
                    ${course.status === 'available' ? 'Disponible' : 'Próximamente'}
                </span>
            </div>
        </a>
    `).join('');

    // Actualizar contador de resultados
    updateResultsCount(coursesToRender.length);
}

// Función para actualizar contador de resultados
function updateResultsCount(count) {
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        countElement.textContent = `${count} curso${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
    }
}

// Función para renderizar filtros
function renderFilters() {
    const tagsContainer = document.getElementById('tagsFilter');
    if (!tagsContainer) return;

    const allTags = getAllTags();

    tagsContainer.innerHTML = allTags.map(tag => `
        <button class="tag-filter" data-tag="${tag}">
            <i class="fas fa-tag"></i> ${tag}
        </button>
    `).join('');

    // Event listeners para tags
    document.querySelectorAll('.tag-filter').forEach(button => {
        button.addEventListener('click', () => {
            const tag = button.dataset.tag;

            if (currentFilters.tags.includes(tag)) {
                currentFilters.tags = currentFilters.tags.filter(t => t !== tag);
                button.classList.remove('active');
            } else {
                currentFilters.tags.push(tag);
                button.classList.add('active');
            }

            applyFilters();
        });
    });
}

// Función para aplicar todos los filtros
function applyFilters() {
    const filteredCourses = filterCourses();
    renderCourses(filteredCourses);
}

// Función para limpiar filtros
function clearFilters() {
    currentFilters = {
        search: '',
        level: 'all',
        status: 'all',
        tags: []
    };

    // Resetear inputs
    const searchInput = document.getElementById('searchInput');
    const levelSelect = document.getElementById('levelFilter');
    const statusSelect = document.getElementById('statusFilter');

    if (searchInput) searchInput.value = '';
    if (levelSelect) levelSelect.value = 'all';
    if (statusSelect) statusSelect.value = 'all';

    // Remover clase active de tags
    document.querySelectorAll('.tag-filter').forEach(button => {
        button.classList.remove('active');
    });

    renderCourses(courses);
}

// Inicializar sistema de cursos y filtros
function initializeCourses() {
    renderCourses(courses);
    renderFilters();

    // Event listener para búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilters.search = e.target.value;
            applyFilters();
        });
    }

    // Event listener para filtro de nivel
    const levelSelect = document.getElementById('levelFilter');
    if (levelSelect) {
        levelSelect.addEventListener('change', (e) => {
            currentFilters.level = e.target.value;
            applyFilters();
        });
    }

    // Event listener para filtro de estado
    const statusSelect = document.getElementById('statusFilter');
    if (statusSelect) {
        statusSelect.addEventListener('change', (e) => {
            currentFilters.status = e.target.value;
            applyFilters();
        });
    }

    // Event listener para botón de limpiar filtros
    const clearButton = document.getElementById('clearFilters');
    if (clearButton) {
        clearButton.addEventListener('click', clearFilters);
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCourses);
} else {
    // DOM ya está listo
    initializeCourses();
}

// ===== INSTRUCCIONES PARA AGREGAR CURSOS =====
/*
Para agregar un nuevo curso, sigue estos pasos:

1. Agrega el curso al array 'courses' arriba con un ID único:

{
    id: "nlpy-2",  // ID único que será usado en la URL (courses/nlpy-2.html)
    title: "NLPY-2 - Python Avanzado",
    description: "Profundiza en conceptos avanzados de Python",
    duration: "12 semanas",
    level: "Intermedio",
    status: "coming-soon" // o "available"
}

2. Crea una página HTML para el curso en la carpeta 'courses/' con el nombre del ID:
   - Archivo: courses/nlpy-2.html
   - Puedes copiar courses/nlpy-1.html como plantilla

3. El curso aparecerá automáticamente en la página principal y será clickeable

Ejemplo completo:
{
    id: "nlia-1",
    title: "NLIA-1 - Fundamentos de Inteligencia Artificial",
    description: "Introducción a los conceptos básicos de IA y Machine Learning",
    duration: "14 semanas",
    level: "Intermedio",
    status: "available"
}
*/