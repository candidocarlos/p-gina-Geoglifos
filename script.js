document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling para links de navegação
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

    // Animação de scroll para elementos
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.feature-card, .section-title, .section-description').forEach((el) => {
        el.classList.add('fade-animation');
        observer.observe(el);
    });

    // Animação da navbar no scroll
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Manipulação do formulário
    const form = document.getElementById('report-form');
    const statusDiv = document.getElementById('report-status');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            try {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                submitBtn.disabled = true;

                const formData = new FormData(form);
                const response = await fetch('/api/report', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    statusDiv.innerHTML = '<div class="alert success"><i class="fas fa-check-circle"></i> Denúncia enviada com sucesso!</div>';
                    form.reset();
                } else {
                    throw new Error('Erro ao enviar denúncia');
                }
            } catch (error) {
                statusDiv.innerHTML = '<div class="alert error"><i class="fas fa-exclamation-circle"></i> ' + error.message + '</div>';
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Preview de imagem
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.createElement('div');
                    preview.className = 'image-preview';
                    preview.innerHTML = `
                        <img src="${e.target.result}" alt="Preview">
                        <button type="button" class="remove-image">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    
                    const container = fileInput.parentElement;
                    const existingPreview = container.querySelector('.image-preview');
                    if (existingPreview) {
                        container.removeChild(existingPreview);
                    }
                    container.appendChild(preview);

                    preview.querySelector('.remove-image').addEventListener('click', () => {
                        container.removeChild(preview);
                        fileInput.value = '';
                    });
                };
                reader.readAsDataURL(file);
            }
        });
    }
});
