import Sizes from "./Utils/Sizes.js"
import Cursor from "./Utils/Cursor.js"
import Time from "./Utils/Time"
import Renderer from "./Renderer.js"
import Resources from "./Utils/Resources.js"
import PageChange from './Utils/PageChange.js'
import Scroll from "./Utils/Scroll.js"
import sources from './sources.js'

let instance = null;

export default class Experience{
    constructor(canvas){
        if(instance){
            return instance;
        }
        instance = this;

        // Global Access
        window.experience = this

        // Options
        this.canvas = canvas;

        // Setup
        this.sizes = new Sizes()
        this.pageChange = new PageChange()
        this.scroll = new Scroll()
        this.cursor = new Cursor()
        this.time = new Time()
        this.resources = new Resources(sources)
        this.renderer = new Renderer()

        // Reize Event
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time Tick Event
        this.time.on('tick', () => {
            this.update()
        })

    };

    resize(){
        this.renderer.resize()
    }

    update(){
        this.renderer.update()
    }
};