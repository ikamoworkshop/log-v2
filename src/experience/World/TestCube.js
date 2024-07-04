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

        this.setModel();
        this.update()
    };

    setModel(){
        this.testMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({color: 0xffffff})
        )
        this.scene.add(this.testMesh)
    }


    update(){

    
    }
}