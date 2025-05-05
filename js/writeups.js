document.addEventListener('DOMContentLoaded', function() {
    // Manejo de categorías
    const categories = document.querySelectorAll('.category-title');
    categories.forEach(category => {
        category.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.classList.toggle('active');
            this.querySelector('span:last-child').textContent =
                parent.classList.contains('active') ? '▼' : '▶';
        });
    });
    // Manejo de subcategorias
    document.querySelectorAll('.difficulty-title').forEach(title => {
        title.addEventListener('click', () => {
            const dropdown = title.parentElement;
            dropdown.classList.toggle('active');
        });
    });

    // Carga de writeups
    const writeupLinks = document.querySelectorAll('.writeup-link');
    writeupLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const writeupId = this.getAttribute('data-content');
            loadWriteupContent(writeupId);
        });
    });

    async function loadWriteupContent(writeupId) {
        const contentArea = document.getElementById('writeup-content');
        const welcome = document.querySelector('.welcome-message');
        const tocSidebar = document.getElementById('toc-sidebar');

        welcome.style.display = 'none';
        contentArea.style.display = 'block';
        contentArea.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Cargando writeup...</div>';
        tocSidebar.style.display = 'none';

        try {
            const filePath = `/writeups/${writeupId}.html`;
            const response = await fetch(filePath);

            if (!response.ok) throw new Error('Writeup no encontrado');

            const content = await response.text();
            contentArea.innerHTML = content;

            // Generar TOC
            generateTOC();

            // Resaltado de sintaxis
            document.querySelectorAll('pre code').forEach((el) => {
                hljs.highlightElement(el);
            });
        } catch (error) {
            contentArea.innerHTML = `
                <div class="error">
                    <h2><i class="fas fa-exclamation-triangle"></i> Error</h2>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }

    function generateTOC() {
        const tocSidebar = document.getElementById('toc-sidebar');
        const tocContent = document.getElementById('toc-content');
        const headings = document.querySelectorAll('.writeup-content h2, .writeup-content h3');

        tocContent.innerHTML = '';

        if (headings.length === 0) {
            tocSidebar.style.display = 'none';
            return;
        }

        tocSidebar.style.display = 'block';

        headings.forEach(heading => {
            if (!heading.id) {
                heading.id = heading.textContent.toLowerCase().replace(/[^\w]+/g, '-');
            }

            const tocItem = document.createElement('div');
            tocItem.className = `toc-item toc-${heading.tagName.toLowerCase()}`;
            tocItem.textContent = heading.textContent;
            tocItem.dataset.target = heading.id;

            tocItem.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.toc-item').forEach(item => {
                    item.classList.remove('active');
                });
                tocItem.classList.add('active');
            });

            tocContent.appendChild(tocItem);
        });

        // Observador para resaltado pasivo
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.id;
                const tocItem = document.querySelector(`.toc-item[data-target="${id}"]`);

                if (entry.isIntersecting && tocItem) {
                    document.querySelectorAll('.toc-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    tocItem.classList.add('active');
                }
            });
        }, { threshold: 0.5, rootMargin: '0px 0px -50% 0px' });

        headings.forEach(heading => {
            observer.observe(heading);
        });
    }
});
