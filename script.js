/**
 * ElectroSmart - Script de Interactividad de la Landing Page
 * Implementa el Buscador de Historial Técnico con informes reales simulados y validaciones.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos del DOM para Historial Técnico
    const inputHistorial = document.getElementById('input-historial');
    const btnBuscarHistorial = document.getElementById('btn-buscar-historial');
    const mensajeHistorial = document.getElementById('mensaje-historial');

    // 2. Base de Datos Local de Historiales Técnicos (Google Drive)
    const historiales = {
        "74508417": "https://drive.google.com/drive/folders/1AkzJdHlnoUwm2W4rKHsp-v2tbk4yOnuh?usp=sharing",
        "77424619": "https://drive.google.com/drive/folders/1GBh3JT4IxAEgKp5CH80ey-JK60N7ywU4?usp=sharing",
        "20612363952": "https://drive.google.com/drive/folders/1EAD3MWo-_fMDpS_x9ma0WkLcxZ2_nK-N?usp=sharing"
    };

    // 3. Función de Búsqueda de Historial
    function realizarBusquedaHistorial() {
        if (!inputHistorial || !mensajeHistorial) return;

        const valorBusqueda = inputHistorial.value.trim();

        // Si el input está vacío
        if (valorBusqueda === "") {
            mensajeHistorial.textContent = "Por favor, ingresa un número de DNI o RUC válido.";
            mensajeHistorial.style.display = "block";
            return;
        }

        // Verificar si ese valor existe como clave dentro del objeto historiales
        if (historiales.hasOwnProperty(valorBusqueda)) {
            const url = historiales[valorBusqueda];
            window.open(url, '_blank');
            inputHistorial.value = "";
            mensajeHistorial.style.display = "none";
            mensajeHistorial.textContent = "";
        } else {
            // Si no existe
            mensajeHistorial.textContent = "No se encontró un historial para este documento. Verifica el número e intenta nuevamente.";
            mensajeHistorial.style.display = "block";
        }
    }

    // Listeners para el buscador de historial
    if (btnBuscarHistorial) {
        btnBuscarHistorial.addEventListener('click', realizarBusquedaHistorial);
    }

    if (inputHistorial) {
        inputHistorial.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                realizarBusquedaHistorial();
            }
        });
    }

    // 7. Lógica del Carrusel Deslizante de Equipo y Filosofía
    const philosophyTrack = document.getElementById('philosophy-track');
    const prevBtn = document.getElementById('phi-prev-btn');
    const nextBtn = document.getElementById('phi-next-btn');
    const dotsContainer = document.getElementById('phi-dots');
    
    if (philosophyTrack && prevBtn && nextBtn) {
        const cards = philosophyTrack.children;
        const dots = dotsContainer ? dotsContainer.children : [];
        const totalCards = cards.length;
        let currentIndex = 0;
        
        function updateSlider(index) {
            // Mantener el índice dentro de los límites
            if (index < 0) {
                index = totalCards - 1;
            } else if (index >= totalCards) {
                index = 0;
            }
            
            currentIndex = index;
            
            // Desplazar el track contenedor
            philosophyTrack.style.transform = `translateX(-${(100 / totalCards) * currentIndex}%)`;
            
            // Actualizar clases de estados de tarjetas e indicadores (dots)
            for (let i = 0; i < totalCards; i++) {
                if (i === currentIndex) {
                    cards[i].classList.add('active');
                    if (dots[i]) dots[i].classList.add('active');
                } else {
                    cards[i].classList.remove('active');
                    if (dots[i]) dots[i].classList.remove('active');
                }
            }
        }
        
        // Navegación con botón Anterior
        prevBtn.addEventListener('click', () => {
            updateSlider(currentIndex - 1);
        });
        
        // Navegación con botón Siguiente
        nextBtn.addEventListener('click', () => {
            updateSlider(currentIndex + 1);
        });
        
        // Navegación mediante clic en indicadores (dots) si existen
        if (dots.length > 0) {
            Array.from(dots).forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    updateSlider(index);
                });
            });
        }
        
        // Gestión segura del temporizador de Auto-deslizamiento (Autoplay)
        let autoPlayInterval = null;
        let isHoveredOrTouched = false;

        function startAutoPlay() {
            stopAutoPlay(); // Limpieza previa garantizada para evitar duplicación de intervalos
            autoPlayInterval = setInterval(() => {
                updateSlider(currentIndex + 1);
            }, 5000);
        }

        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }

        // Reiniciar intervalo al interactuar de forma manual (clic en botones)
        const resetInterval = () => {
            if (!isHoveredOrTouched) {
                startAutoPlay();
            }
        };

        // Iniciar el Autoplay por defecto
        startAutoPlay();

        // Pausa en Escritorio (Mouse) y Dispositivos Táctiles (Touch)
        const sliderContainer = philosophyTrack.closest('.philosophy-slider-container');
        if (sliderContainer) {
            // Eventos para pausar al poner el cursor encima y reanudar al retirarlo
            sliderContainer.addEventListener('mouseenter', () => {
                isHoveredOrTouched = true;
                stopAutoPlay();
            });
            sliderContainer.addEventListener('mouseleave', () => {
                isHoveredOrTouched = false;
                startAutoPlay();
            });

            // Eventos táctiles para dispositivos móviles
            sliderContainer.addEventListener('touchstart', () => {
                isHoveredOrTouched = true;
                stopAutoPlay();
            }, { passive: true });
            sliderContainer.addEventListener('touchend', () => {
                isHoveredOrTouched = false;
                startAutoPlay();
            }, { passive: true });
        }
        
        prevBtn.addEventListener('click', resetInterval);
        nextBtn.addEventListener('click', resetInterval);
        if (dots.length > 0) {
            Array.from(dots).forEach(dot => dot.addEventListener('click', resetInterval));
        }
    }

    // 8. Menú de navegación móvil (Hamburguesa)
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const headerMenuWrapper = document.getElementById('header-menu-wrapper');
    const navLinks = document.querySelectorAll('.header-menu-wrapper .nav-link');

    if (hamburgerBtn && headerMenuWrapper) {
        // Toggle menú al hacer clic en el botón
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburgerBtn.classList.toggle('active');
            headerMenuWrapper.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en cualquier enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                headerMenuWrapper.classList.remove('active');
            });
        });

        // Cerrar menú al hacer clic fuera de él
        document.addEventListener('click', (e) => {
            if (!headerMenuWrapper.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                hamburgerBtn.classList.remove('active');
                headerMenuWrapper.classList.remove('active');
            }
        });
    }

    // 9. Slider de Comparación de Imágenes (Antes y Después)
    const sliderControl = document.getElementById('slider-control');
    const imageBefore = document.getElementById('image-before');
    const sliderDivider = document.getElementById('slider-divider');

    if (sliderControl && imageBefore && sliderDivider) {
        const updateSliderPosition = () => {
            const value = sliderControl.value;
            // Recorte en tiempo real de la imagen superior ("Antes")
            imageBefore.style.clipPath = `polygon(0 0, ${value}% 0, ${value}% 100%, 0 100%)`;
            // Posicionamiento dinámico de la línea divisoria vertical
            sliderDivider.style.left = `${value}%`;
        };

        // Escuchar cambios interactivos
        sliderControl.addEventListener('input', updateSliderPosition);
        sliderControl.addEventListener('change', updateSliderPosition); // Asegurar actualización al soltar
        
        // Inicializar el estado de la barra en la posición del slider (50%)
        updateSliderPosition();
    }

    // 10. Envío Asíncrono del Formulario de Contacto (Formspree)
    const formContacto = document.getElementById('formulario-contacto');
    const contactoEstado = document.getElementById('contacto-estado');

    if (formContacto && contactoEstado) {
        formContacto.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const btnEnviar = formContacto.querySelector('button[type="submit"]');
            const originalBtnText = btnEnviar ? btnEnviar.innerText : 'Enviar Mensaje';

            if (btnEnviar) {
                btnEnviar.disabled = true;
                btnEnviar.innerText = 'Enviando...';
            }

            const data = new FormData(formContacto);

            try {
                const response = await fetch(formContacto.action, {
                    method: formContacto.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formContacto.reset();
                    contactoEstado.textContent = '¡Gracias por tu mensaje! Nos pondremos en contacto pronto.';
                    contactoEstado.classList.remove('error');
                    contactoEstado.classList.remove('oculto');
                    
                    // Ocultar después de 5 segundos
                    setTimeout(() => {
                        contactoEstado.classList.add('oculto');
                    }, 5000);
                } else {
                    const responseData = await response.json();
                    if (responseData && responseData.errors) {
                        contactoEstado.textContent = responseData.errors.map(error => error.message).join(', ');
                    } else {
                        contactoEstado.textContent = 'Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.';
                    }
                    contactoEstado.classList.add('error');
                    contactoEstado.classList.remove('oculto');
                }
            } catch (error) {
                contactoEstado.textContent = 'Ocurrió un problema de red. Por favor, verifica tu conexión e inténtalo de nuevo.';
                contactoEstado.classList.add('error');
                contactoEstado.classList.remove('oculto');
            } finally {
                if (btnEnviar) {
                    btnEnviar.disabled = false;
                    btnEnviar.innerText = originalBtnText;
                }
            }
        });
    }
});
