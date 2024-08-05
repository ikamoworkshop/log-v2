import Experience from "../Experience"
import * as THREE from 'three'

import renderTargetVertex from '../Shaders/renderTarget/vertex.glsl'
import renderTargetFragment from '../Shaders/renderTarget/fragment.glsl'

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
        this.setRenderTarget()
        this.update()
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

    setModel(){
        this.defaultFace = this.resources.items.defaultFlat.scene
        this.defaultFaceMesh = this.defaultFace.children[0]
        this.glassMaterial = new THREE.MeshPhysicalMaterial({ 
            roughness: 0.4,   
            transmission: .8,  
            thickness: .5
        })
        
        this.defaultFaceMesh.material = this.glassMaterial
        this.defaultFaceMesh.scale.set(.9, .9, .9)

        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        this.directionalLight.position.set(0, 5, 10)
        this.scene.add(this.defaultFace, this.directionalLight)
    }

    setLookAt() {
        this.lookAtMesh = new THREE.Mesh(
            new THREE.BoxGeometry(.1, .1, .1),
            new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                transparent: true,
                opacity: 0
            }),
        )
        this.lookAtMesh.position.z = 1

        this.scene.add(this.lookAtMesh)
    }

    setRenderTarget(){
        this.fovY = (this.camera.position.z + 4) * this.camera.getFilmHeight() / this.camera.getFocalLength()

        this.renderTarget = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height)

        this.renderPlaneGeometry = new THREE.PlaneGeometry(1, 1)
        this.renderPlaneGeometry.scale(this.fovY * this.camera.aspect, this.fovY, 1)
        this.renderPlaneMaterial = new THREE.ShaderMaterial({
            vertexShader: renderTargetVertex,
            fragmentShader: renderTargetFragment,
            uniforms: {
                uTexture: new THREE.Uniform()
            },
        })
        this.renderPlane = new THREE.Mesh(this.renderPlaneGeometry, this.renderPlaneMaterial)
        this.renderPlane.position.set(0, 0, -4)

        this.scene.add(this.renderPlane)
    }

    resize(){
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()

        this.renderTarget.setSize(this.sizes.width, this.sizes.height)
    }

    update(){
        this.defaultFace.rotation.x = (this.cursor.cursorY / this.sizes.width - .2) * 1.3
        this.defaultFace.rotation.y = (this.cursor.cursorX / this.sizes.height - .8) * .3

        
        this.defaultFace.position.x = (this.defaultFace.position.x + ((this.cursor.cursorX / this.sizes.width - .5) - this.defaultFace.position.x) * .05) * .9
        this.defaultFace.position.y = (this.defaultFace.position.y - ((this.cursor.cursorY / this.sizes.height - .5) + this.defaultFace.position.y) * .05) * .9

    }
}