import Experience from "../Experience"
import * as THREE from 'three'

export default class TestCube {
    constructor(){
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.cursor = this.experience.cursor

        this.setScene()
        this.setCamera()
        this.setModel()
        this.update()
    }

    setScene(){
        this.scene = new THREE.Scene()
        this.background = this.resources.items.background
        this.background.colorSpace = THREE.SRGBColorSpace
        this.scene.background = this.background
    }

    setCamera(){
        this.camera = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.camera.position.set(0, 0, 5)
        this.scene.add(this.camera)
    }

    resize(){
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()
    }

    setModel(){
        this.defaultFace = this.resources.items.defaultFace.scene
        this.defaultFaceMesh = this.defaultFace.children[0]
        this.glassMaterial = new THREE.MeshPhysicalMaterial({ 
            roughness: 0.6,   
            transmission: 1,  
            thickness: 1
        })

        this.circle = new THREE.Mesh(new THREE.CircleGeometry(1,32), new THREE.MeshPhysicalMaterial())
        this.circle.position.set(0, 0, -16)
        
        this.defaultFaceMesh.material = this.glassMaterial
        this.defaultFace.scale.set(.8, .8, .8)

        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        this.directionalLight.position.set(0, 5, 10)
        this.scene.add(this.defaultFace, this.circle, this.directionalLight)
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
        this.defaultFace.rotation.x = (this.cursor.cursorY / this.sizes.width - .2) * 1.3
        this.defaultFace.rotation.y = (this.cursor.cursorX / this.sizes.height - .8) * .3
    }
}