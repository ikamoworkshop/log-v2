import Experience from "./Experience.js"
import Face from './World/Face.js'

import * as THREE from 'three'

export default class Renderer{
    constructor(){
        this.experience = new Experience()
        this.resources = this.experience.resources;
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes

        this.resources.on('ready', () => {
            // Setup
            this.face = new Face()
            this.scene = this.face.scene
            this.camera = this.face.camera
        })

        this.setInstance()
    };

    setInstance(){
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMappingExposure = 1.75
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.setClearColor(0, 0, 0)
        this.instance.setClearAlpha(1)
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRation)
    };

    resize(){
        this.face.resize()
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRation)
    }

    update(){
        if(this.face){
            this.face.update()
            this.instance.render(this.scene, this.camera)
        }
    }
}