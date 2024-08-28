import Experience from './Experience.js'
import Face from './World/Face.js'
import HomeContent from './World/Home/HomeContent.js'
import NotFound from './World/NotFound/NotFound.js'
import AboutContent from './World/About/AboutContent.js'
import GalleryTop from './World/Gallery/GalleryTop.js'
import GalleryView from './World/Gallery/GalleryView.js'
import InsightsTop from './World/Insights/InsightsTop.js'
import InsightsView from './World/Insights/InsightsView.js'

import * as THREE from 'three'
import gsap from 'gsap'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import WaterTexture from './Postprocessing/WaterTexture.js'
import { WaterEffect } from './Postprocessing/WaterEffect.js'

import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export default class Renderer{
    constructor(){
        this.experience = new Experience()
        this.time = this.experience.time
        this.pageChange = this.experience.pageChange
        this.resources = this.experience.resources;
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes

        this.buttons = document.getElementsByTagName('a')

        this.galleryList = this.resources.galleryList
        this.gallerySlugList = []
        this.galleryList.forEach(item => {
            this.gallerySlugList.push("/gallery/" + item.slug.current)
        })

        this.insightsList = this.resources.insightsList
        this.insightsSlugList = []
        this.insightsList.forEach(item => {
            this.insightsSlugList.push("/insights/" + item.slug.current)
        })

        this.resources.on('ready', () => {
            // Setup
            this.face = new Face()
            this.scene = this.face.scene
            this.camera = this.face.camera
            this.renderTarget = this.face.renderTarget
            this.renderPlaneMaterial = this.face.renderPlaneMaterial

            this.waterTexter = new WaterTexture({debug: false})
            window.addEventListener('mousemove', this.onMouseMove.bind(this))

            this.homeContent = new HomeContent()
            this.aboutContent = new AboutContent()
            this.galleryTop = new GalleryTop()
            this.galleryView = new GalleryView()
            this.insightsTop = new InsightsTop()
            this.insightsView = new InsightsView()

            this.notFound = new NotFound()

            this.setInstance()
            this.setComposer()
            this.setPostProcessing()
            this.transition()
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

    onMouseMove(e){
        const point = {
            x: e.clientX / this.sizes.width,
            y: e.clientY / this.sizes.height
        }

        this.waterTexter.addPoint(point)
    }

    setPostProcessing(){
        this.renderPass = new RenderPass(this.homeContent.HomeScene, this.homeContent.camera)
        if(this.pageChange.prevPage === '/'){
            this.renderPass.scene = this.homeContent.HomeScene
            this.renderPass.camera = this.homeContent.camera
            this.composer.addPass(this.renderPass)
        } 

        else if(this.pageChange.prevPage === '/about'){
            this.renderPass.scene = this.aboutContent.aboutScene
            this.renderPass.camera = this.aboutContent.camera
            this.composer.addPass(this.renderPass)
        } 

        else if(this.pageChange.prevPage === '/gallery'){
            this.renderPass.scene = this.galleryTop.scene
            this.renderPass.camera = this.galleryTop.camera
            this.composer.addPass(this.renderPass)
        } 

        else if (this.gallerySlugList.includes(this.pageChange.prevPage)){
            this.renderPass.scene = this.galleryView.scene
            this.renderPass.camera = this.galleryView.camera
            this.composer.addPass(this.renderPass)
        }

        else if (this.pageChange.prevPage === '/insights'){
            this.renderPass.scene = this.insightsTop.scene
            this.renderPass.camera = this.insightsTop.camera
            this.composer.addPass(this.renderPass)
        }

        else if (this.insightsSlugList.includes(this.pageChange.prevPage)){
            this.renderPass.scene = this.insightsView.scene
            this.renderPass.camera = this.insightsView.camera
            this.composer.addPass(this.renderPass)
        }
        
        else if(this.pageChange.prevPage !== '/' && this.pageChange.prevPage !== '/about' && this.pageChange.prevPage !== '/gallery') {
            this.renderPass.scene = this.notFound.notFoundScene
            this.renderPass.camera = this.notFound.camera
            this.composer.addPass(this.renderPass)
        }

        this.pageChange.on('pageChange', () => {
            if(this.pageChange.prevPage === '/'){
                this.instance.clear()
                this.renderPass.scene = this.homeContent.HomeScene
                this.renderPass.camera = this.homeContent.camera
                document.body.style.cursor = 'default'
            }
            
            else if(this.pageChange.prevPage === '/about'){
                this.instance.clear()
                this.renderPass.scene = this.aboutContent.aboutScene
                this.renderPass.camera = this.aboutContent.camera
                document.body.style.cursor = 'default'
            }
            
            else if(this.pageChange.prevPage === '/gallery'){
                this.instance.clear()
                this.renderPass.scene = this.galleryTop.scene
                this.renderPass.camera = this.galleryTop.camera
                document.body.style.cursor = 'grab'
            } 

            else if (this.gallerySlugList.includes(this.pageChange.prevPage)){
                this.instance.clear()
                this.renderPass.scene = this.galleryView.scene
                this.renderPass.camera = this.galleryView.camera
                document.body.style.cursor = 'default'
            }

            else if(this.pageChange.prevPage === '/insights'){
                this.instance.clear()
                this.renderPass.scene = this.insightsTop.scene
                this.renderPass.camera = this.insightsTop.camera
                document.body.style.cursor = 'default'
            }

            else if (this.insightsSlugList.includes(this.pageChange.prevPage)){
                this.instance.clear()
                this.renderPass.scene = this.insightsView.scene
                this.renderPass.camera = this.insightsView.camera
                document.body.style.cursor = 'default'
            }
            
            else if(this.pageChange.prevPage !== '/' && this.pageChange.prevPage !== '/about' && this.pageChange.prevPage !== '/gallery') {
                this.instance.clear()
                this.renderPass.scene = this.notFound.notFoundScene
                this.renderPass.camera = this.notFound.camera
                document.body.style.cursor = 'default'
            }
        })

        this.waterPass = new ShaderPass(WaterEffect)
        this.waterPass.uniforms.uTexture.value = this.waterTexter.texture
        this.waterPass.uniforms.uBlueStrength.value = .0
        this.waterPass.uniforms.uBendStrength.value = .0
        this.composer.addPass(this.waterPass)

        this.smaaPass = new SMAAPass()
        this.composer.addPass(this.smaaPass)

        this.outputPass = new OutputPass()
        this.composer.addPass(this.outputPass)
    }

    transition(){
        this.pageChange.on('pageChange', () => {
            gsap.to(this.waterPass.uniforms.uBlueStrength, {
                value: 0,
                duration: 1
            })
            gsap.to(this.waterPass.uniforms.uBendStrength, {
                value: 0,
                duration: 1
            })
        })

        for(let i = 0 ; i < this.buttons.length; i++){
            this.buttons[i].addEventListener('click', () => {
                gsap.to(this.waterPass.uniforms.uBlueStrength, {
                    value: .01,
                    duration: .5
                })
                gsap.to(this.waterPass.uniforms.uBendStrength, {
                    value: .05,
                    duration: .5
                })
            })
        }
    }

    resize(){
        window.location.reload();

        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRation)

        this.composer.setSize(this.sizes.width, this.sizes.height)
        this.composer.setPixelRatio(this.sizes.pixelRatio)

        this.face.resize()
        this.homeContent.resize()
        this.aboutContent.resize()
        // this.galleryTop.resize()
        // this.galleryView.resize()
        // this.insightsTop.resize()
        this.insightsView.resize()
        this.NotFound.resize()
    }

    update(){
        this.buttons = document.getElementsByTagName('a')

        if(this.face){
            this.waterTexter.update()

            this.face.update()
            this.homeContent.update()
            this.aboutContent.update()
            this.galleryTop.update()
            this.galleryView.update()
            this.insightsTop.update()
            this.insightsView.update()
            this.notFound.update()

            this.waterPass.uniforms.uTime.value = this.time.elapsed

            if(this.pageChange.prevPage === '/'){
                this.composer.render(this.homeContent.HomeScene, this.homeContent.camera)
                this.renderTarget.texture.colorSpace = THREE.SRGBColorSpace
                this.renderPlaneMaterial.uniforms.uTexture.value = this.renderTarget.texture
            }
            
            else if(this.pageChange.prevPage === '/about'){
                this.composer.render(this.aboutContent.aboutScene, this.aboutContent.camera)
                this.renderTarget.texture.colorSpace = THREE.SRGBColorSpace
                this.renderPlaneMaterial.uniforms.uTexture.value = this.renderTarget.texture
            }
            
            else if(this.pageChange.prevPage === '/gallery'){
                this.composer.render(this.galleryTop.scene, this.galleryTop.camera)
                this.renderTarget.texture.colorSpace = THREE.SRGBColorSpace
                this.renderPlaneMaterial.uniforms.uTexture.value = this.renderTarget.texture
            }

            else if (this.gallerySlugList.includes(this.pageChange.prevPage)){
                this.composer.render(this.galleryView.scene, this.galleryView.camera)
                this.renderTarget.texture.colorSpace = THREE.SRGBColorSpace
                this.renderPlaneMaterial.uniforms.uTexture.value = this.renderTarget.texture
            } 

            else if(this.pageChange.prevPage === '/insights'){
                this.composer.render(this.insightsTop.scene, this.insightsTop.camera)
                this.renderTarget.texture.colorSpace = THREE.SRGBColorSpace
                this.renderPlaneMaterial.uniforms.uTexture.value = this.renderTarget.texture
            }

            else if (this.insightsSlugList.includes(this.pageChange.prevPage)){
                this.composer.render(this.insightsView.scene, this.insightsView.camera)
                this.renderTarget.texture.colorSpace = THREE.SRGBColorSpace
                this.renderPlaneMaterial.uniforms.uTexture.value = this.renderTarget.texture
            } 
            
            else if(this.pageChange.prevPage !== '/' && this.pageChange.prevPage !== '/about' && this.pageChange.prevPage !== '/gallery'){
                this.composer.render(this.notFound.notFoundScene, this.notFound.camera)
                this.renderTarget.texture.colorSpace = THREE.SRGBColorSpace
                this.renderPlaneMaterial.uniforms.uTexture.value = this.renderTarget.texture
            }

            this.instance.clear()
            this.instance.render(this.scene, this.camera)
        }
    }
}