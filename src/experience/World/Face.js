import Experience from "../Experience"
import * as THREE from 'three'

import renderTargetVertex from '../Shaders/renderTarget/vertex.glsl'
import renderTargetFragment from '../Shaders/renderTarget/fragment.glsl'

export default class TestCube {
    constructor(){
        this.experience = new Experience()
        this.pageChange = this.experience.pageChange
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.cursor = this.experience.cursor

        this.galleryList = this.resources.galleryList
        this.gallerySlugList = []
        this.galleryList.forEach(item => {
            this.gallerySlugList.push("/gallery/" + item.slug.current)
        })

        this.insightsList = this.resources.insightsList
        this.insightsSlugList = []
        this.insightsList.forEach(item => {
            this.insightsSlugList.push("/insights/" + item.slug.current)
        })

        this.setScene()
        this.setCamera()
        this.setModel()
        this.setLookAt()
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
        this.renderedFaceGroup = new THREE.Group()
        this.renderedFace = this.resources.items.defaultFlat.scene
        this.renderedFaceGroup.add(this.renderedFace)

        if(this.pageChange.prevPage === '/'){
            this.renderedFace = this.resources.items.defaultFlat.scene
            this.renderedFaceGroup.position.set(0, 0, 0)
            this.renderedFace.visible = true
        }
        
        else if(this.pageChange.prevPage === '/about'){
            this.renderedFace = this.resources.items.defaultFlat.scene
            this.renderedFaceGroup.position.y = -2
            this.renderedFace.visible = true
        }
        
        else if(this.pageChange.prevPage === '/gallery'){
            this.renderedFace = this.resources.items.defaultFlat.scene
            this.renderedFaceGroup.position.y = 0
            this.renderedFace.visible = false
        }

        else if (this.gallerySlugList.includes(this.pageChange.prevPage)){
            this.renderedFace = this.resources.items.defaultFlat.scene
            this.renderedFaceGroup.position.set(0, 0, 0)
            this.renderedFace.visible = true
        } 

        else if(this.pageChange.prevPage === '/insights'){
            this.renderedFace = this.resources.items.defaultFlat.scene
            this.renderedFaceGroup.position.y = 0
            this.renderedFace.visible = false
        }

        else if (this.insightsSlugList.includes(this.pageChange.prevPage)){
            this.renderedFace = this.resources.items.defaultFlat.scene
            this.renderedFaceGroup.position.set(0, 0, 0)
            this.renderedFace.visible = false
        } 
        
        else if(this.pageChange.prevPage !== '/' && this.pageChange.prevPage !== '/about' && this.pageChange.prevPage !== '/gallery') {
            this.renderedFace = this.resources.items.defaultFlat.scene
            this.renderedFaceGroup.position.set(0, 0, 0)
            this.renderedFace.visible = true
        }

        this.pageChange.on('pageChange', () => {
            if(this.pageChange.prevPage === '/'){
                this.renderedFace = this.resources.items.defaultFlat.scene
                this.renderedFaceGroup.position.set(0, 0, 0)
                this.renderedFace.visible = true
            }
            
            else if(this.pageChange.prevPage === '/about'){
                this.renderedFace = this.resources.items.defaultFlat.scene
                this.renderedFaceGroup.position.y = -2
                this.renderedFace.visible = true
            }
            
            else if(this.pageChange.prevPage === '/gallery'){
                this.renderedFace = this.resources.items.defaultFlat.scene
                this.renderedFaceGroup.position.y = 0
                this.renderedFace.visible = false
            }

            else if (this.gallerySlugList.includes(this.pageChange.prevPage)){
                this.renderedFace = this.resources.items.defaultFlat.scene
                this.renderedFaceGroup.position.set(0, 0, 0)
                this.renderedFace.visible = true
            } 

            else if(this.pageChange.prevPage === '/insights'){
                this.renderedFace = this.resources.items.defaultFlat.scene
                this.renderedFaceGroup.position.y = 0
                this.renderedFace.visible = false
            }

            else if (this.insightsSlugList.includes(this.pageChange.prevPage)){
                this.renderedFace = this.resources.items.defaultFlat.scene
                this.renderedFaceGroup.position.set(0, 0, 0)
                this.renderedFace.visible = false
            } 
            
            else if(this.pageChange.prevPage !== '/' && this.pageChange.prevPage !== '/about' && this.pageChange.prevPage !== '/gallery') {
                this.renderedFace = this.resources.items.defaultFlat.scene
                this.renderedFaceGroup.position.set(0, 0, 0)
                this.renderedFace.visible = true
            }
        })

        this.renderedFaceMesh = this.renderedFace.children[0]
        this.glassMaterial = new THREE.MeshPhysicalMaterial({ 
            roughness: 0.4,   
            transmission: .8,  
            thickness: .5
        })
        
        this.renderedFaceMesh.material = this.glassMaterial
        this.renderedFaceMesh.scale.set(.7, .7, .7)

        this.directionalLight = new THREE.DirectionalLight(0xafb2ff, 0.5)
        this.directionalLight.position.set(0, 5, 10)
        this.scene.add(this.renderedFaceGroup, this.directionalLight)
    }

    setLookAt() {
        this.lookAtMeshGroup = new THREE.Group()

        this.lookAtMesh = new THREE.Mesh(
            new THREE.BoxGeometry(.1, .1, .1),
            new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                transparent: true,
                opacity: 0
            }),
        )
        this.lookAtMesh.position.z = 1
        this.lookAtMeshGroup.add(this.lookAtMesh)

        this.scene.add(this.lookAtMeshGroup)
    }

    setRenderTarget(){
        this.fovY = (this.camera.position.z + 4) * this.camera.getFilmHeight() / this.camera.getFocalLength()

        this.renderTarget = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height, {
            samples: 2
        })

        this.renderPlaneGeometry = new THREE.PlaneGeometry(1, 1)
        this.renderPlaneMaterial = new THREE.ShaderMaterial({
            vertexShader: renderTargetVertex,
            fragmentShader: renderTargetFragment,
            uniforms: {
                uTexture: new THREE.Uniform()
            },
        })
        this.renderPlane = new THREE.Mesh(this.renderPlaneGeometry, this.renderPlaneMaterial)
        this.renderPlane.scale.set(this.fovY * this.camera.aspect, this.fovY, 1)
        this.renderPlane.position.set(0, 0, -4)

        this.scene.add(this.renderPlane)
    }

    resize(){
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()

        this.renderTarget.setSize(this.sizes.width, this.sizes.height)
        this.renderPlane.scale.set(this.fovY * this.camera.aspect, this.fovY, 1)
    }

    update(){
        // this.renderedFace.rotation.x = (this.cursor.cursorY / this.sizes.width - .2) * 1.3
        // this.renderedFace.rotation.y = (this.cursor.cursorX / this.sizes.height - .8) * .3

        this.lookAtMesh.position.x = (this.cursor.cursorX / this.sizes.width * 2 - 1) * .5
        this.lookAtMesh.position.y = - (this.cursor.cursorY / this.sizes.width * 2 - .5) * .5

        this.renderedFace.lookAt(this.lookAtMesh.position)
        
        this.renderedFace.position.x = (this.renderedFace.position.x + ((this.cursor.cursorX / this.sizes.width - .5) - this.renderedFace.position.x) * .05) * .9
        this.renderedFace.position.y = ((this.renderedFace.position.y) - ((this.cursor.cursorY / this.sizes.height - .5) + this.renderedFace.position.y) * .05) * .9
    }
}