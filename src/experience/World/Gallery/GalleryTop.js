import Experienece from '../../Experience'

import * as THREE from 'three'

import urlForImage from '../../../sanity/imageBuilder'

import thumbnailVertex from '../../Shaders/thumbnailPlate/vertex.glsl'
import thumbnailFrag from '../../Shaders/thumbnailPlate/fragment.glsl'

export default class GalleryTop {
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

        this.galleryList = this.resources.galleryList
        this.mainDom = document.getElementById('gallery-top')

        this.setScene()
        this.setCamera()
        this.setThumbnail()
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

    setThumbnail(){
        this.thumbnailPlateGroup = new THREE.Group()
        this.thumbnailPlateList = []
        this.thumbnailPlateGeometry = new THREE.PlaneGeometry(1.3, 1.3)
        this.gridSize = 9
        this.gridGap = 2

        this.galleryList.forEach((item, i) => {
            const thumbnailData = {}
            thumbnailData.image = new Image()
            thumbnailData.image.src = urlForImage(item.thumbnailImage).url()

            thumbnailData.image.onload = () => {
                thumbnailData.imageSize = new THREE.Vector2(thumbnailData.image.width, thumbnailData.image.height)

                thumbnailData.thumbnailImage = this.textureLoader.load(thumbnailData.image.src)
                thumbnailData.thumbnailPlateMaterial = new THREE.ShaderMaterial({
                    vertexShader: thumbnailVertex,
                    fragmentShader: thumbnailFrag,
                    uniforms:{
                        uTexture: new THREE.Uniform(thumbnailData.thumbnailImage),
                        uOpacity: new THREE.Uniform(.1),
                        uPlaneSize: new THREE.Uniform(new THREE.Vector2(1.3,1.3)),
                        uImageSize: new THREE.Uniform(thumbnailData.imageSize),
                    },
                    transparent: true,
                })
                thumbnailData.thumbnailPlate = new THREE.Mesh(this.thumbnailPlateGeometry, thumbnailData.thumbnailPlateMaterial)

                thumbnailData.thumbnailPlate.position.x =(i % this.gridSize) * this.gridGap
                thumbnailData.thumbnailPlate.position.y = -( Math.floor( i /  this.gridSize ) % this.gridSize ) * this.gridGap

                this.thumbnailPlateList.push(thumbnailData)
                this.thumbnailPlateGroup.add(thumbnailData.thumbnailPlate)

                const screenPosition = thumbnailData.thumbnailPlate.position.clone()
                screenPosition.project(this.camera)

                const translateX = (screenPosition.x + 1.25) * this.sizes.width * .5
                const translateY = - (screenPosition.y + 1.35) * this.sizes.height * .5

                thumbnailData.anchorButton = document.createElement('a')
                thumbnailData.anchorButton.style.width = '420px'
                thumbnailData.anchorButton.style.height = '420px'
                thumbnailData.anchorButton.classList.add('gallery-link')
                thumbnailData.anchorButton.href = `/gallery/` + item.slug.current
                thumbnailData.anchorButton.style.transform = `translate(${translateX}px, ${translateY}px)`

                thumbnailData.leftBracket = document.createElement('div')
                thumbnailData.leftBracket.textContent = '['
                thumbnailData.leftBracket.classList.add('text-light', 'title', 'gallery-bracket')
                thumbnailData.anchorButton.appendChild(thumbnailData.leftBracket)

                thumbnailData.title = document.createElement('h1')
                thumbnailData.title.textContent = item.name
                thumbnailData.title.classList.add('text-light', 'subtitle-bold', 'gallery-title')
                thumbnailData.anchorButton.appendChild(thumbnailData.title)

                thumbnailData.rightBracket = document.createElement('div')
                thumbnailData.rightBracket.textContent = ']'
                thumbnailData.rightBracket.classList.add('text-light', 'title', 'gallery-bracket')
                thumbnailData.anchorButton.appendChild(thumbnailData.rightBracket)

                window.setTimeout(() => {
                    this.mainDom.appendChild(thumbnailData.anchorButton)
                }, 500)
            }
        })

        this.thumbnailPlateGroup.position.x = - this.gridSize * .5 - 1.5
        this.thumbnailPlateGroup.position.y =  this.gridSize * .5 - .5

        this.scene.add(this.thumbnailPlateGroup)
    }

    resize(){
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()
    }

    update(){
    
        if(this.mainDom === null){
            this.mainDom = document.getElementById('gallery-top')
        }

        

        this.thumbnailPlateList.forEach((object, i) => {
            object.thumbnailPlate.position.x = ((-this.drag.diffX / this.sizes.width) + object.thumbnailPlate.position.x + (this.gridSize * this.gridGap)) % (this.gridSize * this.gridGap)
            
            object.thumbnailPlate.position.y = ((this.drag.diffY / this.sizes.height) + object.thumbnailPlate.position.y - (( Math.floor( this.galleryList.length / this.gridSize ) ) * this.gridGap)) % (( Math.floor( this.galleryList.length / this.gridSize ) ) * this.gridGap)

            const screenPosition = object.thumbnailPlate.position.clone()
            screenPosition.project(this.camera)

            const translateX = (screenPosition.x - .74) * this.sizes.width * .5
            const translateY = - (screenPosition.y + 1.35) * this.sizes.height * .5

            object.anchorButton.style.transform = `translate(${translateX}px, ${translateY}px)`
        })
    }
}