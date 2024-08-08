import Experience from './Experience.js'
import Face from './World/Face.js'
import HomeContent from './World/Home/HomeContent.js'
import NotFound from './World/NotFound/NotFound.js'
import AboutContent from './World/About/AboutContent.js'
import PageChange from './Utils/PageChange'

import * as THREE from 'three'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'

export default class Renderer{
    constructor(){
        this.experience = new Experience()
        this.pageChange = new PageChange()
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
            this.aboutContent = new AboutContent()
            this.notFound = new NotFound()

            this.setInstance()
            this.setComposer()
            this.setPostProcessing()
        })
    }

    setInstance(){
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        })
        this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMappingExposure = 1.75
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRation)
        this.instance.outputColorSpace = THREE.SRGBColorSpace
    }

    setComposer(){
        this.composer = new EffectComposer(this.instance, this.renderTarget)
        this.composer.setSize(this.sizes.width, this.sizes.height)
        this.composer.setPixelRatio(this.sizes.pixelRatio)
    }

    setPostProcessing(){
        if(this.pageChange.prevPage === '/'){
            this.HomePass = new RenderPass(this.homeContent.HomeScene, this.homeContent.camera)
            this.composer.addPass(this.HomePass)
        } else if(this.pageChange.prevPage === '/about'){
            this.AboutPass = new RenderPass(this.aboutContent.aboutScene, this.aboutContent.camera)
            this.composer.addPass(this.AboutPass)
        }

        this.pageChange.on('pageChange', () => {
            if(this.pageChange.prevPage === '/'){
                this.composer.removePass(this.composer.passes[0])
                this.composer.reset(this.renderTarget)
                this.HomePass = new RenderPass(this.homeContent.HomeScene, this.homeContent.camera)
                this.composer.insertPass(this.HomePass, 0)
            } else if(this.pageChange.prevPage === '/about'){
                this.composer.removePass(this.composer.passes[0])
                this.composer.reset(this.renderTarget)
                this.AboutPass = new RenderPass(this.aboutContent.aboutScene, this.aboutContent.camera)
                this.composer.insertPass(this.AboutPass, 0)
            }
        })

        this.smaaPass = new SMAAPass()
        this.composer.addPass(this.smaaPass)

        this.gammaPass = new ShaderPass(GammaCorrectionShader)
        this.composer.addPass(this.gammaPass)
    }

    resize(){
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRation)
        this.composer.setSize(this.sizes.width, this.sizes.height)
        this.composer.setPixelRatio(this.sizes.pixelRatio)
        this.face.resize()
    }

    update(){

        if(this.face){
            this.face.update()
            this.homeContent.update()
            this.notFound.update()

            if(this.pageChange.prevPage === '/'){
                this.composer.render(this.homeContent.HomeScene, this.homeContent.camera)
                this.renderTarget.texture.colorSpace = THREE.SRGBColorSpace
                this.renderPlaneMaterial.uniforms.uTexture.value = this.renderTarget.texture
            } else if(this.pageChange.prevPage === '/about'){
                this.composer.render(this.aboutContent.aboutScene, this.aboutContent.camera)
                this.renderTarget.texture.colorSpace = THREE.SRGBColorSpace
                this.renderPlaneMaterial.uniforms.uTexture.value = this.renderTarget.texture
            }

            this.instance.clear()
            this.instance.render(this.scene, this.camera)
            
        }
    }
}