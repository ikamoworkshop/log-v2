import Experience from "../../Experience"

import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
export default class HomeContent {
    constructor(){
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.cursor = this.experience.cursor

        this.setScene()
        this.setTitle()
        this.setCamera()
    }

    setScene(){
        this.HomeScene = new THREE.Scene()
        this.background = this.resources.items.background
        this.background.colorSpace = THREE.SRGBColorSpace
        this.HomeScene.background = this.background
    }

    setCamera(){
        this.camera = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 100)
        this.camera.position.set(0, 0, 5)
        this.HomeScene.add(this.camera)
    }

    setTitle(){
        this.spaceBold = this.resources.items.spaceBold
        this.textMaterial = new THREE.MeshBasicMaterial()

        this.HomeTitleGeometryOne = new TextGeometry('IKAMO', {
            font: this.spaceBold,
            size: .7,
            depth: 0,
            curveSegments: 12,
        })
        this.HomeTitleGeometryOne.computeBoundingBox()
        this.HomeTitleGeometryOne.translate(
            - this.HomeTitleGeometryOne.boundingBox.max.x * .5,
            - this.HomeTitleGeometryOne.boundingBox.max.y * .5,
            - this.HomeTitleGeometryOne.boundingBox.max.z * .5
        )

        this.HomeTitleOne = new THREE.Mesh(this.HomeTitleGeometryOne, this.textMaterial)
        this.HomeTitleOne.position.set(0, .5, 0)

        this.HomeTitleGeometryTwo = new TextGeometry('[LOG]', {
            font: this.spaceBold,
            size: .7,
            depth: 0,
            curveSegments: 12,
        })
        this.HomeTitleGeometryTwo.computeBoundingBox()
        this.HomeTitleGeometryTwo.translate(
            - this.HomeTitleGeometryTwo.boundingBox.max.x * .5,
            - this.HomeTitleGeometryTwo.boundingBox.max.y * .5,
            - this.HomeTitleGeometryTwo.boundingBox.max.z * .5
        )

        this.HomeTitleTwo = new THREE.Mesh(this.HomeTitleGeometryTwo, this.textMaterial)
        this.HomeTitleTwo.position.set(0, -.5, 0)

        this.HomeScene.add(this.HomeTitleOne, this.HomeTitleTwo)
    }

    resize(){
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()
    }

    update(){

    }
}