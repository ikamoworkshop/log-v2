import EventEmitter from "./EventEmitter"

export default class PageChange extends EventEmitter{
    constructor(){
        super()
        this.prevPage = null
        this.currentPage = null

        window.requestAnimationFrame(() => {
            this.pageChange()
        })
    }
    pageChange(){
        this.currentPage = window.location.pathname
        if(this.currentPage !== this.prevPage){
            this.prevPage = this.currentPage
            this.trigger('pageChange')
        }

        window.requestAnimationFrame(() => {
            this.pageChange()
        })
    }
}