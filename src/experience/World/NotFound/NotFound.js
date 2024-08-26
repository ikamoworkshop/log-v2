import Experience from "../../Experience"

import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'


export default class NotFound {
    constructor(){
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.cursor = this.experience.cursor

        this.setScene()
        this.setCamera()
        this.setTitle()
    }

    setScene(){
        this.notFoundScene = new THREE.Scene()
        this.background = this.resources.items.background
        this.background.colorSpace = THREE.SRGBColorSpace
        this.notFoundScene.background = this.background
    }

    setCamera(){
        this.camera = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 100)
        this.camera.position.set(0, 0, 5)
        this.notFoundScene.add(this.camera)
    }

    setTitle(){
        this.spaceBold = this.resources.items.spaceBold
        this.textMaterial = new THREE.MeshBasicMaterial()
        this.textGroup = new THREE.Group()

        this.notFoundTitleGeometryOne = new TextGeometry('[404]', {
            font: this.spaceBold,
            size: .6,
            depth: 0,
            curveSegments: 12,
        })
        this.notFoundTitleGeometryOne.computeBoundingBox()
        this.notFoundTitleGeometryOne.translate(
            - this.notFoundTitleGeometryOne.boundingBox.max.x * .5,
            - this.notFoundTitleGeometryOne.boundingBox.max.y * .5,
            - this.notFoundTitleGeometryOne.boundingBox.max.z * .5
        )

        this.notFoundTitleOne = new THREE.Mesh(this.notFoundTitleGeometryOne, this.textMaterial)
        this.notFoundTitleOne.position.set(0, .6, 0)

        this.notFoundTitleGeometryTwo = new TextGeometry('NOT FOUND', {
            font: this.spaceBold,
            size: .6,
            depth: 0,
            curveSegments: 12,
        })
        this.notFoundTitleGeometryTwo.computeBoundingBox()
        this.notFoundTitleGeometryTwo.translate(
            - this.notFoundTitleGeometryTwo.boundingBox.max.x * .5,
            - this.notFoundTitleGeometryTwo.boundingBox.max.y * .5,
            - this.notFoundTitleGeometryTwo.boundingBox.max.z * .5
        )

        this.notFoundTitleTwo = new THREE.Mesh(this.notFoundTitleGeometryTwo, this.textMaterial)
        this.notFoundTitleTwo.position.set(0, -.6, 0)

        this.textGroup.add(this.notFoundTitleOne, this.notFoundTitleTwo)
        this.notFoundScene.add(this.textGroup)
    }

    resize(){
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()
    }

    update(){
        this.textGroup.position.x = (this.textGroup.position.x + ((this.cursor.cursorX / this.sizes.width - .5) - this.textGroup.position.x) * .05) * .6
        this.textGroup.position.y = (this.textGroup.position.y - ((this.cursor.cursorY / this.sizes.height - .5) + this.textGroup.position.y) * .05) * .6
    }
}