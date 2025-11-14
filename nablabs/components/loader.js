/**
 * Nablabs Components Loader
 * Carga navbar y footer de forma modular en todas las páginas
 */

(function () {
    'use strict';

    // Determinar la ruta base según la ubicación del archivo
    function getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/nablabs/courses/')) {
            return '../';
        } else if (path.includes('/nablabs/')) {
            return '';
        }
        return '/nablabs/';
    }

    // Cargar componente HTML
    async function loadComponent(componentName, targetId) {
        const basePath = getBasePath();
        const componentPath = `${basePath}components/${componentName}.html`;

        try {
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const target = document.getElementById(targetId);
            if (target) {
                target.innerHTML = html;
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Error loading ${componentName}:`, error);
            return false;
        }
    }

    // Inicializar navbar
    function initNavbar() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });

            // Cerrar menú al hacer click en un link
            const navLinks = document.querySelectorAll('.nav-menu a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                });
            });
        }

        // Marcar página activa
        highlightActivePage();
    }

    // Resaltar página activa en la navegación
    function highlightActivePage() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        const navLinks = document.querySelectorAll('.nav-menu a');

        navLinks.forEach(link => {
            link.classList.remove('active');

            const linkPath = link.getAttribute('href');

            // Verificar si es la página actual
            if (currentPath.includes('hall-of-fame.html') && linkPath.includes('hall-of-fame.html')) {
                link.classList.add('active');
            } else if (currentPath.includes('courses/') && link.getAttribute('data-page') === 'cursos') {
                link.classList.add('active');
            } else if (currentPath.includes('index.html') || currentPath.endsWith('/nablabs/')) {
                // Para la página principal, resaltar según el hash
                if (currentHash && linkPath.includes(currentHash)) {
                    link.classList.add('active');
                } else if (!currentHash && linkPath.includes('#inicio')) {
                    link.classList.add('active');
                }
            }
        });
    }

    // Inicializar footer
    function initFooter() {
        // Actualizar año actual
        const yearElements = document.querySelectorAll('.current-year, #currentYear');
        const currentYear = new Date().getFullYear();
        yearElements.forEach(element => {
            element.textContent = currentYear;
        });
    }

    // Cargar todos los componentes
    async function loadAllComponents() {
        const navbarLoaded = await loadComponent('navbar', 'navbar-container');
        const footerLoaded = await loadComponent('footer', 'footer-container');

        if (navbarLoaded) {
            initNavbar();
        }

        if (footerLoaded) {
            initFooter();
        }

        // Actualizar links según la ubicación
        updateLinks();
    }

    // Actualizar links según la ubicación de la página
    function updateLinks() {
        const basePath = getBasePath();
        const links = document.querySelectorAll('#navbar-container a, #footer-container a');

        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('/nablabs/')) {
                // Ajustar rutas relativas según la ubicación
                if (basePath === '../') {
                    link.setAttribute('href', href.replace('/nablabs/', '../'));
                } else if (basePath === '') {
                    link.setAttribute('href', href.replace('/nablabs/', ''));
                }
            }
        });
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllComponents);
    } else {
        loadAllComponents();
    }

    // Re-destacar página activa cuando cambia el hash
    window.addEventListener('hashchange', highlightActivePage);

})();
