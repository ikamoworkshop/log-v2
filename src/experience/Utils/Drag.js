import EventEmitter from "./EventEmitter"

export default class Drag extends EventEmitter {
    constructor(){
        super()
        this.mousePosX = 0
        this.mousePosY = 0
        this.diffX = 0
        this.diffY = 0

        this.mouseDown()
        this.mouseMove()
        this.mouseUp()
    }

    mouseDown(){
        window.addEventListener('mousedown', (e) => {
            this.mousePosX = e.clientX
            this.mousePosY = e.clientY
        })
    }

    mouseMove(){
        window.addEventListener('mousemove', (e) => {
            if(this.mousePosX === 0 && this.mousePosY === 0){
                return
            }

            this.diffX = this.mousePosX - e.clientX
            this.diffY = this.mousePosY - e.clientY

            this.allButtons = document.getElementsByTagName('a')
            for(let i = 0; i < this.allButtons.length; i++){
                this.allButtons[i].addEventListener('mousedown', (e) => {
                    e.preventDefault()
                })
            }
        })
    }

    mouseUp(){
        window.addEventListener('mouseup', () => {
            this.mousePosX = 0
            this.mousePosY = 0
            this.diffX = 0
            this.diffY = 0
        })
    }
}