import Experience from "../../Experience"

import * as THREE from 'three'

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

        this.imageGroup = []

        this.setScene()
        this.setCamera()
        this.getImage()
        this.setImage()
    }

    setScene(){
        this.aboutScene = new THREE.Scene()
        this.background = this.resources.items.background
        this.background.colorSpace = THREE.SRGBColorSpace
        this.aboutScene.background = this.background
    }

    setCamera(){
        this.camera = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 100)
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
        this.images = document.querySelectorAll('.about-container img')

        this.images.forEach((image) => {
            image.classList.add('gl')
        })

        this.pageChange.on('pageChange', () => {
            this.images.forEach((image) => {
                image.classList.add('gl')
            })
        })
    }

    setImage(){
        this.pageChange.on('pageChange', () => {

            this.images.forEach((image) => {
                image.onload = () => {
                    const imageData = {}

                    imageData.image = image
                    imageData.texture = this.textureLoader.load(imageData.image.src)
                    
                    imageData.imageBoundingData = image.getBoundingClientRect()
        
                    // imageData.imageSize = this.updateSize(imageData.imageBoundingData.width, imageData.imageBoundingData.height)
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
                            uOpacity: new THREE.Uniform(.1)
                        },
                        transparent: true,
                    })
                    imageData.imageMesh = new THREE.Mesh(imageData.imagePlate, imageData.imageMaterial)
        
                    imageData.imageMesh.scale.set(imageData.finalScaleX, imageData.finalScaleY, 0)
                    imageData.imageMesh.position.y = (this.camUnit.height / 2) - (imageData.imageMesh.scale.y / 2)
                    imageData.imageMesh.position.y -= (imageData.imageBoundingData.top / this.sizes.height) * this.camUnit.height
                    
                    this.imageGroup.push(imageData)
                    this.aboutScene.add(imageData.imageMesh)
                }
            })

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
        })

        this.images.forEach((image) => {
            const imageData = {}
            imageData.image = image
            imageData.texture = this.textureLoader.load(imageData.image.src)
            imageData.imageBoundingData = image.getBoundingClientRect()

            // imageData.imageSize = this.updateSize(imageData.imageBoundingData.width, imageData.imageBoundingData.height)
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
                    uOpacity: new THREE.Uniform(.1)
                },
                transparent: true,
            })
            imageData.imageMesh = new THREE.Mesh(imageData.imagePlate, imageData.imageMaterial)

            imageData.imageMesh.scale.set(imageData.finalScaleX, imageData.finalScaleY, 0)
            imageData.imageMesh.position.y = (this.camUnit.height / 2) - (imageData.imageMesh.scale.y / 2)
            imageData.imageMesh.position.y -= (imageData.imageBoundingData.top / this.sizes.height) * this.camUnit.height
            
            this.imageGroup.push(imageData)
            this.aboutScene.add(imageData.imageMesh)
        })
    }

    calculateUniteSize(distance){
        const vFov = this.camera.fov * Math.PI / 180
        const height = 2 * Math.tan(vFov / 2) * distance
        const width = height * this.camera.aspect
        return { width, height }
    }

    resize(){
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()

        this.camUnit = this.calculateUniteSize(this.camera.position.z)
        
        this.imageGroup.forEach((imageObject) => {
            imageObject.imageBoundingData = imageObject.image.getBoundingClientRect()
            imageObject.imageSize = this.updateSize(imageObject.imageBoundingData.width, imageObject.imageBoundingData.height)

            imageObject.imageMesh.scale.set(imageObject.imageSize.finalScaleX, imageObject.imageSize.finalScaleY, 0)
        })
    }

    update(){
        this.imageGroup.forEach((imageObject) => {
            imageObject.imageMesh.position.x = ((this.camUnit.width / -2) - (imageObject.imageMesh.scale.x / -2)) + ((imageObject.imageBoundingData.left - this.scroll.scrollPosition) / this.sizes.width) * this.camUnit.width
        })
    }
}