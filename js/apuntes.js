document.addEventListener('DOMContentLoaded', function() {
    // Manejar clic en categorías
    const categories = document.querySelectorAll('.category-title');
    categories.forEach(category => {
        category.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.classList.toggle('active');
            this.querySelector('span:last-child').textContent =
                parent.classList.contains('active') ? '▼' : '▶';
        });
    });

    // Manejar clic en enlaces de apuntes
    const noteLinks = document.querySelectorAll('.note-link');
    noteLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const noteId = this.getAttribute('data-content');
            loadNoteContent(noteId);
        });
    });

    function loadNoteContent(noteId) {
        // Aquí iría la lógica para cargar el contenido dinámico
        // Por ahora simularemos contenido
        const contentArea = document.getElementById('note-content');
        const welcome = document.querySelector('.welcome-message');

        welcome.style.display = 'none';
        contentArea.style.display = 'block';
        contentArea.innerHTML = `
            <h2>${noteId.replace('-', ' ').toUpperCase()}</h2>
            <p>Contenido de ${noteId}...</p>
            <!-- Aquí iría el contenido real de tus apuntes -->
        `;

        // Scroll suave al contenido
        contentArea.scrollIntoView({ behavior: 'smooth' });
    }
});
