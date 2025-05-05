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
    });document.querySelectorAll('.difficulty-title').forEach(title => {
        title.addEventListener('click', () => {
            const dropdown = title.parentElement;
            dropdown.classList.toggle('active');
        });
    });
    // Manejar clic en subcategorias


    // Manejar clic en enlaces de apuntes
    document.querySelectorAll('.note-link, .quick-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hasAttribute('data-content')) {
                e.preventDefault();
                const noteId = this.getAttribute('data-content');
                loadNoteContent(noteId);
            }
            // Si no tiene data-content, dejar que el href normal funcione
        });
    });

    async function loadNoteContent(noteId) {
        const contentArea = document.getElementById('note-content');
        const welcome = document.querySelector('.welcome-message');

        // Mostrar estado de carga
        welcome.style.display = 'none';
        contentArea.style.display = 'block';
        contentArea.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Cargando apuntes...</p>
            </div>
        `;

        try {
            const filePath = determineNotePath(noteId);
            const response = await fetch(filePath);

            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

            const content = await response.text();
            contentArea.innerHTML = content;

            function generateTOC() {
                const tocSidebar = document.getElementById('toc-sidebar');
                const tocContent = document.getElementById('toc-content');
                const headings = document.querySelectorAll('.note h1, .note h2, .note h3');
                const h1Elements = document.querySelectorAll('.note h1');

                // Limpiar TOC previo
                tocContent.innerHTML = '';

                // Ocultar completamente el sidebar si no hay H1
                if (h1Elements.length === 0) {
                    tocSidebar.style.display = 'none';
                    return;
                } else {
                    tocSidebar.style.display = 'block';
                }

                // Generar TOC solo si hay encabezados
                if (headings.length > 0) {
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

                    // Observador de intersección (scroll)
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
                } else {
                    tocSidebar.style.display = 'none';
                }
            }


            // Activar resaltado de sintaxis
            document.querySelectorAll('pre code').forEach((el) => {
                hljs.highlightElement(el);
            });
        } catch (error) {
            console.error('Error loading note:', error);
            contentArea.innerHTML = `
                <div class="error">
                    <h2><i class="fas fa-exclamation-triangle"></i> Error al cargar los apuntes</h2>
                    <p>${error.message}</p>
                    <a href="#" onclick="location.reload()"><i class="fas fa-redo"></i> Recargar</a>
                    <a href="/index.html"><i class="fas fa-home"></i> Volver al inicio</a>
                </div>
            `;
        }
        try {
            const filePath = determineNotePath(noteId);
            const response = await fetch(filePath);

            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

            const content = await response.text();
            contentArea.innerHTML = content;

            // Activar resaltado de sintaxis
            document.querySelectorAll('pre code').forEach((el) => {
                hljs.highlightElement(el);
            });

            // Generar TOC después de cargar el contenido
            generateTOC();

        } catch (error) {
            console.error('Error loading note:', error);
            contentArea.innerHTML = `
                <div class="error">
                    <h2><i class="fas fa-exclamation-triangle"></i> Error al cargar los apuntes</h2>
                    <p>${error.message}</p>
                    <a href="#" onclick="location.reload()"><i class="fas fa-redo"></i> Recargar</a>
                    <a href="/index.html"><i class="fas fa-home"></i> Volver al inicio</a>
                </div>
            `;

            // Ocultar TOC en caso de error
            document.getElementById('toc-sidebar').style.display = 'none';
        }

        contentArea.scrollIntoView({ behavior: 'smooth' });
    }

    function determineNotePath(noteId) {
        const noteMap = {
            'linux-basico': '/apuntes/Linux/ejemplo.html',
            'linux-red': '/apuntes/linux/redes.html',
            'web-basico': '/apuntes/web/fundamentos.html',
            'web-sqli': '/apuntes/web/sqli.html'
        };
        return noteMap[noteId] || '/apuntes/not-found.html';
    }
});
