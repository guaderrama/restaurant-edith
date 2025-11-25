/**
 * RUEDA DEL MAR DE CORTÉS - Sistema de Ruleta
 * Ruleta temática de Los Cabos con animaciones
 */

class WheelOfFortune {
    constructor(canvasId, segments) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.segments = segments;
        this.numSegments = segments.length;
        this.anglePerSegment = (2 * Math.PI) / this.numSegments;
        this.currentAngle = 0;
        this.isSpinning = false;
        this.spinTimeout = null;
        this.spinAngleStart = 0;
        this.spinTime = 0;
        this.spinTimeTotal = 0;
        this.selectedSegment = null;
        this.onSpinEnd = null;

        // Configuración visual
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = Math.min(this.centerX, this.centerY) - 10;

        // Inicializar
        this.draw();
    }

    /**
     * Dibuja la ruleta completa
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dibujar cada segmento
        for (let i = 0; i < this.numSegments; i++) {
            this.drawSegment(i);
        }

        // Dibujar círculo central
        this.drawCenter();
    }

    /**
     * Dibuja un segmento individual
     */
    drawSegment(index) {
        const startAngle = this.currentAngle + index * this.anglePerSegment;
        const endAngle = startAngle + this.anglePerSegment;
        const segment = this.segments[index];

        // Fondo del segmento
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle);
        this.ctx.closePath();

        this.ctx.fillStyle = segment.color;
        this.ctx.fill();

        // Borde del segmento
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Dibujar icono/emoji
        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);
        const midAngle = startAngle + this.anglePerSegment / 2;
        this.ctx.rotate(midAngle);

        // Posición del icono (hacia el borde externo)
        const iconRadius = this.radius * 0.65;

        this.ctx.font = '32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // Sombra para el emoji
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;

        this.ctx.fillText(segment.icon, iconRadius, 0);

        this.ctx.restore();
    }

    /**
     * Dibuja el círculo central
     */
    drawCenter() {
        // Círculo exterior
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 35, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();

        // Borde dorado
        this.ctx.strokeStyle = '#fbb03b';
        this.ctx.lineWidth = 4;
        this.ctx.stroke();

        // Círculo interior
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 25, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#0a4d68';
        this.ctx.fill();

        // Emoji central (ballena)
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('🐋', this.centerX, this.centerY);
    }

    /**
     * Inicia el giro de la ruleta
     */
    spin(callback) {
        if (this.isSpinning) return;

        this.isSpinning = true;
        this.onSpinEnd = callback;

        // Ángulo inicial de giro (entre 10 y 15 vueltas completas)
        this.spinAngleStart = Math.random() * 10 + 10;
        this.spinTime = 0;
        this.spinTimeTotal = Math.random() * 3000 + 4000; // 4-7 segundos

        this.rotateWheel();
    }

    /**
     * Anima la rotación
     */
    rotateWheel() {
        this.spinTime += 30;

        if (this.spinTime >= this.spinTimeTotal) {
            this.stopRotateWheel();
            return;
        }

        // Easing function (desaceleración)
        const spinAngle = this.spinAngleStart - this.easeOut(
            this.spinTime,
            0,
            this.spinAngleStart,
            this.spinTimeTotal
        );

        this.currentAngle += (spinAngle * Math.PI / 180);
        this.draw();

        this.spinTimeout = setTimeout(() => this.rotateWheel(), 30);
    }

    /**
     * Función de easing para desaceleración suave
     */
    easeOut(t, b, c, d) {
        const ts = (t /= d) * t;
        const tc = ts * t;
        return b + c * (tc + -3 * ts + 3 * t);
    }

    /**
     * Detiene la ruleta y determina el ganador
     */
    stopRotateWheel() {
        clearTimeout(this.spinTimeout);
        this.isSpinning = false;

        // Calcular el segmento ganador
        // El puntero está arriba (en el ángulo -PI/2 o 3*PI/2)
        const degrees = this.currentAngle * 180 / Math.PI;
        const adjustedDegrees = ((degrees % 360) + 360) % 360;

        // El puntero está en la parte superior, ajustamos el cálculo
        const pointerAngle = 270; // Puntero arriba (en grados)
        const segmentDegrees = 360 / this.numSegments;

        let winningIndex = Math.floor(((pointerAngle - adjustedDegrees + 360) % 360) / segmentDegrees);
        winningIndex = winningIndex % this.numSegments;

        this.selectedSegment = this.segments[winningIndex];

        // Efecto visual de "settle"
        this.settleAnimation(() => {
            if (this.onSpinEnd) {
                this.onSpinEnd(this.selectedSegment);
            }
        });
    }

    /**
     * Animación de asentamiento final
     */
    settleAnimation(callback) {
        let bounces = 0;
        const maxBounces = 3;
        const bounceAmount = 0.02;

        const bounce = () => {
            if (bounces >= maxBounces) {
                callback();
                return;
            }

            const direction = bounces % 2 === 0 ? 1 : -1;
            this.currentAngle += direction * bounceAmount * (1 - bounces / maxBounces);
            this.draw();
            bounces++;

            setTimeout(bounce, 100);
        };

        bounce();
    }

    /**
     * Reinicia la ruleta
     */
    reset() {
        this.currentAngle = 0;
        this.selectedSegment = null;
        this.draw();
    }
}

// Efectos de sonido (simulados con Web Audio API)
const WheelSounds = {
    audioContext: null,

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    },

    playTick() {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    },

    playWin() {
        if (!this.audioContext) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                oscillator.frequency.value = freq;
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.3);
            }, i * 150);
        });
    }
};

// Exportar para uso global
window.WheelOfFortune = WheelOfFortune;
window.WheelSounds = WheelSounds;
