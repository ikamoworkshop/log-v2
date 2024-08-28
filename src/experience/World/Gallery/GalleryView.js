import Experienece from '../../Experience'

import * as THREE from 'three'
import gsap from 'gsap'

import imagePlateVer from '../../Shaders/imagePlate/vertex.glsl'
import imagePlateFrag from '../../Shaders/imagePlate/fragment.glsl'

export default class GalleryView {
    constructor(){
        this.experience = new Experienece()
        this.pageChange = this.experience.pageChange
        this.scroll = this.experience.scroll
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.cursor = this.experience.cursor
        this.drag = this.experience.drag

        this.textureLoader = new THREE.TextureLoader()

        this.buttons = document.getElementsByTagName('a')

        this.setScene()
        this.setCamera()
        this.getImage()
        this.setImage()
        this.transition()
    }

    setScene(){
        this.scene = new THREE.Scene()
        this.background = this.resources.items.background
        this.background.colorSpace = THREE.SRGBColorSpace
        this.scene.background = this.background
    }

    setCamera(){
        this.camera = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 100)
        this.camera.position.set(0, 0, 5)
        this.scene.add(this.camera)
    }

    getImage(){
        this.pageImage = null
        this.pageImage = document.querySelectorAll('.gallery-view img')

        this.pageChange.on('pageChange', () => {
            this.pageImage = null
            this.pageImage = document.querySelectorAll('.gallery-view img')
        })
    }

    setImage(){
        this.imagePlaneGeometry = new THREE.PlaneGeometry(1, 1, 1, 1)
        this.imageGap = 2
        this.imageGroup = new THREE.Group()
        this.imageList = []
        this.camUnit = this.calculateUniteSize(this.camera.position.z)
        this.imageSizeMultiplier = .5
        
        this.pageImage.forEach((image, i) => {
            const imageData = {}

            imageData.image = new Image()
            imageData.image.src = image.src
            imageData.texture = this.textureLoader.load(imageData.image.src)
            imageData.imageBooundingData = image.getBoundingClientRect()

            const x = imageData.image.width / this.sizes.width
            const y = imageData.image.height / this.sizes.height

            if(!x || !y){
                return
            }

            imageData.finalScaleX = this.camUnit.width * x * this.imageSizeMultiplier
            imageData.finalScaleY = this.camUnit.height * y * this.imageSizeMultiplier

            imageData.imageMaterial = new THREE.ShaderMaterial({
                vertexShader: imagePlateVer,
                fragmentShader: imagePlateFrag,
                uniforms: {
                    uTexture: new THREE.Uniform(imageData.texture),
                    uOpacity: new THREE.Uniform(.5),
                    uImageSize: new THREE.Uniform(new THREE.Vector2(imageData.image.width, imageData.image.height)),
                    uPlaneSize: new THREE.Uniform(new THREE.Vector2(imageData.finalScaleX, imageData.finalScaleY))
                },
                transparent: true,
            })
            imageData.imageMesh = new THREE.Mesh(this.imagePlaneGeometry, imageData.imageMaterial)
            imageData.imageMesh.scale.set(imageData.finalScaleX - .5, imageData.finalScaleY, 0)

            imageData.imageMesh.position.x = imageData.finalScaleX * (i * this.imageGap)
            imageData.imageMesh.position.y = i % 3 - 1

            this.imageGroup.add(imageData.imageMesh)

            this.imageList.push(imageData)
        })
        this.imageGroup.position.x = -(this.pageImage.length * 1.5)
        this.scene.add(this.imageGroup)

        // PAGE CHANGE
        this.pageChange.on('pageChange', () => {
            this.buttons = document.getElementsByTagName('a')
            this.imageList = []

            this.scene.traverse((child) =>
                {
                    if(child instanceof THREE.Mesh){
                        child.geometry.dispose()
                        for(const key in child.material){
                            const value = child.material[key]
                            if(value && typeof value.dispose === 'function')
                            {
                                value.dispose();
                            }
                        }
                    }
            })

            this.scene.remove(this.imageGroup)
            this.imageGroup = new THREE.Group()

            this.pageImage.forEach((image, i) => {
                const imageData = {}

                imageData.image = new Image()
                imageData.image.src = image.src
                imageData.texture = this.textureLoader.load(imageData.image.src)
                imageData.imageBooundingData = image.getBoundingClientRect()
    
                const x = imageData.image.width / this.sizes.width
                const y = imageData.image.height / this.sizes.height
    
                if(!x || !y){
                    return
                }
    
                imageData.finalScaleX = this.camUnit.width * x * this.imageSizeMultiplier
                imageData.finalScaleY = this.camUnit.height * y * this.imageSizeMultiplier
    
                imageData.imageMaterial = new THREE.ShaderMaterial({
                    vertexShader: imagePlateVer,
                    fragmentShader: imagePlateFrag,
                    uniforms: {
                        uTexture: new THREE.Uniform(imageData.texture),
                        uOpacity: new THREE.Uniform(.2),
                        uImageSize: new THREE.Uniform(new THREE.Vector2(imageData.image.width, imageData.image.height)),
                        uPlaneSize: new THREE.Uniform(new THREE.Vector2(imageData.finalScaleX, imageData.finalScaleY))
                    },
                    transparent: true,
                })
                imageData.imageMesh = new THREE.Mesh(this.imagePlaneGeometry, imageData.imageMaterial)
                imageData.imageMesh.scale.set(imageData.finalScaleX, imageData.finalScaleY, 0)
    
                imageData.imageMesh.position.x = imageData.finalScaleX * (i * this.imageGap)
                imageData.imageMesh.position.y = i % 3 - 1
    
                this.imageGroup.add(imageData.imageMesh)
    
                this.imageList.push(imageData)
                
            })
            this.imageGroup.position.x = -(this.pageImage.length * 1.5)
            this.scene.add(this.imageGroup)
        })
    }

    calculateUniteSize(distance){
        const vFov = this.camera.fov * Math.PI / 180
        const height = 2 * Math.tan(vFov / 2) * distance
        const width = height * this.camera.aspect
        return { width, height }
    }

    transition(){

        this.pageChange.on('pageChange', () => {
            this.buttons = document.getElementsByTagName('a')

            this.imageList.forEach((object) => {

                object.imageMesh.material.uniforms.uOpacity.value = 0
                
                gsap.to(object.imageMesh.material.uniforms.uOpacity, {
                    value: .5,
                    duration: .5
                })
            })
        })

        for(let i = 0 ; i < this.buttons.length; i++){

            this.buttons[i].addEventListener('click', () => {

                this.imageList.forEach(object => {
                    object.imageMesh.material.uniforms.uOpacity.value = .5
                    gsap.to(object.imageMesh.material.uniforms.uOpacity, {
                        value: 0,
                        duration: .5
                    })
                })
            })
        }

    }

    removeItem(){
        this.pageChange.on('pageChange', () => {
            this.scene.remove(this.imageGroup)
        })
    }

    update(){
        this.buttons = document.getElementsByTagName('a')

        if(this.pageImage.length === this.imageList.length){
            this.imageList.forEach((object, i) => {
                object.imageMesh.position.x = ((- this.scroll.infiniteScroll / this.sizes.width * 8) + (object.imageMesh.position.x) + (object.finalScaleX * this.imageList.length * this.imageGap)) % (object.finalScaleX * this.imageList.length * this.imageGap)
                // console.log(this.imageList.length)
            })
        }
    }
}