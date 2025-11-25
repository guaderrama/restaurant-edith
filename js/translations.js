/**
 * RUEDA DEL MAR DE CORTÉS - Sistema de Traducciones
 * Soporte bilingüe: Español / English
 */

const TRANSLATIONS = {
    es: {
        // Pantalla de bienvenida
        welcome_message: 'Descubre tu bebida ideal inspirada en el mar y el desierto de Baja California Sur',
        start_experience: 'Comenzar Experiencia',

        // Sommelier
        sommelier_title: 'Sommelier IA',
        sommelier_greeting: 'Soy tu sommelier de Los Cabos',

        // Recomendación
        your_recommendation: 'Tu Recomendación',
        order_drink: 'Pedir esta bebida',
        see_alternative: 'Ver alternativa',
        perfect_pairing: 'Marida perfecto con tu plato y el atardecer frente al mar.',

        // Intro ruleta
        drink_confirmed: '¡Bebida Confirmada!',
        wheel_intro_text: 'Ahora gira la <strong>Rueda de la Ballena</strong> para desbloquear un beneficio especial sobre tu bebida.',
        spin_wheel: 'Girar la Rueda',

        // Ruleta
        whale_wheel: 'Rueda de la Ballena',
        tap_to_spin: 'Toca para girar',
        spin: '¡Girar!',

        // Resultado
        your_drink: 'Tu bebida:',
        your_benefit: 'Tu beneficio:',
        show_waiter: 'Muestra este código al mesero:',
        confirm_order: 'Confirmar Pedido',
        share_experience: 'Compartir Experiencia',

        // Final
        thank_you: '¡Gracias!',
        enjoy_drink: 'Tu mesero preparará tu bebida con el beneficio especial.',
        stay_connected: '¿Quieres recibir recomendaciones y descuentos exclusivos?',
        send: 'Enviar',
        play_again: 'Jugar de nuevo',
        people_playing: '<strong>247</strong> personas han jugado hoy',

        // Toasts
        toast_drink_selected: '¡Bebida seleccionada!',
        toast_spinning: 'Girando la rueda...',
        toast_prize_won: '¡Felicidades! Has ganado:',
        toast_contact_saved: '¡Gracias! Te enviaremos promociones especiales.',
        toast_error: 'Algo salió mal. Intenta de nuevo.',

        // Misc
        loading: 'Cargando...',
        next: 'Siguiente',
        back: 'Atrás'
    },

    en: {
        // Welcome screen
        welcome_message: 'Discover your ideal drink inspired by the sea and desert of Baja California Sur',
        start_experience: 'Start Experience',

        // Sommelier
        sommelier_title: 'AI Sommelier',
        sommelier_greeting: "I'm your Los Cabos sommelier",

        // Recommendation
        your_recommendation: 'Your Recommendation',
        order_drink: 'Order this drink',
        see_alternative: 'See alternative',
        perfect_pairing: 'Pairs perfectly with your dish and the sunset by the sea.',

        // Wheel intro
        drink_confirmed: 'Drink Confirmed!',
        wheel_intro_text: 'Now spin the <strong>Whale Wheel</strong> to unlock a special benefit for your drink.',
        spin_wheel: 'Spin the Wheel',

        // Wheel
        whale_wheel: 'Whale Wheel',
        tap_to_spin: 'Tap to spin',
        spin: 'Spin!',

        // Result
        your_drink: 'Your drink:',
        your_benefit: 'Your benefit:',
        show_waiter: 'Show this code to your waiter:',
        confirm_order: 'Confirm Order',
        share_experience: 'Share Experience',

        // Final
        thank_you: 'Thank You!',
        enjoy_drink: 'Your waiter will prepare your drink with the special benefit.',
        stay_connected: 'Want to receive exclusive recommendations and discounts?',
        send: 'Send',
        play_again: 'Play again',
        people_playing: '<strong>247</strong> people have played today',

        // Toasts
        toast_drink_selected: 'Drink selected!',
        toast_spinning: 'Spinning the wheel...',
        toast_prize_won: 'Congratulations! You won:',
        toast_contact_saved: 'Thank you! We\'ll send you special promotions.',
        toast_error: 'Something went wrong. Try again.',

        // Misc
        loading: 'Loading...',
        next: 'Next',
        back: 'Back'
    }
};

// Sistema de traducción
const i18n = {
    currentLang: 'es',

    /**
     * Establece el idioma actual
     */
    setLanguage(lang) {
        this.currentLang = lang;
        this.updateUI();
        localStorage.setItem('rueda_lang', lang);
    },

    /**
     * Obtiene una traducción
     */
    t(key) {
        return TRANSLATIONS[this.currentLang][key] || TRANSLATIONS['es'][key] || key;
    },

    /**
     * Actualiza todos los elementos con data-i18n
     */
    updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);
            if (translation) {
                el.innerHTML = translation;
            }
        });

        // Actualizar placeholder de inputs
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            if (translation) {
                el.placeholder = translation;
            }
        });

        // Actualizar atributo lang del documento
        document.documentElement.lang = this.currentLang;
    },

    /**
     * Inicializa el sistema de traducción
     */
    init() {
        // Intentar recuperar idioma guardado
        const savedLang = localStorage.getItem('rueda_lang');
        if (savedLang && TRANSLATIONS[savedLang]) {
            this.currentLang = savedLang;
        } else {
            // Detectar idioma del navegador
            const browserLang = navigator.language.split('-')[0];
            this.currentLang = TRANSLATIONS[browserLang] ? browserLang : 'es';
        }
        this.updateUI();
    }
};

// Exportar para uso global
window.TRANSLATIONS = TRANSLATIONS;
window.i18n = i18n;
