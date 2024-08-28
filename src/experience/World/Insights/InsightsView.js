import Experienece from '../../Experience'

import * as THREE from 'three'
import gsap from 'gsap'

import imagePlateVer from '../../Shaders/imagePlate/vertex.glsl'
import imagePlateFrag from '../../Shaders/imagePlate/fragment.glsl'

export default class InsightsView {
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

        this.imageList = []

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
        // this.scene.add(this.camera)
    }

    updateSize = (width, height) => {
        this.camUnit = this.calculateUniteSize(this.camera.position.z)
        const x = width / this.sizes.width
        const y = height / this.sizes.height

        if(!x || !y){
            return
        }

        const finalScaleX = this.camUnit.width * x
        const finalScaleY = this.camUnit.height * y

        return { finalScaleX, finalScaleY }
    }

    getImage(){
        this.images = document.querySelectorAll('.insight-container img')
        this.images.forEach((image) => {
            image.classList.add('gl')
        })

        this.pageChange.on('pageChange', () => {
            this.images = document.querySelectorAll('.insight-container img')
            this.images.forEach((image) => {
                image.classList.add('gl')
            })
        })
    }

    setImage(){
        this.imageGroup = new THREE.Group()

        this.pageChange.on('pageChange', () => {
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

            this.images.forEach((image) => {
                const imageData ={}
    
                imageData.image = new Image()
                imageData.image.src = image.src
                imageData.texture = this.textureLoader.load(imageData.image.src)
                imageData.imageBoundingData = image.getBoundingClientRect()
    
                this.camUnit = this.calculateUniteSize(this.camera.position.z)
                const x = imageData.imageBoundingData.width / this.sizes.width
                const y = imageData.imageBoundingData.height / this.sizes.height
    
                if(!x || !y){
                    return
                }
    
                imageData.finalScaleX = this.camUnit.width * x
                imageData.finalScaleY = this.camUnit.height * y
    
                imageData.imagePlate = new THREE.PlaneGeometry(1, 1, 1, 1)
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
                imageData.imageMesh = new THREE.Mesh(imageData.imagePlate, imageData.imageMaterial)
    
                imageData.imageMesh.scale.set(imageData.finalScaleX, imageData.finalScaleY, 0)
                
                imageData.imageMesh.position.y = (this.camUnit.height / 2) - (imageData.imageMesh.scale.y / 2)
                imageData.imageMesh.position.y -= (imageData.imageBoundingData.top / this.sizes.height) * this.camUnit.height
    
                this.imageList.push(imageData)
                this.imageGroup.add(imageData.imageMesh)
            })

            this.scene.add(this.imageGroup)
        })

        this.images.forEach((image) => {
            const imageData ={}

            imageData.image = new Image()
            imageData.image.src = image.src
            imageData.texture = this.textureLoader.load(imageData.image.src)
            imageData.imageBoundingData = image.getBoundingClientRect()

            this.camUnit = this.calculateUniteSize(this.camera.position.z)
            const x = imageData.imageBoundingData.width / this.sizes.width
            const y = imageData.imageBoundingData.height / this.sizes.height

            if(!x || !y){
                return
            }

            imageData.finalScaleX = this.camUnit.width * x
            imageData.finalScaleY = this.camUnit.height * y

            imageData.imagePlate = new THREE.PlaneGeometry(1, 1, 1, 1)
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
            imageData.imageMesh = new THREE.Mesh(imageData.imagePlate, imageData.imageMaterial)

            imageData.imageMesh.scale.set(imageData.finalScaleX, imageData.finalScaleY, 0)
            
            imageData.imageMesh.position.y = (this.camUnit.height / 2) - (imageData.imageMesh.scale.y / 2)
            imageData.imageMesh.position.y -= (imageData.imageBoundingData.top / this.sizes.height) * this.camUnit.height

            this.imageList.push(imageData)
            this.imageGroup.add(imageData.imageMesh)
        })

        this.scene.add(this.imageGroup)
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

    resize(){
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()

        this.camUnit = this.calculateUniteSize(this.camera.position.z)
        
        this.imageList.forEach((imageObject) => {
            imageObject.imageBoundingData = imageObject.image.getBoundingClientRect()
            imageObject.imageSize = this.updateSize(imageObject.imageBoundingData.width, imageObject.imageBoundingData.height)

            imageObject.finalScaleX = this.camUnit.width * x
            imageObject.finalScaleY = this.camUnit.height * y

            imageObject.imageMesh.scale.set(imageObject.finalScaleX, imageObject.finalScaleY, 0)
        })
    }

    update(){
        this.imageList.forEach((imageObject) => {
            imageObject.imageMesh.position.x = ((this.camUnit.width / -2) - (imageObject.imageMesh.scale.x / -2)) + ((imageObject.imageBoundingData.left - this.scroll.scrollPosition) / this.sizes.width) * this.camUnit.width
        })
    }
}