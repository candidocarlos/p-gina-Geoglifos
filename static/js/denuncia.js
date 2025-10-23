document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('denuncia-form');
    const previewContainer = document.getElementById('preview-container');
    const fileInput = document.getElementById('fotos');
    const anonimoCheckbox = document.getElementById('anonimo');
    const dadosPessoais = ['nome', 'email', 'telefone'];

    // Gerenciar o checkbox de denúncia anônima
    anonimoCheckbox.addEventListener('change', function() {
        dadosPessoais.forEach(campo => {
            const input = document.getElementById(campo);
            input.disabled = this.checked;
            if (this.checked) {
                input.value = '';
                input.placeholder = 'Denúncia anônima selecionada';
            } else {
                input.placeholder = `Seu ${campo}`;
            }
        });
    });

    // Preview de imagens
    fileInput.addEventListener('change', function() {
        previewContainer.innerHTML = '';
        Array.from(this.files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    previewContainer.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    });

    // Geolocalização
    if ('geolocation' in navigator) {
        const locationHelp = document.querySelector('.location-help');
        locationHelp.innerHTML += ' <button type="button" id="getLocation" class="btn-link">Usar minha localização atual</button>';
        
        document.getElementById('getLocation').addEventListener('click', function() {
            navigator.geolocation.getCurrentPosition(function(position) {
                document.getElementById('latitude').value = position.coords.latitude;
                document.getElementById('longitude').value = position.coords.longitude;
            }, function(error) {
                alert('Erro ao obter localização: ' + error.message);
            });
        });
    }

    // Submissão do formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validação básica
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        if (!isValid) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Preparar dados do formulário
        const formData = new FormData(form);

        try {
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

            // Aqui você deve implementar a lógica de envio para seu backend
            // Por enquanto, vamos simular um envio
            await new Promise(resolve => setTimeout(resolve, 2000));

            alert('Denúncia enviada com sucesso! Obrigado por sua contribuição.');
            form.reset();
            previewContainer.innerHTML = '';

        } catch (error) {
            alert('Erro ao enviar denúncia. Por favor, tente novamente.');
            console.error('Erro:', error);

        } finally {
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Enviar Denúncia</span><i class="fas fa-paper-plane"></i>';
        }
    });
});