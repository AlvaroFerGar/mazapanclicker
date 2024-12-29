// Clase AnimationManager para manejar todas las animaciones del juego
class AnimationManager {
    constructor(mazapan, arrow) {
        this.mazapan = mazapan;
        this.arrow = arrow;
    }

    animate() {
        // Animar el mazapán
        this.mazapan.animate();
        // Animar la flecha indicadora
        this.updateArrowPosition();
        // Continuar el ciclo de animación
        requestAnimationFrame(() => this.animate());
    }

    updateArrowPosition() {
        const { innerWidth, innerHeight } = window;
        const { x, y, width, height } = this.mazapan.element.getBoundingClientRect();
        
        const positionX = Math.min(Math.max(0, this.mazapan.position.x), innerWidth - 10);
        const positionY = Math.min(Math.max(0, this.mazapan.position.y), innerHeight - 10);

        if (y + height < 0) {
            this.arrow.updatePosition(
                x + width < 0 ? 'top-left' : x > innerWidth ? 'top-right' : 'top',
                x + width < 0 ? 0 : x > innerWidth ? innerWidth - 10 : positionX,
                0
            );
        } else if (y > innerHeight) {
            this.arrow.updatePosition(
                x + width < 0 ? 'bottom-left' : x > innerWidth ? 'bottom-right' : 'bottom',
                x + width < 0 ? 0 : x > innerWidth ? innerWidth - 10 : positionX,
                innerHeight - 10
            );
        } else if (x + width < 0) {
            this.arrow.updatePosition('left', 0, positionY);
        } else if (x > innerWidth) {
            this.arrow.updatePosition('right', innerWidth - 10, positionY);
        } else {
            this.arrow.hide();
        }
    }
}