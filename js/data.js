/**
 * RUEDA DEL MAR DE CORTÉS - Datos de la Aplicación
 * Bebidas, preguntas del sommelier y premios de la ruleta
 */

const APP_DATA = {
    // Configuración general
    config: {
        maxSpinsPerTable: 2,
        restaurantName: "Restaurant Edith",
        location: "Los Cabos, BCS"
    },

    // Preguntas del Sommelier IA
    questions: {
        es: [
            {
                id: 'food',
                question: '¿Qué pediste de comer?',
                options: [
                    { id: 'seafood', label: 'Mariscos', icon: '🦐' },
                    { id: 'meat', label: 'Carne', icon: '🥩' },
                    { id: 'vegetarian', label: 'Vegetariano', icon: '🥗' },
                    { id: 'snacks', label: 'Snacks', icon: '🍿' }
                ]
            },
            {
                id: 'flavor',
                question: '¿Qué te antoja más?',
                options: [
                    { id: 'fresh', label: 'Fresco', icon: '🧊' },
                    { id: 'creamy', label: 'Cremoso', icon: '🥛' },
                    { id: 'smoky', label: 'Ahumado', icon: '🔥' },
                    { id: 'citric', label: 'Cítrico', icon: '🍋' }
                ]
            },
            {
                id: 'strength',
                question: '¿Qué tanto alcohol quieres?',
                options: [
                    { id: 'light', label: 'Suave', icon: '🌸' },
                    { id: 'medium', label: 'Medio', icon: '⚖️' },
                    { id: 'strong', label: 'Fuerte', icon: '💪' },
                    { id: 'none', label: 'Sin alcohol', icon: '🍃' }
                ]
            },
            {
                id: 'sweetness',
                question: '¿Prefieres sabores más dulces o secos?',
                options: [
                    { id: 'sweet', label: 'Dulce', icon: '🍯' },
                    { id: 'balanced', label: 'Balanceado', icon: '⚖️' },
                    { id: 'dry', label: 'Seco', icon: '🌵' },
                    { id: 'bitter', label: 'Amargo', icon: '🍂' }
                ]
            }
        ],
        en: [
            {
                id: 'food',
                question: 'What did you order to eat?',
                options: [
                    { id: 'seafood', label: 'Seafood', icon: '🦐' },
                    { id: 'meat', label: 'Meat', icon: '🥩' },
                    { id: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
                    { id: 'snacks', label: 'Snacks', icon: '🍿' }
                ]
            },
            {
                id: 'flavor',
                question: 'What are you craving?',
                options: [
                    { id: 'fresh', label: 'Fresh', icon: '🧊' },
                    { id: 'creamy', label: 'Creamy', icon: '🥛' },
                    { id: 'smoky', label: 'Smoky', icon: '🔥' },
                    { id: 'citric', label: 'Citrus', icon: '🍋' }
                ]
            },
            {
                id: 'strength',
                question: 'How strong do you want it?',
                options: [
                    { id: 'light', label: 'Light', icon: '🌸' },
                    { id: 'medium', label: 'Medium', icon: '⚖️' },
                    { id: 'strong', label: 'Strong', icon: '💪' },
                    { id: 'none', label: 'Non-alcoholic', icon: '🍃' }
                ]
            },
            {
                id: 'sweetness',
                question: 'Do you prefer sweet or dry flavors?',
                options: [
                    { id: 'sweet', label: 'Sweet', icon: '🍯' },
                    { id: 'balanced', label: 'Balanced', icon: '⚖️' },
                    { id: 'dry', label: 'Dry', icon: '🌵' },
                    { id: 'bitter', label: 'Bitter', icon: '🍂' }
                ]
            }
        ]
    },

    // Catálogo de bebidas con reglas de recomendación
    drinks: [
        {
            id: 'margarita-maracuya',
            name: {
                es: 'Margarita de Maracuyá',
                en: 'Passion Fruit Margarita'
            },
            emoji: '🍹',
            description: {
                es: 'Tequila reposado, licor de naranja, maracuyá fresco y un toque de sal de chile.',
                en: 'Reposado tequila, orange liqueur, fresh passion fruit and a touch of chili salt.'
            },
            pairing: {
                es: 'Marida perfecto con mariscos y ceviche',
                en: 'Pairs perfectly with seafood and ceviche'
            },
            tags: ['seafood', 'citric', 'medium', 'balanced', 'fresh'],
            priority: 10, // Alta prioridad para rotación
            margin: 'high'
        },
        {
            id: 'mezcal-pepino',
            name: {
                es: 'Mezcal Pepino del Desierto',
                en: 'Desert Cucumber Mezcal'
            },
            emoji: '🥒',
            description: {
                es: 'Mezcal artesanal, pepino fresco, limón y un toque de agave.',
                en: 'Artisanal mezcal, fresh cucumber, lime and a touch of agave.'
            },
            pairing: {
                es: 'Ideal con carnes asadas y sabores ahumados',
                en: 'Ideal with grilled meats and smoky flavors'
            },
            tags: ['meat', 'smoky', 'strong', 'dry', 'fresh'],
            priority: 9,
            margin: 'high'
        },
        {
            id: 'paloma-rosa',
            name: {
                es: 'Paloma Rosa del Atardecer',
                en: 'Pink Sunset Paloma'
            },
            emoji: '🌅',
            description: {
                es: 'Tequila blanco, toronja rosa, lima y agua mineral con un rim de sal de hibisco.',
                en: 'Blanco tequila, pink grapefruit, lime and sparkling water with hibiscus salt rim.'
            },
            pairing: {
                es: 'Perfecto para snacks y botanas',
                en: 'Perfect for snacks and appetizers'
            },
            tags: ['snacks', 'citric', 'light', 'balanced', 'fresh'],
            priority: 8,
            margin: 'medium'
        },
        {
            id: 'mojito-mango',
            name: {
                es: 'Mojito de Mango Los Cabos',
                en: 'Los Cabos Mango Mojito'
            },
            emoji: '🥭',
            description: {
                es: 'Ron blanco, mango fresco de la región, hierbabuena y un splash de soda.',
                en: 'White rum, fresh local mango, mint and a splash of soda.'
            },
            pairing: {
                es: 'Delicioso con platillos vegetarianos',
                en: 'Delicious with vegetarian dishes'
            },
            tags: ['vegetarian', 'fresh', 'medium', 'sweet'],
            priority: 7,
            margin: 'medium'
        },
        {
            id: 'carajillo-cortés',
            name: {
                es: 'Carajillo del Mar de Cortés',
                en: 'Sea of Cortez Carajillo'
            },
            emoji: '☕',
            description: {
                es: 'Licor 43, espresso y un twist de naranja flameada.',
                en: 'Licor 43, espresso and a flamed orange twist.'
            },
            pairing: {
                es: 'Perfecto después de cualquier comida',
                en: 'Perfect after any meal'
            },
            tags: ['meat', 'snacks', 'creamy', 'strong', 'bitter'],
            priority: 8,
            margin: 'high'
        },
        {
            id: 'piña-colada-baja',
            name: {
                es: 'Piña Colada Baja Style',
                en: 'Baja Style Piña Colada'
            },
            emoji: '🍍',
            description: {
                es: 'Ron añejo, piña asada, crema de coco y un toque de canela.',
                en: 'Aged rum, roasted pineapple, coconut cream and a touch of cinnamon.'
            },
            pairing: {
                es: 'Combina con mariscos y pescados',
                en: 'Pairs with seafood and fish'
            },
            tags: ['seafood', 'creamy', 'medium', 'sweet'],
            priority: 6,
            margin: 'medium'
        },
        {
            id: 'sangria-desierto',
            name: {
                es: 'Sangría del Desierto',
                en: 'Desert Sangria'
            },
            emoji: '🍷',
            description: {
                es: 'Vino tinto mexicano, frutas de temporada, brandy y un toque de canela.',
                en: 'Mexican red wine, seasonal fruits, brandy and a touch of cinnamon.'
            },
            pairing: {
                es: 'Excelente con carnes y quesos',
                en: 'Excellent with meats and cheeses'
            },
            tags: ['meat', 'vegetarian', 'balanced', 'medium', 'sweet'],
            priority: 5,
            margin: 'high'
        },
        {
            id: 'michelada-ballena',
            name: {
                es: 'Michelada de la Ballena',
                en: 'Whale Michelada'
            },
            emoji: '🐋',
            description: {
                es: 'Cerveza artesanal local, clamato, limón, salsa picante y especias secretas.',
                en: 'Local craft beer, clamato, lime, hot sauce and secret spices.'
            },
            pairing: {
                es: 'Ideal con mariscos y ceviches',
                en: 'Ideal with seafood and ceviches'
            },
            tags: ['seafood', 'snacks', 'citric', 'light', 'dry'],
            priority: 7,
            margin: 'high'
        },
        {
            id: 'agua-fresca-jamaica',
            name: {
                es: 'Agua Fresca de Jamaica Premium',
                en: 'Premium Hibiscus Water'
            },
            emoji: '🌺',
            description: {
                es: 'Infusión de jamaica orgánica, miel de agave y un toque de jengibre.',
                en: 'Organic hibiscus infusion, agave honey and a touch of ginger.'
            },
            pairing: {
                es: 'Refrescante con cualquier platillo',
                en: 'Refreshing with any dish'
            },
            tags: ['vegetarian', 'snacks', 'none', 'sweet', 'fresh'],
            priority: 6,
            margin: 'high'
        },
        {
            id: 'limonada-cactus',
            name: {
                es: 'Limonada de Cactus',
                en: 'Cactus Lemonade'
            },
            emoji: '🌵',
            description: {
                es: 'Limonada natural con extracto de nopal, menta y chía.',
                en: 'Natural lemonade with nopal extract, mint and chia.'
            },
            pairing: {
                es: 'Perfecto para el calor de Los Cabos',
                en: 'Perfect for the Los Cabos heat'
            },
            tags: ['vegetarian', 'seafood', 'none', 'balanced', 'fresh', 'citric'],
            priority: 5,
            margin: 'medium'
        }
    ],

    // Segmentos de la ruleta - Premios temáticos de Los Cabos
    wheelSegments: [
        {
            id: 'whale',
            name: {
                es: 'Ballena Saltando',
                en: 'Jumping Whale'
            },
            icon: '🐋',
            color: '#0a4d68',
            prize: {
                es: 'Ronda Ballena',
                en: 'Whale Round'
            },
            benefit: {
                es: 'Si pides una segunda bebida igual, la casa te regala un topping especial (flores comestibles, garnish premium o sal ahumada).',
                en: 'If you order a second identical drink, the house gives you a special topping (edible flowers, premium garnish or smoked salt).'
            },
            shortBenefit: {
                es: 'Topping premium en 2da ronda',
                en: 'Premium topping on 2nd round'
            },
            businessLogic: 'Empuja segunda ronda, no regala la primera'
        },
        {
            id: 'cactus',
            name: {
                es: 'Cactus del Desierto',
                en: 'Desert Cactus'
            },
            icon: '🌵',
            color: '#5d8a66',
            prize: {
                es: 'Upgrade del Desierto',
                en: 'Desert Upgrade'
            },
            benefit: {
                es: 'Tu bebida se sirve en versión premium (mejor tequila/mezcal) por solo $30 pesos más.',
                en: 'Your drink is served in premium version (better tequila/mezcal) for only $2 more.'
            },
            shortBenefit: {
                es: 'Upgrade premium por $30',
                en: 'Premium upgrade for $2'
            },
            businessLogic: 'Sube margen mejorando la categoría del destilado'
        },
        {
            id: 'wave',
            name: {
                es: 'Ola del Mar',
                en: 'Sea Wave'
            },
            icon: '🌊',
            color: '#088395',
            prize: {
                es: 'Ola Refrescante',
                en: 'Refreshing Wave'
            },
            benefit: {
                es: 'Agrega totopos con salsas de la casa al pedir tu bebida.',
                en: 'Add chips with house salsas when ordering your drink.'
            },
            shortBenefit: {
                es: 'Totopos con salsas gratis',
                en: 'Free chips with salsas'
            },
            businessLogic: 'Sube percepción de valor, más tiempo en mesa → más consumo'
        },
        {
            id: 'sun',
            name: {
                es: 'Sol del Atardecer',
                en: 'Sunset Sun'
            },
            icon: '☀️',
            color: '#ff6b35',
            prize: {
                es: 'Atardecer 2x1',
                en: 'Sunset 2x1'
            },
            benefit: {
                es: 'Si otro en tu mesa pide la MISMA bebida en los próximos 10 minutos, la segunda tiene 25% de descuento.',
                en: 'If someone else at your table orders the SAME drink in the next 10 minutes, the second one gets 25% off.'
            },
            shortBenefit: {
                es: '25% desc. en 2da bebida igual',
                en: '25% off on 2nd identical drink'
            },
            businessLogic: 'Empuja más bebidas en la mesa, no que el mismo cliente pague menos'
        },
        {
            id: 'boat',
            name: {
                es: 'Panga de Pescador',
                en: 'Fishing Boat'
            },
            icon: '🚣',
            color: '#c4704f',
            prize: {
                es: 'Travesía Premium',
                en: 'Premium Journey'
            },
            benefit: {
                es: 'Si eliges nuestra versión "Signature de la Casa" en lugar de tu bebida, te damos un mini descuento de 15%.',
                en: 'If you choose our "House Signature" version instead of your drink, you get a mini 15% discount.'
            },
            shortBenefit: {
                es: '15% en versión Signature',
                en: '15% off Signature version'
            },
            businessLogic: 'Empuja versión más cara de la bebida'
        },
        {
            id: 'fish',
            name: {
                es: 'Marlín Dorado',
                en: 'Golden Marlin'
            },
            icon: '🐟',
            color: '#fbb03b',
            prize: {
                es: 'Catch del Día',
                en: 'Catch of the Day'
            },
            benefit: {
                es: '15% de descuento en un postre o entrada sugerida si lo pides junto con la bebida.',
                en: '15% discount on a suggested dessert or appetizer if you order it with your drink.'
            },
            shortBenefit: {
                es: '15% en postre/entrada',
                en: '15% off dessert/appetizer'
            },
            businessLogic: 'Cross-sell de comida con alta rentabilidad'
        },
        {
            id: 'shell',
            name: {
                es: 'Caracol de Arena',
                en: 'Sand Shell'
            },
            icon: '🐚',
            color: '#e8d5b7',
            textColor: '#4a4a68',
            prize: {
                es: 'Casi lo logras',
                en: 'Almost there'
            },
            benefit: {
                es: 'No ganaste premio grande, pero desbloqueaste una recomendación secreta del sommelier y un 10% de descuento para tu próxima visita.',
                en: 'No big prize, but you unlocked a secret sommelier recommendation and 10% off your next visit.'
            },
            shortBenefit: {
                es: '10% próxima visita',
                en: '10% off next visit'
            },
            businessLogic: 'No regala ahora, siembra segunda visita'
        },
        {
            id: 'logo',
            name: {
                es: 'Logo del Restaurant',
                en: 'Restaurant Logo'
            },
            icon: '⭐',
            color: '#f7931e',
            prize: {
                es: 'Jackpot Cabo',
                en: 'Cabo Jackpot'
            },
            benefit: {
                es: '¡Felicidades! Tu bebida incluye un upgrade premium GRATIS + foto souvenir digital de Los Cabos.',
                en: 'Congratulations! Your drink includes a FREE premium upgrade + digital Los Cabos souvenir photo.'
            },
            shortBenefit: {
                es: 'Upgrade gratis + foto',
                en: 'Free upgrade + photo'
            },
            businessLogic: 'Mezcla experiencia + bebida, costo bajo, valor percibido alto'
        }
    ]
};

// Sistema de recomendación de bebidas (Sommelier IA)
const DrinkRecommender = {
    /**
     * Calcula la puntuación de una bebida basada en las respuestas del usuario
     */
    calculateScore(drink, answers) {
        let score = 0;

        // Verificar coincidencias de tags
        Object.values(answers).forEach(answer => {
            if (drink.tags.includes(answer)) {
                score += 2;
            }
        });

        // Bonus por prioridad (bebidas que el restaurante quiere rotar)
        score += drink.priority * 0.5;

        // Bonus por margen
        if (drink.margin === 'high') score += 3;
        if (drink.margin === 'medium') score += 1;

        // Bonus por hora del día (simulado)
        const hour = new Date().getHours();
        if (hour >= 17 && hour <= 20) {
            // Hora del atardecer - priorizar bebidas "Instagrammables"
            if (['paloma-rosa', 'margarita-maracuya', 'mojito-mango'].includes(drink.id)) {
                score += 2;
            }
        }
        if (hour >= 21) {
            // Noche - priorizar bebidas más fuertes
            if (drink.tags.includes('strong')) {
                score += 1;
            }
        }

        return score;
    },

    /**
     * Obtiene las mejores recomendaciones
     */
    getRecommendations(answers, lang = 'es') {
        const scoredDrinks = APP_DATA.drinks.map(drink => ({
            ...drink,
            score: this.calculateScore(drink, answers)
        }));

        // Ordenar por puntuación descendente
        scoredDrinks.sort((a, b) => b.score - a.score);

        // Retornar las 2 mejores opciones
        return scoredDrinks.slice(0, 2);
    }
};

// Generar código único para el mesero
function generateWaiterCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Exportar para uso global
window.APP_DATA = APP_DATA;
window.DrinkRecommender = DrinkRecommender;
window.generateWaiterCode = generateWaiterCode;
