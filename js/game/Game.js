class Game {
    constructor() {
        // Estado del juego
        this.mazapanes_count = 0;
        this.misclick_count = 0;
        this.currentClickRequirement = 'left';

        // Bind de los métodos
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleContextMenu = this.handleContextMenu.bind(this);
    }
    
    handleMouseDown(event) {
        event.preventDefault();
        const clickTypes = {
            'left': 0,
            'right': 2,
            'middle': 1
        };
        console.log("clic:"+event.button+"  expected:"+this.currentClickRequirement+" -"+clickTypes[this.currentClickRequirement]);

        if (event.button == clickTypes[this.currentClickRequirement]){
            this.misclick_count++;
            console.log("misclic:"+this.misclick_count);
            this.updateClickRequirement();
            updateDisplay()
        }
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
        window.addEventListener('mousedown', this.handleMouseDown);

    }
    
    updateClickRequirement() {
        const nextClick = {
            'left': 'right',
            'right': 'left',
        };
        
        this.currentClickRequirement = nextClick[this.currentClickRequirement];
        console.log("current:"+this.currentClickRequirement);
        return this.currentClickRequirement;
    }
    
    getScore() {
        return {
            mazapanes: Math.floor(this.mazapanes_count),
            misclicks: Math.floor(this.misclick_count)
        };
    }
}