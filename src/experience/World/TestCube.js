import Experience from "../Experience";
import * as THREE from 'three'

export default class TestCube {
    constructor(){
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.sizes = this.experience.sizes
        this.cursor = this.experience.cursor

        this.defaultFace = this.resources.items.defaultFace

        this.setModel()
        // this.setLookAt()
        this.update()
    }

    setModel(){
        this.faceModel = this.defaultFace.scene
        this.glassMaterial = new THREE.MeshPhysicalMaterial({ 
            roughness: 0.5,   
            transmission: 1,  
            thickness: 1
        })
        this.cube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshPhysicalMaterial())
        this.cube.position.set(0, 0, -5)
        
        this.faceModel.children[0].material = this.glassMaterial

        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        this.directionalLight.position.set(0, 5, 10)
        this.scene.add(this.faceModel, this.cube, this.directionalLight)
    }

    setLookAt() {
        this.lookAtMesh = new THREE.Mesh(
            new THREE.BoxGeometry(.1, .1, .1),
            new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                transparent: true,
                opacity: .5
            })
        )
        this.lookAtMesh.position.z = 1

        this.scene.add(this.lookAtMesh)
    }

    update(){


        this.faceModel.rotation.x = (this.cursor.cursorY / this.sizes.width - .2) * 1.3
        this.faceModel.rotation.y = (this.cursor.cursorX / this.sizes.height - .8) * .3
    }
}