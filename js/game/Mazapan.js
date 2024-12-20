class Mazapan {
    // Configuración de parámetros
    static REPULSION_RADIUS = 100;
    static VERLET_ITERATIONS = 1;
    static DAMPING = 0.9;
    static RETURN_STRENGTH = 0.025;
    static MOUSE_JUMP_THRESHOLD = 10; // Umbral para detectar saltos del ratón
    static JUMP_REPULSION_RADIUS = 150; // Radio de repulsión aumentado para saltos

    constructor(element) {
        this.element = element;
        this.position = { x: 0, y: 0 };
        this.previousPosition = { x: 0, y: 0 };
        this.originalPosition = { x: 0, y: 0 };
        this.mousePosition = { x: 0, y: 0 };
        this.previousMousePosition = { x: 0, y: 0 };
        this.lastMouseMoveTime = 0;
        
        window.addEventListener('load', () => {
            this.originalPosition.x = this.element.offsetLeft;
            this.originalPosition.y = this.element.offsetTop;
            
            this.position = { ...this.originalPosition };
            this.previousPosition = { ...this.position };
            this.previousMousePosition = { ...this.mousePosition };
        });

        document.addEventListener('mousemove', (event) => {
            this.previousMousePosition = { ...this.mousePosition };
            this.mousePosition.x = event.clientX;
            this.mousePosition.y = event.clientY;
            
            // Calcular la velocidad del movimiento del ratón
            const currentTime = performance.now();
            const timeDelta = currentTime - this.lastMouseMoveTime;
            this.lastMouseMoveTime = currentTime;
            
            // Calcular la distancia del salto
            const jumpDistance = Math.sqrt(
                Math.pow(this.mousePosition.x - this.previousMousePosition.x, 2) +
                Math.pow(this.mousePosition.y - this.previousMousePosition.y, 2)
            );
            
            // Si detectamos un salto grande, crear puntos intermedios
            if (jumpDistance > Mazapan.MOUSE_JUMP_THRESHOLD) {
                console.log("JUMP")
                this.handleMouseJump(jumpDistance);
            }
        });
    }

    handleMouseJump(jumpDistance) {
        // Crear puntos intermedios para simular la trayectoria
        const steps = Math.ceil(jumpDistance / 20); // Un punto cada 20px
        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const intermediatePoint = {
                x: this.previousMousePosition.x + (this.mousePosition.x - this.previousMousePosition.x) * t,
                y: this.previousMousePosition.y + (this.mousePosition.y - this.previousMousePosition.y) * t
            };
            
            // Aplicar repulsión desde este punto intermedio
            this.applyRepulsionFromPoint(intermediatePoint, Mazapan.JUMP_REPULSION_RADIUS);
        }
    }

    applyRepulsionFromPoint(point, radius) {
        const bounds = this.getBounds();
        const closestX = Math.max(bounds.left, Math.min(point.x, bounds.right));
        const closestY = Math.max(bounds.top, Math.min(point.y, bounds.bottom));

        const distanceX = point.x - closestX;
        const distanceY = point.y - closestY;
        const dist = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        //if (dist <= radius) {
            const repulsionFactorX = (radius - distanceX) / radius;
            const repulsionFactorY = (radius - distanceY) / radius;
            
            const repulsionXSign = point.x > this.position.x ? -1 : 1;
            const repulsionYSign = point.y > this.position.y ? -1 : 1;

            this.position.x += repulsionXSign * repulsionFactorX * 5;
            this.position.y += repulsionYSign * repulsionFactorY * 5;
        //}

        return dist;
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