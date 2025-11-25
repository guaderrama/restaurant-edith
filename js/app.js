/**
 * RUEDA DEL MAR DE CORTÉS - Aplicación Principal
 * Los Cabos Experience: Sommelier IA + Ruleta Temática
 */

class RuedaDelMarApp {
    constructor() {
        // Estado de la aplicación
        this.state = {
            currentScreen: 'welcome-screen',
            language: 'es',
            currentQuestionIndex: 0,
            answers: {},
            selectedDrink: null,
            alternativeDrink: null,
            wheelPrize: null,
            waiterCode: null,
            spinsUsed: 0
        };

        // Referencias a elementos del DOM
        this.screens = {};
        this.wheel = null;

        // Inicializar
        this.init();
    }

    /**
     * Inicializa la aplicación
     */
    init() {
        // Cachear pantallas
        document.querySelectorAll('.screen').forEach(screen => {
            this.screens[screen.id] = screen;
        });

        // Inicializar sistema de traducción
        i18n.init();

        // Configurar event listeners
        this.setupEventListeners();

        // Inicializar sonidos
        WheelSounds.init();

        console.log('🐋 Rueda del Mar de Cortés inicializada');
    }

    /**
     * Configura todos los event listeners
     */
    setupEventListeners() {
        // Selector de idioma
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.currentTarget.dataset.lang;
                this.setLanguage(lang);
            });
        });

        // Botón de inicio
        document.querySelector('.start-btn')?.addEventListener('click', () => {
            this.goToScreen('sommelier-screen');
            this.loadQuestion(0);
        });

        // Botones de navegación hacia atrás
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget.dataset.target;
                if (target === 'sommelier-screen' && this.state.currentQuestionIndex > 0) {
                    this.loadQuestion(this.state.currentQuestionIndex - 1);
                } else {
                    this.goToScreen(target);
                }
            });
        });

        // Botón de ordenar bebida
        document.querySelector('.order-drink-btn')?.addEventListener('click', () => {
            this.orderDrink();
        });

        // Botón de ver alternativa
        document.querySelector('.see-alternative-btn')?.addEventListener('click', () => {
            this.showAlternative();
        });

        // Botón de intro a ruleta
        document.querySelector('.spin-intro-btn')?.addEventListener('click', () => {
            this.goToScreen('wheel-screen');
            this.initWheel();
        });

        // Botón de girar ruleta
        document.querySelector('.spin-btn')?.addEventListener('click', () => {
            this.spinWheel();
        });

        // Botón de confirmar resultado
        document.querySelector('.confirm-result-btn')?.addEventListener('click', () => {
            this.confirmOrder();
        });

        // Botón de compartir
        document.querySelector('.share-btn')?.addEventListener('click', () => {
            this.shareExperience();
        });

        // Botón de enviar contacto
        document.querySelector('.submit-contact-btn')?.addEventListener('click', () => {
            this.submitContact();
        });

        // Botón de jugar de nuevo
        document.querySelector('.restart-btn')?.addEventListener('click', () => {
            this.restart();
        });

        // Click en el canvas de la ruleta
        document.getElementById('wheel-canvas')?.addEventListener('click', () => {
            this.spinWheel();
        });
    }

    /**
     * Cambia el idioma de la aplicación
     */
    setLanguage(lang) {
        this.state.language = lang;
        i18n.setLanguage(lang);

        // Actualizar UI de botones de idioma
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.lang === lang);
        });
    }

    /**
     * Navega a una pantalla específica
     */
    goToScreen(screenId) {
        // Ocultar pantalla actual
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });

        // Mostrar nueva pantalla
        const targetScreen = this.screens[screenId];
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.state.currentScreen = screenId;

            // Scroll al inicio
            window.scrollTo(0, 0);
        }
    }

    /**
     * Carga una pregunta del sommelier
     */
    loadQuestion(index) {
        const questions = APP_DATA.questions[this.state.language];
        if (index >= questions.length) {
            // Todas las preguntas respondidas, generar recomendación
            this.generateRecommendation();
            return;
        }

        this.state.currentQuestionIndex = index;
        const question = questions[index];

        // Actualizar indicador de progreso
        document.querySelector('.progress-text').textContent = `${index + 1}/${questions.length}`;
        document.querySelector('.progress-fill').style.width = `${((index) / questions.length) * 100}%`;

        // Construir HTML de la pregunta
        const container = document.querySelector('.question-container');
        container.innerHTML = `
            <div class="question-card">
                <p class="question-text">${question.question}</p>
                <div class="options-grid">
                    ${question.options.map(opt => `
                        <button class="option-btn ${this.state.answers[question.id] === opt.id ? 'selected' : ''}"
                                data-question="${question.id}"
                                data-value="${opt.id}">
                            <span class="option-icon">${opt.icon}</span>
                            <span class="option-label">${opt.label}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // Event listeners para opciones
        container.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const questionId = e.currentTarget.dataset.question;
                const value = e.currentTarget.dataset.value;
                this.selectOption(questionId, value);
            });
        });
    }

    /**
     * Selecciona una opción de respuesta
     */
    selectOption(questionId, value) {
        this.state.answers[questionId] = value;

        // Feedback visual
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
            if (btn.dataset.value === value) {
                btn.classList.add('selected');
            }
        });

        // Avanzar a siguiente pregunta después de un breve delay
        setTimeout(() => {
            // Actualizar barra de progreso
            const questions = APP_DATA.questions[this.state.language];
            const progress = ((this.state.currentQuestionIndex + 1) / questions.length) * 100;
            document.querySelector('.progress-fill').style.width = `${progress}%`;

            this.loadQuestion(this.state.currentQuestionIndex + 1);
        }, 300);
    }

    /**
     * Genera la recomendación de bebida basada en las respuestas
     */
    generateRecommendation() {
        const recommendations = DrinkRecommender.getRecommendations(
            this.state.answers,
            this.state.language
        );

        this.state.selectedDrink = recommendations[0];
        this.state.alternativeDrink = recommendations[1];

        this.displayRecommendation(this.state.selectedDrink);
        this.goToScreen('recommendation-screen');
    }

    /**
     * Muestra la recomendación en pantalla
     */
    displayRecommendation(drink) {
        const lang = this.state.language;

        document.querySelector('.drink-name').textContent = drink.name[lang];
        document.querySelector('.drink-description').textContent = drink.description[lang];
        document.querySelector('.pairing-text').textContent = drink.pairing[lang];
        document.querySelector('.drink-emoji').textContent = drink.emoji;

        // Actualizar tip del sommelier
        const tips = {
            es: [
                'Ideal para ver el atardecer con vista al Arco.',
                'Marida perfecto con tu plato y la brisa del mar.',
                'Una elección excelente para el clima de Los Cabos.',
                'Perfecta combinación para tu selección de comida.'
            ],
            en: [
                'Ideal for watching the sunset with a view of the Arch.',
                'Pairs perfectly with your dish and the sea breeze.',
                'An excellent choice for the Los Cabos weather.',
                'Perfect combination for your food selection.'
            ]
        };
        const randomTip = tips[lang][Math.floor(Math.random() * tips[lang].length)];
        document.querySelector('.tip-text').textContent = randomTip;
    }

    /**
     * Muestra la bebida alternativa
     */
    showAlternative() {
        if (this.state.alternativeDrink) {
            // Intercambiar bebidas
            const temp = this.state.selectedDrink;
            this.state.selectedDrink = this.state.alternativeDrink;
            this.state.alternativeDrink = temp;

            this.displayRecommendation(this.state.selectedDrink);
            this.showToast('info', '🔄');
        }
    }

    /**
     * Confirma la orden de la bebida
     */
    orderDrink() {
        this.showToast('success', i18n.t('toast_drink_selected'));
        this.goToScreen('wheel-intro-screen');
    }

    /**
     * Inicializa la ruleta
     */
    initWheel() {
        if (!this.wheel) {
            this.wheel = new WheelOfFortune('wheel-canvas', APP_DATA.wheelSegments);
        } else {
            this.wheel.reset();
        }
    }

    /**
     * Gira la ruleta
     */
    spinWheel() {
        if (this.wheel && !this.wheel.isSpinning) {
            const spinBtn = document.querySelector('.spin-btn');
            spinBtn.classList.add('spinning');
            spinBtn.disabled = true;

            this.showToast('info', i18n.t('toast_spinning'));

            this.wheel.spin((result) => {
                this.state.wheelPrize = result;
                this.state.spinsUsed++;

                spinBtn.classList.remove('spinning');
                spinBtn.disabled = false;

                WheelSounds.playWin();

                // Mostrar resultado después de un pequeño delay
                setTimeout(() => {
                    this.showResult();
                }, 500);
            });
        }
    }

    /**
     * Muestra el resultado de la ruleta
     */
    showResult() {
        const prize = this.state.wheelPrize;
        const lang = this.state.language;

        // Generar código para el mesero
        this.state.waiterCode = generateWaiterCode();

        // Actualizar pantalla de resultado
        document.querySelector('.result-icon').textContent = prize.icon;
        document.querySelector('.result-title').textContent = prize.prize[lang];
        document.querySelector('.result-prize').textContent = prize.benefit[lang];
        document.querySelector('.drink-name-result').textContent = this.state.selectedDrink.name[lang];
        document.querySelector('.benefit-detail').textContent = prize.shortBenefit[lang];
        document.querySelector('.code-display').textContent = this.state.waiterCode;

        this.goToScreen('result-screen');

        // Animación de celebración
        document.querySelector('.result-icon-wrapper').classList.add('celebrate');
        setTimeout(() => {
            document.querySelector('.result-icon-wrapper').classList.remove('celebrate');
        }, 1000);
    }

    /**
     * Confirma el pedido final
     */
    confirmOrder() {
        this.goToScreen('final-screen');

        // Simular número de personas jugando
        const count = Math.floor(Math.random() * 50) + 200;
        document.querySelector('.social-proof').innerHTML =
            this.state.language === 'es'
                ? `<strong>${count}</strong> personas han jugado hoy`
                : `<strong>${count}</strong> people have played today`;
    }

    /**
     * Comparte la experiencia
     */
    shareExperience() {
        const drink = this.state.selectedDrink;
        const prize = this.state.wheelPrize;
        const lang = this.state.language;

        const shareText = lang === 'es'
            ? `🐋 Descubrí mi bebida ideal en Los Cabos: ${drink.name[lang]}! Gané: ${prize.prize[lang]} con la Rueda del Mar de Cortés 🌊`
            : `🐋 I discovered my ideal drink in Los Cabos: ${drink.name[lang]}! I won: ${prize.prize[lang]} with the Sea of Cortez Wheel 🌊`;

        if (navigator.share) {
            navigator.share({
                title: 'Rueda del Mar de Cortés',
                text: shareText,
                url: window.location.href
            }).catch(console.log);
        } else {
            // Fallback: copiar al portapapeles
            navigator.clipboard.writeText(shareText).then(() => {
                this.showToast('success', lang === 'es' ? '¡Copiado!' : 'Copied!');
            });
        }
    }

    /**
     * Envía la información de contacto
     */
    submitContact() {
        const input = document.querySelector('.phone-input');
        const contact = input.value.trim();

        if (contact) {
            // Aquí se enviaría al backend
            console.log('Contact saved:', contact);
            this.showToast('success', i18n.t('toast_contact_saved'));
            input.value = '';
        }
    }

    /**
     * Reinicia la experiencia
     */
    restart() {
        // Reiniciar estado
        this.state = {
            currentScreen: 'welcome-screen',
            language: this.state.language,
            currentQuestionIndex: 0,
            answers: {},
            selectedDrink: null,
            alternativeDrink: null,
            wheelPrize: null,
            waiterCode: null,
            spinsUsed: 0
        };

        // Reiniciar ruleta
        if (this.wheel) {
            this.wheel.reset();
        }

        // Volver al inicio
        this.goToScreen('welcome-screen');
    }

    /**
     * Muestra un toast de notificación
     */
    showToast(type, message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: '✓',
            error: '✕',
            info: 'ℹ'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toast);

        // Auto-remover después de 3 segundos
        setTimeout(() => {
            toast.style.animation = 'fadeIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new RuedaDelMarApp();
});
