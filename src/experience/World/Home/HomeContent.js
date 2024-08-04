import Experience from "../../Experience"
import * as THREE from 'three'

export default class HomeContent {
    constructor(){
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.cursor = this.experience.cursor

        this.setScene()
        this.setCube()
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

    setCube(){
        this.cube = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({
            color: 0xffffff,
        }))
        this.HomeScene.add(this.cube)
    }

    update(){
        // this.cube.rotation.x += 0.001 * this.time.delta
        // this.cube.rotation.y += 0.001 * this.time.delta
    }
}