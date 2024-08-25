import Experienece from '../Experience'

export default class WaterTexture{
    constructor(options){
        this.size = 64
        this.radius = this.size * .1
        this.width = this.height = this.size

        this.points = []
        this.maxAge = 64

        if(options.debug){
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.radius = this.width * .05
        }

        this.initTexture()
        if(options.debug){
            document.body.append(this.canvas)
        }
    }

    initTexture(){
        this.canvas = document.createElement('canvas')
        this.canvas.id = 'WaterTexture'
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.ctx = this.canvas.getContext('2d')
        this.clear()
    }

    addPoint(point){
        

        this.points.push({
            x: point.x,
            y: point.y,
            age: 0
        })
    }

    drawPoint(point){
        let pos ={
            x: point.x * this.width,
            y: point.y * this.height
        }

        const radius = this.radius

        const ctx = this.ctx
        let intensity = 1.0
        intensity = 1.0 - point.age / this.maxAge

        let color = '255, 255, 255'

        let offset = this.width * .5
        ctx.shadowOffsetX = offset
        ctx.shadowOffsetY = offset
        ctx.shadowBlur = radius * 1
        ctx.shadowColor = `rgba(${color}, ${.2 * intensity})`

        this.ctx.beginPath()
        this.ctx.fillStyle = 'rgba(255, 0, 0, 1)'
        this.ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2)
        this.ctx.fill()
    }

    clear(){
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    update(){
        this.clear()
        this.points.forEach((point, i) => {
            point.age += 1
            if(point.age > this.maxAge){
                this.points.splice(i, 1)
            }
        })
        this.points.forEach(point => {
            this.drawPoint(point)
        })
    }
}