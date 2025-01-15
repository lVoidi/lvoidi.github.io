document.addEventListener('DOMContentLoaded', function() {
    // Cargar navbar
    fetch('/templates/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
        });

    // Cargar footer
    fetch('/templates/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
            // Actualizar el año después de cargar el footer
            document.getElementById('current-year').textContent = new Date().getFullYear();
        });
}); 