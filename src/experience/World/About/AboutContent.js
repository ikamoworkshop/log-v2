import Experience from "../../Experience"

import * as THREE from 'three'

import imagePlateVer from '../../Shaders/imagePlate/vertex.glsl'
import imagePlateFrag from '../../Shaders/imagePlate/fragment.glsl'

export default class NotFound {
    constructor(){
        this.experience = new Experience()
        this.pageChange = this.experience.pageChange
        this.scroll = this.experience.scroll
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.cursor = this.experience.cursor

        this.textureLoader = new THREE.TextureLoader()

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

    getImage(){
        this.images = document.querySelectorAll('img')

        this.pageChange.on('pageChange', () => {
            this.images = document.querySelectorAll('img')
            this.images.forEach((image) => {
                image.classList.add('gl')
            })
        })
        this.images.forEach((image) => {
            image.classList.add('gl')
        })
    }

    setImage(){
        this.imageGroup = []
        this.images.forEach((image, i) => {
            const imageData = {}
            imageData.image = image
            imageData.texture = this.textureLoader.load(imageData.image.src)
            imageData.imageBoundingData = image.getBoundingClientRect()
            imageData.imageSize = this.updateSize(imageData.imageBoundingData.width, imageData.imageBoundingData.height)

            imageData.imagePlate = new THREE.PlaneGeometry(1, 1, 1, 1)
            imageData.imageMaterial = new THREE.ShaderMaterial({
                vertexShader: imagePlateVer,
                fragmentShader: imagePlateFrag,
                uniforms: {
                    uTexture: new THREE.Uniform(imageData.texture),
                    uOpacity: new THREE.Uniform(.1)
                }
            })
            imageData.imageMesh = new THREE.Mesh(imageData.imagePlate, imageData.imageMaterial)

            imageData.imageMesh.scale.set(imageData.imageSize.finalScaleX, imageData.imageSize.finalScaleY, 0)

            // imageData.imageMesh.position.x = (this.camUnit.width / 2) - (imageData.imageMesh.scale.x / 2)
            imageData.imageMesh.position.y = (this.camUnit.height / 2) - (imageData.imageMesh.scale.y / 2)

            imageData.imageMesh.position.y -= (imageData.imageBoundingData.top / this.sizes.height) * this.camUnit.height
            
            this.imageGroup.push(imageData)
            this.aboutScene.add(imageData.imageMesh)

        })
    }

    updateSize(width, height){
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

    calculateUniteSize(distance){
        const vFov = this.camera.fov * Math.PI / 180
        const height = 2 * Math.tan(vFov / 2) * distance
        const width = height * this.camera.aspect
        return { width, height }
    }

    resize(){
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