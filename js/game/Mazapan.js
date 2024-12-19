class Mazapan {
    // Configuración de parámetros
    static REPULSION_RADIUS = 100;
    static VERLET_ITERATIONS = 1;
    static DAMPING = 0.9;
    static RETURN_STRENGTH = 0.025;

    constructor(element) {
        this.element = element;
        this.position = { x: 0, y: 0 };
        this.previousPosition = { x: 0, y: 0 };
        this.originalPosition = { x: 0, y: 0 };
        this.mousePosition = { x: 0, y: 0 };
        
        // Inicializar posición original cuando el elemento esté listo
        window.addEventListener('load', () => {
            this.originalPosition.x = this.element.offsetLeft;
            this.originalPosition.y = this.element.offsetTop;
            
            this.position = { ...this.originalPosition };
            this.previousPosition = { ...this.position };
        });

        // Configurar el seguimiento del ratón
        document.addEventListener('mousemove', (event) => {
            this.mousePosition.x = event.clientX;
            this.mousePosition.y = event.clientY;
            console.log("mouse:"+ this.mousePosition.x+", "+this.mousePosition.y)

        });
    }

    verletIntegrate() {
        const temp = { ...this.position };
        this.position.x += (this.position.x - this.previousPosition.x);
        this.position.y += (this.position.y - this.previousPosition.y);
        
        this.previousPosition.x = temp.x;
        this.previousPosition.y = temp.y;
    }

    getBounds() {
        const rect = this.element.getBoundingClientRect();
        return {
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom
        };
    }

    applyRepulsion(bounds) {
        const closestX = Math.max(bounds.left, Math.min(this.mousePosition.x, bounds.right));
        const closestY = Math.max(bounds.top, Math.min(this.mousePosition.y, bounds.bottom));

        const distanceX = this.mousePosition.x - closestX;
        const distanceY = this.mousePosition.y - closestY;
        const dist = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (dist <= Mazapan.REPULSION_RADIUS) {
            const repulsionFactorX = (Mazapan.REPULSION_RADIUS - distanceX) / Mazapan.REPULSION_RADIUS;
            const repulsionFactorY = (Mazapan.REPULSION_RADIUS - distanceY) / Mazapan.REPULSION_RADIUS;
            
            const repulsionXSign = this.mousePosition.x > this.position.x ? -1 : 1;
            const repulsionYSign = this.mousePosition.y > this.position.y ? -1 : 1;

            this.position.x += repulsionXSign * repulsionFactorX * 5;
            this.position.y += repulsionYSign * repulsionFactorY * 5;
        }

        return dist;
    }

    returnToOriginal(dist) {
        if (dist >= Mazapan.REPULSION_RADIUS) {
            this.position.x += (this.originalPosition.x - this.position.x) * Mazapan.RETURN_STRENGTH;
            this.position.y += (this.originalPosition.y - this.position.y) * Mazapan.RETURN_STRENGTH;
        }
    }

    applyDamping() {
        this.previousPosition.x = this.position.x + (this.previousPosition.x - this.position.x) * Mazapan.DAMPING;
        this.previousPosition.y = this.position.y + (this.previousPosition.y - this.position.y) * Mazapan.DAMPING;
    }

    updatePosition() {
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
    }

    animate() {
        this.verletIntegrate();
        
        for (let i = 0; i < Mazapan.VERLET_ITERATIONS; i++) {
            const bounds = this.getBounds();
            const dist = this.applyRepulsion(bounds);
            this.returnToOriginal(dist);
        }
        
        this.applyDamping();
        this.updatePosition();
    }
}