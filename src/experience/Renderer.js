import Experience from "./Experience.js"
import Face from './World/Face.js'
import HomeContent from "./World/Home/HomeContent.js"

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
            this.renderTarget = this.face.renderTarget
            this.renderPlaneMaterial = this.face.renderPlaneMaterial

            this.homeContent = new HomeContent()
        })

        this.setInstance()
    };

    setInstance(){
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        })
        this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMappingExposure = 1.75
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.setClearAlpha(0)
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRation)
    };

    resize(){
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRation)
        this.face.resize()
    }

    update(){
        if(this.face){
            this.instance.setRenderTarget(this.renderTarget)
            this.instance.clear();

            this.instance.render(this.homeContent.HomeScene, this.homeContent.camera)
            this.renderPlaneMaterial.uniforms.uTexture.value = this.renderTarget.texture
            this.instance.setRenderTarget(null)

            this.instance.clear();
            this.instance.render(this.scene, this.camera)

            this.face.update()
            this.homeContent.update()
        }
    }
}