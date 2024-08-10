import Experienece from '../../Experience'

import * as THREE from 'three'

export default class GalleryTop {
    constructor(){
        this.experience = new Experienece()
        this.pageChange = this.experience.pageChange
        this.scroll = this.experience.scroll
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.cursor = this.experience.cursor

        this.galleryList = this.resources.galleryList

        console.log(this.galleryList.length)

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
        this.thumbnailPlateGeometry = new THREE.PlaneGeometry(1.2, 1.2)

        this.galleryList.forEach((item, i) => {
            const thumbnailData = {}
            thumbnailData.thumbnailPlateMaterial = new THREE.ShaderMaterial()
            thumbnailData.thumbnailPlate = new THREE.Mesh(this.thumbnailPlateGeometry, thumbnailData.thumbnailPlateMaterial)

            thumbnailData.thumbnailPlate.position.x =(i % (this.galleryList.length / 9) * 2)
            thumbnailData.thumbnailPlate.position.y = -( Math.floor( i / (this.galleryList.length / 5) ) % (this.galleryList.length / 5) ) * 2

            this.thumbnailPlateGroup.add(thumbnailData.thumbnailPlate)
        })

        this.thumbnailPlateGroup.position.x = - ((this.galleryList.length / 9) * 2) * .5 + 1
        this.thumbnailPlateGroup.position.y = ((this.galleryList.length / 5) * .5) - .5

        this.scene.add(this.thumbnailPlateGroup)
    }

    resize(){
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()
    }

    update(){
        
    }
}