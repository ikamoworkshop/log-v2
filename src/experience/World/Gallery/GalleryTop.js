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

        this.textureLoader = new THREE.TextureLoader()

        this.galleryList = this.resources.galleryList
        

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
        this.thumbnailPlateGeometry = new THREE.PlaneGeometry(1.3, 1.3)
        this.gridSize = 9

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

                thumbnailData.thumbnailPlate.position.x =(i % this.gridSize) * 2
                thumbnailData.thumbnailPlate.position.y = -( Math.floor( i /  this.gridSize ) % this.gridSize ) * 2

                this.thumbnailPlateGroup.add(thumbnailData.thumbnailPlate)
            }
        })

        this.thumbnailPlateGroup.position.x = - this.gridSize * .5 + .5
        this.thumbnailPlateGroup.position.y =  this.gridSize * .5 - .5

        this.scene.add(this.thumbnailPlateGroup)
    }

    resize(){
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()
    }

    update(){
        
    }
}