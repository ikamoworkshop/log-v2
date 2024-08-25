import Experienece from '../../Experience'

import * as THREE from 'three'

import urlForImage from '../../../sanity/imageBuilder'

import thumbnailVertex from '../../Shaders/thumbnailPlate/vertex.glsl'
import thumbnailFrag from '../../Shaders/thumbnailPlate/fragment.glsl'

export default class InsightsTop {
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

        this.insightsList = this.resources.insightsList

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
        this.insightGroup = new THREE.Group()
        this.insightPlateList = []
        this.insightsGeometry = new THREE.PlaneGeometry(2, 2)
        this.gridGap = 2.8

        this.insightsList.forEach((item, i) => {
            const insightData = {}

            insightData.image = new Image()
            insightData.image.src = urlForImage(item.heroImage).url()

            insightData.item = item

            insightData.image.onload = () => {

                insightData.imageSize = new THREE.Vector2(insightData.image.width, insightData.image.height)

                insightData.texture = this.textureLoader.load(insightData.image.src)
                insightData.material = new THREE.ShaderMaterial({
                    vertexShader: thumbnailVertex,
                    fragmentShader: thumbnailFrag,
                    uniforms:{
                        uTexture: new THREE.Uniform(insightData.texture),
                        uGrainTexture: new THREE.Uniform(this.resources.items.grain),
                        uOpacity: new THREE.Uniform(.2),
                        uPlaneSize: new THREE.Uniform(new THREE.Vector2(2,2)),
                        uImageSize: new THREE.Uniform(insightData.imageSize),
                    },
                    transparent: true,
                })

                insightData.mesh = new THREE.Mesh(this.insightsGeometry, insightData.material)

                insightData.mesh.position.y = i * this.gridGap * -1

                this.insightPlateList.push(insightData)
                this.insightGroup.add(insightData.mesh)
            }
        })

        this.insightGroup.position.y = (2 * this.gridGap) * .5
        this.scene.add(this.insightGroup)

        console.log(this.insightPlateList.length)
    }

    update(){
        
        if(this.insightsList.length === this.insightPlateList.length){

            this.insightPlateList.forEach((object, i) => {
                object.mesh.position.y = ((this.scroll.infiniteScroll / this.sizes.height * 4) + object.mesh.position.y + (this.insightPlateList.length * this.gridGap * -1)) % (this.insightPlateList.length * this.gridGap * -1)
            })

        }

    }
}