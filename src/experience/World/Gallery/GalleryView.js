import Experienece from '../../Experience'

import * as THREE from 'three'

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


        this.setScene()
        this.setCamera()
        this.getImage()
        this.setImage()
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
            console.log(this.pageImage)
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
                // Page switch needs a delay, which will add through transition
                while(this.scene.children.length > 0){
                    this.scene.remove(this.scene.children[0])
                }
        })

        this.scene.remove(this.imageGroup)
        
        this.pageImage.forEach((image, i) => {
            const imageData = {}

            imageData.image = image
            imageData.texture = this.textureLoader.load(imageData.image.src)
            imageData.imageBooundingData = image.getBoundingClientRect()

            const x = imageData.imageBooundingData.width / this.sizes.width
            const y = imageData.imageBooundingData.height / this.sizes.height

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
                    uOpacity: new THREE.Uniform(.1)
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
        this.imageGroup.position.x = -(this.pageImage.length * 1)
        this.scene.add(this.imageGroup)

        this.pageChange.on('pageChange', () => {
            this.imageList = []

            console.log(this.scene.children)

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
                    // Page switch needs a delay, which will add through transition
                    while(this.scene.children.length > 0){
                        this.scene.remove(this.scene.children[0])
                        console.log(child)
                    }
            })

            this.scene.remove(this.imageGroup)

            console.log(this.scene.children)

            this.pageImage.forEach((image, i) => {
                image.onload = () => {
                    const imageData = {}
    
                    imageData.image = image
                    imageData.texture = this.textureLoader.load(imageData.image.src)
                    imageData.imageBooundingData = image.getBoundingClientRect()
        
                    const x = imageData.imageBooundingData.width / this.sizes.width
                    const y = imageData.imageBooundingData.height / this.sizes.height
        
                    if(!x || !y){
                        console.log('Invalid image size')
                        return
                    }
        
                    imageData.finalScaleX = this.camUnit.width * x * this.imageSizeMultiplier
                    imageData.finalScaleY = this.camUnit.height * y * this.imageSizeMultiplier
        
                    imageData.imageMaterial = new THREE.ShaderMaterial({
                        vertexShader: imagePlateVer,
                        fragmentShader: imagePlateFrag,
                        uniforms: {
                            uTexture: new THREE.Uniform(imageData.texture),
                            uOpacity: new THREE.Uniform(.1)
                        },
                        transparent: true,
                    })
                    imageData.imageMesh = new THREE.Mesh(this.imagePlaneGeometry, imageData.imageMaterial)
                    imageData.imageMesh.scale.set(imageData.finalScaleX, imageData.finalScaleY, 0)
        
                    imageData.imageMesh.position.x = imageData.finalScaleX * (i * this.imageGap)
                    imageData.imageMesh.position.y = i % 3 - 1
        
                    this.imageGroup.add(imageData.imageMesh)
        
                    this.imageList.push(imageData)
                }
                
            this.imageGroup.position.x = -(this.pageImage.length * 1)
            this.scene.add(this.imageGroup)
            })


        })
    }

    calculateUniteSize(distance){
        const vFov = this.camera.fov * Math.PI / 180
        const height = 2 * Math.tan(vFov / 2) * distance
        const width = height * this.camera.aspect
        return { width, height }
    }

    removeItem(){
        this.pageChange.on('pageChange', () => {
            this.scene.remove(this.imageGroup)
        })
    }

    update(){
        if(this.pageImage.length === this.imageList.length){
            this.imageList.forEach((object, i) => {
                object.imageMesh.position.x = ((- this.scroll.infiniteScroll / this.sizes.width * 8) + (object.imageMesh.position.x) + (object.finalScaleX * this.imageList.length * this.imageGap)) % (object.finalScaleX * this.imageList.length * this.imageGap)
                // console.log(this.imageList.length)
            })
        }
    }
}