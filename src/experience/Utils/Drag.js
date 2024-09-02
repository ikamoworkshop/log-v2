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
        window.addEventListener('touchstart', (e) => {
            this.mousePosX = e.touches[0].clientX
            this.mousePosY = e.touches[0].clientY
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
                if(this.diffX <= 10 && this.diffY <= 10)
                this.allButtons[i].classList.add('temp-disabled')
            }
        })

        window.addEventListener('touchmove', (e) => {
            if(this.mousePosX === 0 && this.mousePosY === 0){
                return
            }

            this.diffX = this.mousePosX - e.touches[0].clientX
            this.diffY = this.mousePosY - e.touches[0].clientY

            this.allButtons = document.getElementsByTagName('a')
            for(let i = 0; i < this.allButtons.length; i++){
                this.allButtons[i].classList.add('temp-disabled')
            }
        })
    }

    mouseUp(){
        window.addEventListener('mouseup', () => {
            this.mousePosX = 0
            this.mousePosY = 0
            this.diffX = 0
            this.diffY = 0

            this.allButtons = document.getElementsByTagName('a')
            for(let i = 0; i < this.allButtons.length; i++){
                this.allButtons[i].classList.remove('temp-disabled')
            }
        })
        window.addEventListener('touchend', (e) => {
            this.mousePosX = 0
            this.mousePosY = 0
            this.diffX = 0
            this.diffY = 0

            this.allButtons = document.getElementsByTagName('a')
            for(let i = 0; i < this.allButtons.length; i++){
                this.allButtons[i].classList.remove('temp-disabled')
            }
        })
    }
}