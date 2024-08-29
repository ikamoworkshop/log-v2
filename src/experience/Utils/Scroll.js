import EventEmitter from "./EventEmitter"
import VirtualScroll from 'virtual-scroll'
import PageChange from './PageChange'

export default class Scroll extends EventEmitter {
    constructor(){
        super()

        this.scroller = new VirtualScroll()
        this.pageChange = new PageChange()

        this.scrollContainer = document.getElementById('scroll')

        this.scroll = 0
        this.scrollTarget = 0
        this.scrollPosition = 0
        this.infiniteScroll = 0
        this.containerSize = null

        if(this.scrollContainer){
            this.containerSize = this.scrollContainer.getBoundingClientRect().width
        }

        this.setScroller()
        window.requestAnimationFrame(() => {this.smoothScroll()})
    }

    setScroller(){
        this.scroller.on(event => {
            this.scrollTarget = - event.deltaY
        })
    }

    smoothScroll(){
        this.pageChange.on('pageChange', () => {
            this.scrollPosition = 0
            this.infiniteScroll = 0
        })

        if(!this.scrollContainer){
            this.scrollPosition = 0
            this.infiniteScroll = 0
        }
        // Reset Scroll
        this.scrollContainer = document.getElementById('scroll')
        
        if(this.scrollContainer){
            this.containerSize = this.scrollContainer.getBoundingClientRect().width
        }

        this.scroll -= (this.scroll - this.scrollTarget) * .1
        this.scrollPosition += this.scroll * 1.2
        this.infiniteScroll += this.scroll * 1.2
        this.scrollTarget = 0

        this.scrollPosition = Math.max(0, Math.min(this.scrollPosition, this.containerSize - window.innerWidth))

        window.requestAnimationFrame(() => {this.smoothScroll()})
    }
}