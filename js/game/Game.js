class Game {
    constructor() {
        // Estado del juego
        this.mazapanes_count = 0;
        this.misclick_count = 0;

        // Bind de los métodos
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseDownWindow = this.handleMouseDownWindow.bind(this);
        this.handleContextMenu = this.handleContextMenu.bind(this);
    }

    handleMouseDownWindow(event) {
        event.preventDefault();
        
        if (event.button != 0){
            return;
        }

        this.misclick_count++;
        console.log("misclic:"+this.misclick_count);

        updateDisplay()
    }

    handleMouseDown(event) {
        event.preventDefault();

        if (event.button != 0){
            return;
        }

        console.log("clic");

        this.mazapanes_count++;
        this.misclick_count--;
        console.log("clic:"+this.mazapanes_count);

        updateDisplay()
    }
    
    handleContextMenu(event) {
        event.preventDefault();
    }

    initializeEvents(mazapanElement) {
        // Event listener para el mazapán
        mazapanElement.addEventListener('mousedown', this.handleMouseDown);
        mazapanElement.addEventListener('contextmenu', this.handleContextMenu);
        
        // Event listener para la ventana
        window.addEventListener('contextmenu', this.handleContextMenu);
        window.addEventListener('mousedown', this.handleMouseDownWindow);
    }
     
    getScore() {
        return {
            mazapanes: Math.floor(this.mazapanes_count),
            misclicks: Math.floor(this.misclick_count)
        };
    }
}