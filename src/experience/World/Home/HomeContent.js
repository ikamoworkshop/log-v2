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
        this.setCamera()
        this.setTitle()
        this.createImagePlates()
        this.setImagePlates()
        this.getImageGroupSize()
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
        this.textGroup = new THREE.Group()

        this.HomeTitleGeometryOne = new TextGeometry('IKAMO', {
            font: this.spaceBold,
            size: .6,
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
            size: .6,
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

        this.textGroup.add(this.HomeTitleOne, this.HomeTitleTwo)
        this.HomeScene.add(this.textGroup)
    }

    createImagePlates(){
        this.sizeBase = 2

        this.imagePlateTall = new THREE.PlaneGeometry(this.sizeBase, this.sizeBase * 2)
        this.imagePlateWide = new THREE.PlaneGeometry(this.sizeBase * 2, this.sizeBase)
        this.imagePlateSquare = new THREE.PlaneGeometry(this.sizeBase, this.sizeBase * 1.2)

        this.imagePlateMaterialBridge = new THREE.ShaderMaterial()
        this.imagePlateMaterialGradshow = new THREE.ShaderMaterial()
        this.imagePlateMaterialWater = new THREE.ShaderMaterial()
        this.imagePlateMaterialDesk = new THREE.ShaderMaterial()
        this.imagePlateMaterialComic = new THREE.ShaderMaterial()
        this.imagePlateMaterialGrad = new THREE.ShaderMaterial()
        this.imagePlateMaterialAida = new THREE.ShaderMaterial()

        this.imagePlateBridge = new THREE.Mesh(this.imagePlateTall, this.imagePlateMaterialBridge)
        this.imagePlateGradshow = new THREE.Mesh(this.imagePlateSquare, this.imagePlateMaterialGradshow)
        this.imagePlateWater = new THREE.Mesh(this.imagePlateWide, this.imagePlateMaterialWater)
        this.imagePlateDesk = new THREE.Mesh(this.imagePlateSquare, this.imagePlateMaterialDesk)
        this.imagePlateComic = new THREE.Mesh(this.imagePlateSquare, this.imagePlateMaterialComic)
        this.imagePlateGrad = new THREE.Mesh(this.imagePlateWide, this.imagePlateMaterialGrad)
        this.imagePlateAida = new THREE.Mesh(this.imagePlateTall, this.imagePlateMaterialAida)
    }

    setImagePlates(){
        this.imagePlateGroup = new THREE.Group()
        this.imagePlateGroup.add(
            this.imagePlateBridge,
            this.imagePlateGradshow,
            this.imagePlateWater,
            this.imagePlateDesk,
            this.imagePlateComic,
            this.imagePlateGrad,
            this.imagePlateAida,
        )

        this.imagePlateBridge.position.set(-this.sizeBase, this.sizeBase * 2, 0)
        this.imagePlateGradshow.position.set(- this.sizeBase * 3, -this.sizeBase * .1, 0)
        this.imagePlateWater.position.set(-this.sizeBase * 1.3, - this.sizeBase * 1.7, 0)
        this.imagePlateDesk.position.set(this.sizeBase * .7, this.sizeBase * .1, 0)
        this.imagePlateComic.position.set(this.sizeBase * 2.5, this.sizeBase * 1.8, 0)
        this.imagePlateGrad.position.set(this.sizeBase * 3.5, -this.sizeBase * .2, 0)
        this.imagePlateAida.position.set(this.sizeBase * 1.8, -this.sizeBase * 2.3, 0)

        this.imagePlateGroup.position.z = -2
        this.HomeScene.add(this.imagePlateGroup)
    }

    getImageGroupSize(){
        this.imageGroupBox = new THREE.Box3().setFromObject(this.imagePlateGroup)
        this.groupSize = this.imageGroupBox.getSize(new THREE.Vector3())
        
        this.targetPosition = new THREE.Vector2(0, 0)
    }

    resize(){
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()
    }

    update(){
        this.normalizedCursor = new THREE.Vector2(this.cursor.cursorX / this.sizes.width - .5, - (this.cursor.cursorY / this.sizes.height - .5))

        this.textGroup.position.x = (this.textGroup.position.x + ((this.cursor.cursorX / this.sizes.width - .5) - this.textGroup.position.x) * .05) * .6
        this.textGroup.position.y = (this.textGroup.position.y - ((this.cursor.cursorY / this.sizes.height - .5) + this.textGroup.position.y) * .05) * .6

        // Update Image Grup Position
        this.targetPosition.lerp(this.normalizedCursor, .1)
        this.imagePlateGroup.position.x = this.targetPosition.x * this.groupSize.x * .25
        this.imagePlateGroup.position.y = this.targetPosition.y * this.groupSize.y * .25
    }
}