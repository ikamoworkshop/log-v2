import EventEmitter from "./EventEmitter.js";

export default class Cursor extends EventEmitter{
    constructor(){
        super()

        // Setup
        this.cursorX = 0
        this.cursorY = 0

        // Cursor Movement
        window.addEventListener('mousemove', (e) => {
            this.cursorX = e.clientX
            this.cursorY = e.clientY
        })
    }
}