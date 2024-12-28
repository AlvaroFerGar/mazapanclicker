class Mazapan {
    static REPULSION_RADIUS = 300;
    static VERLET_ITERATIONS = 2;
    static DAMPING = 0.9;
    static RETURN_STRENGTH = 0.005;
    static MOUSE_JUMP_THRESHOLD = 10;
    static MOUSE_JUMP_TIME = 100;
    static JUMP_REPULSION_RADIUS = 150;

    constructor(element) {
        this.element = element;
        this.window = window;
        this.position = { x: 0, y: 0 };
        this.previousPosition = { x: 0, y: 0 };
        this.anchorPosition = { x: 0, y: 0 };
        this.mousePosition = { x: 0, y: 0 };
        this.previousMousePosition = { x: 0, y: 0 };
        this.lastMouseMoveTime = 0;
        
        window.addEventListener('load', () => {
            this.updateAnchorToCenter();
            
            this.position = { ...this.anchorPosition };
            this.previousPosition = { ...this.position };
            this.previousMousePosition = { ...this.mousePosition };
        });

        window.addEventListener('resize', () => this.updateAnchorToCenter());


        document.addEventListener('mousemove', (event) => {
            this.previousMousePosition = { ...this.mousePosition };
            this.mousePosition.x = event.clientX;
            this.mousePosition.y = event.clientY;
            
            const currentTime = performance.now();
            const timeDelta = currentTime - this.lastMouseMoveTime;
            this.lastMouseMoveTime = currentTime;

            
            const jumpDistance = Math.sqrt(
                Math.pow(this.mousePosition.x - this.previousMousePosition.x, 2) +
                Math.pow(this.mousePosition.y - this.previousMousePosition.y, 2)
            );
            
            if (timeDelta < Mazapan.MOUSE_JUMP_TIME && jumpDistance > Mazapan.MOUSE_JUMP_THRESHOLD) {
                console.log("jump");
                this.handleMouseJump(jumpDistance);
            }
        });
    }

    updateAnchorToCenter () {
        const windowWidth = this.window.innerWidth;
        const windowHeight = this.window.innerHeight;
        const elementWidth = this.element.offsetWidth;
        const elementHeight = this.element.offsetHeight;

        // Calcula la posición para centrar el elemento.
        const centerX = (windowWidth - elementWidth) / 2;
        const centerY = (windowHeight - elementHeight) / 2;

        // Guarda la posición original.
        this.anchorPosition = { x: centerX, y: centerY };
    }

    handleMouseJump(jumpDistance) {
        const steps = Math.ceil(jumpDistance / 20);
        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const intermediatePoint = {
                x: this.previousMousePosition.x + (this.mousePosition.x - this.previousMousePosition.x) * t,
                y: this.previousMousePosition.y + (this.mousePosition.y - this.previousMousePosition.y) * t
            };
            
            this.applyRepulsion(this.mousePosition, Mazapan.JUMP_REPULSION_RADIUS);
        }
    }

    
    isPathBlocked(pathOrigin, pathEnd, obstacleCenter, obstacleRadius) {
        // Vector from p1 to p2
        const dx = pathEnd.x - pathOrigin.x;
        const dy = pathEnd.y - pathOrigin.y;
        
        // Vector from p1 to circle center
        const cx = obstacleCenter.x - pathOrigin.x;
        const cy = obstacleCenter.y - pathOrigin.y;
        
        // Length of segment squared
        const lengthSquared = dx * dx + dy * dy;
        
        // Dot product of segment and circle-to-p1 vector
        const dot = (cx * dx + cy * dy) / lengthSquared;
        
        // Find closest point on segment to circle center
        const closestX = pathOrigin.x + dx * Math.max(0, Math.min(1, dot));
        const closestY = pathOrigin.y + dy * Math.max(0, Math.min(1, dot));
        
        // Check if closest point is within radius
        const distanceSquared = Math.pow(closestX - obstacleCenter.x, 2) + Math.pow(closestY - obstacleCenter.y, 2);
        return distanceSquared <= obstacleRadius * obstacleRadius;
    }

    applyRepulsion(point = this.mousePosition, radius = Mazapan.REPULSION_RADIUS) {
        const bounds = this.getBounds();
        const closestX = Math.max(bounds.left, Math.min(point.x, bounds.right));
        const closestY = Math.max(bounds.top, Math.min(point.y, bounds.bottom));
    
        // Vector desde el ratón al punto más cercano del objeto
        const distanceX = closestX - point.x;
        const distanceY = closestY - point.y;
        
        // Distancia al cuadrado (evitamos sqrt innecesario)
        const distanceSquared = distanceX * distanceX + distanceY * distanceY;
        
        // Distancia mínima para evitar divisiones por cero y fuerzas extremas
        const MIN_DISTANCE = 1.0;
        
        // Si estamos dentro del radio de repulsión
        if (distanceSquared < radius * radius) {
            // Calculamos la distancia real, pero con un mínimo para evitar explosiones
            const distance = Math.max(Math.sqrt(distanceSquared), MIN_DISTANCE);
            
            // Vector de dirección normalizado
            const dirX = distanceX / distance;
            const dirY = distanceY / distance;
            
            // Función de fuerza no lineal que se vuelve más fuerte cuando más cerca
            // Usamos una función exponencial inversa para mayor control
            const normalizedDist = distance / radius;
            const strength = 10 * Math.exp(-normalizedDist * 2);
            
            // Calculamos la repulsión final
            const repulsionX = dirX * strength;
            const repulsionY = dirY * strength;
            
            // Aplicamos la fuerza con un factor de velocidad máxima
            const MAX_REPULSION = 15;
            this.position.x += Math.min(Math.max(repulsionX, -MAX_REPULSION), MAX_REPULSION);
            this.position.y += Math.min(Math.max(repulsionY, -MAX_REPULSION), MAX_REPULSION);
            
            // Actualizamos la posición anterior con amortiguación
            const DAMPING = 0.3;
            this.previousPosition.x += repulsionX * DAMPING;
            this.previousPosition.y += repulsionY * DAMPING;
        }
    }

    verletIntegrate() {
        //Añade inercia
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

    returnToAnchor() {

        if(this.isPathBlocked(this.position, this.anchorPosition, this.mousePosition, Mazapan.REPULSION_RADIUS*1.2)){
            // Movimiento lento hacia la posición anclada
            const smallStep = 0.01; // Factor de avance lento
            const tentativePosition = {
                x: this.position.x + (this.anchorPosition.x - this.position.x) * smallStep,
                y: this.position.y + (this.anchorPosition.y - this.position.y) * smallStep
            };

            // Verificar que el avance no esté dentro del radio de repulsión del mouse
            const distanceToMouse = Math.sqrt(
                Math.pow(tentativePosition.x - this.mousePosition.x, 2) +
                Math.pow(tentativePosition.y - this.mousePosition.y, 2)
            );

            if (distanceToMouse > Mazapan.REPULSION_RADIUS*1.5) {
                this.position = tentativePosition;
            }
        }
        else{

            this.position.x += (this.anchorPosition.x - this.position.x) * Mazapan.RETURN_STRENGTH;
            this.position.y += (this.anchorPosition.y - this.position.y) * Mazapan.RETURN_STRENGTH;
        }
    }

    applyDamping() {
        this.previousPosition.x = this.position.x + (this.previousPosition.x - this.position.x) * Mazapan.DAMPING;
        this.previousPosition.y = this.position.y + (this.previousPosition.y - this.position.y) * Mazapan.DAMPING;
    }

    updatePosition() {
        const margin = 500;
        const windowWidth = this.window.innerWidth;
        const windowHeight = this.window.innerHeight;
    
        // La posicion actual y la previa se limita si ha superado las dimensiones de la ventana en algún eje
        this.position.x = Math.max(-margin, Math.min(this.position.x, windowWidth + margin));
        this.position.y = Math.max(-margin, Math.min(this.position.y, windowHeight + margin));
        this.previousPosition.x = Math.max(-margin, Math.min(this.previousPosition.x, windowWidth + margin));
        this.previousPosition.y = Math.max(-margin, Math.min(this.previousPosition.y, windowHeight + margin));
    


        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
    }

    animate() {
        this.verletIntegrate();
        
        for (let i = 0; i < Mazapan.VERLET_ITERATIONS; i++) {
            const bounds = this.getBounds();
            const closestX = Math.max(bounds.left, Math.min(this.mousePosition.x, bounds.right));
            const closestY = Math.max(bounds.top, Math.min(this.mousePosition.y, bounds.bottom));
    
            const distanceX = this.mousePosition.x - closestX;
            const distanceY = this.mousePosition.y - closestY;
            const dist = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            if(dist<Mazapan.REPULSION_RADIUS){
                this.applyRepulsion();
            }
            else
                this.returnToAnchor(dist);
        }
        this.applyDamping();
        this.updatePosition();
    }
}