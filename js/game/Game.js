class Game {
    constructor() {
        // Estado del juego
        this.mazapanes_count = 0;
        this.misclick_count = 0;

        // Bind de los métodos
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleContextMenu = this.handleContextMenu.bind(this);
    }

    handleMouseDown(event) {
        event.preventDefault();
        
        if (event.button != 0){
            return;
        }
    
        // Si el click fue en el mazapán, no contar como misclick
        if (event.target.id === 'mazapan') {
            this.mazapanes_count++;
            console.log("clic:"+this.mazapanes_count);
        } else {
            this.misclick_count++;
            console.log("misclic:"+this.misclick_count);
        }

        updateDisplay()
    }
    
    handleContextMenu(event) {
        event.preventDefault();
    }

    initializeEvents(mazapanElement) {
        mazapanElement.addEventListener('contextmenu', this.handleContextMenu);
    
        window.addEventListener('contextmenu', this.handleContextMenu);
        window.addEventListener('mousedown', this.handleMouseDown);
    }
     
    getScore() {
        return {
            mazapanes: Math.floor(this.mazapanes_count),
            misclicks: Math.floor(this.misclick_count)
        };
    }
}