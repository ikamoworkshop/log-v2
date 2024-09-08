import Experience from "../../Experience"

import * as THREE from 'three'
import gsap from "gsap"

import imagePlateVer from '../../Shaders/imagePlate/vertex.glsl'
import imagePlateFrag from '../../Shaders/imagePlate/fragment.glsl'

export default class AboutContent {
    constructor(){
        this.experience = new Experience()
        this.pageChange = this.experience.pageChange
        this.scroll = this.experience.scroll
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.cursor = this.experience.cursor

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
        this.aboutScene = new THREE.Scene()
        this.background = this.resources.items.background
        this.background.colorSpace = THREE.SRGBColorSpace
        this.aboutScene.background = this.background
    }

    setCamera(){
        this.camera = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 1, 15)
        this.camera.position.set(0, 0, 5)
        this.aboutScene.add(this.camera)
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
        this.images = []
        this.images = document.querySelectorAll('.about-container img')

        this.pageChange.on('pageChange', () => {
            this.images = document.querySelectorAll('.about-container img')
        })
    }

    setImage(){
        this.imageGroup = new THREE.Group()

        window.setTimeout(() => {
            this.images.forEach((image) => {
                const imageData = {}
    
                imageData.image = new Image()
                imageData.image.src = image.src

                imageData.image.onload = () => {
                    this.textureLoader.load(
                        imageData.image.src,
                        (texture) => {
                            imageData.imageMaterial.uniforms.uTexture.value = texture
                        }
                    )

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
                            uImageSize: new THREE.Uniform(new THREE.Vector2(imageData.imageBoundingData.width, imageData.imageBoundingData.height)),
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
                }
                
            })
    
            this.aboutScene.add(this.imageGroup)
    
            this.imageList.forEach((imageObject) => {
                imageObject.imageMesh.material.uniforms.uOpacity.value = 0
    
                gsap.to(imageObject.imageMesh.material.uniforms.uOpacity, {
                    value: .5,
                    duration: 4
                })
            })
        }, 500)

        this.pageChange.on('pageChange', () => {

            this.aboutScene.traverse((child) =>
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

            this.aboutScene.remove(this.imageGroup)
            this.imageGroup = new THREE.Group()

            if(this.pageChange.prevPage === '/about/' || this.pageChange.prevPage === '/about'){
                this.images.forEach((image) => {
                    const imageData = {}
    
                    imageData.image = new Image()
                    imageData.image.src = image.src
                    imageData.texture = this.textureLoader.load(imageData.image.src)
    
                    console.log(imageData.image.width, imageData.image.height)
                    
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
                            uImageSize: new THREE.Uniform(new THREE.Vector2(imageData.imageBoundingData.width, imageData.imageBoundingData.height)),
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
                this.aboutScene.add(this.imageGroup)
            }
        })
    }

    calculateUniteSize(distance){
        const vFov = this.camera.fov * Math.PI / 180
        const height = 2 * Math.tan(vFov / 2) * distance
        const width = height * this.camera.aspect
        return { width, height }
    }

    transition(){

        for(let i = 0 ; i < this.buttons.length; i++){
            this.buttons[i].addEventListener('click', () => {
                this.imageList.forEach(object => {
                    gsap.to(object.imageMesh.material.uniforms.uOpacity, {
                        value: 0,
                        duration: .5
                    })
                })
            })
        }

        this.pageChange.on('pageChange', () => {
            this.imageList.forEach((imageObject) => {
                imageObject.imageMesh.material.uniforms.uOpacity.value = 0

                gsap.to(imageObject.imageMesh.material.uniforms.uOpacity, {
                    value: .5,
                    duration: .5
                })
            })
        })

    }

    update(){
        this.imageList.forEach((imageObject) => {
            imageObject.imageMesh.position.x = ((this.camUnit.width / -2) - (imageObject.imageMesh.scale.x / -2)) + ((imageObject.imageBoundingData.left - this.scroll.scrollPosition) / this.sizes.width) * this.camUnit.width
        })
    }
}