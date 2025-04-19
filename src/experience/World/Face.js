import Experience from "../Experience"
import * as THREE from 'three'
import gsap from "gsap"

import renderTargetVertex from '../Shaders/renderTarget/vertex.glsl'
import renderTargetFragment from '../Shaders/renderTarget/fragment.glsl'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default class Face {
    constructor(){
        this.experience = new Experience()
        this.pageChange = this.experience.pageChange
        this.resources = this.experience.resources
        this.canvas = this.experience.canvas
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.cursor = this.experience.cursor

        this.targetPosition = new THREE.Vector2(0, 0)

        this.buttons = document.getElementsByTagName('a')

        this.galleryList = this.resources.galleryList
        this.gallerySlugList = []
        this.galleryList.forEach(item => {
            this.gallerySlugList.push("/gallery/" + item.slug.current + "/")
        })

        this.insightsList = this.resources.insightsList
        this.insightsSlugList = []
        this.insightsList.forEach(item => {
            this.insightsSlugList.push("/insights/" + item.slug.current + "/")
        })

        this.setScene()
        this.setCamera()
        this.setOrbit()
        this.setModel()
        this.setLookAt()
        this.setRenderTarget()
        this.transition()
        this.update()
    }

    setScene(){
        this.scene = new THREE.Scene()
        // this.background = this.resources.items.background
        // this.background.colorSpace = THREE.SRGBColorSpace
        // this.scene.background = this.background
    }

    setCamera(){
        this.camera = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 1, 15)
        this.camera.position.set(0, 0, 5)
        this.scene.add(this.camera)
    }

    setOrbit() {
        const urlParams = new URLSearchParams(window.location.search)
        this.orbitParams = urlParams.get('orbit')
        if (!this.orbitParams) return;
        this.controls = new OrbitControls(this.camera, this.canvas)
        this.controls.enableDamping = true
    }
    

    setModel(){
        this.renderedFaceGroup = new THREE.Group()
        this.renderedFace = this.resources.items.defaultFlat.scene
        this.renderedFaceGroup.add(this.renderedFace)

        this.renderedFaceGroup.position.y = -4


        if(this.pageChange.prevPage === '/'){
            this.renderedFace = this.resources.items.defaultFlat.scene
            if(window.innerWidth > 1280){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.7, .7, .7)
            }

            if(window.innerWidth <= 1280){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.55, .55, .55)
            }
            
            if(window.innerWidth <= 1024){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.4, .4, .4)
            }
    
            if(window.innerWidth <= 768){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.4, .4, .4)
            }

            gsap.to(this.renderedFaceGroup.position, {
                y: 0,
                duration: 1.4
            })
        }
        
        else if(this.pageChange.prevPage === '/about/' || this.pageChange.prevPage === '/about'){
            this.renderedFace = this.resources.items.defaultFlat.scene
            if(window.innerWidth > 1280){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.7, .7, .7)
            }

            if(window.innerWidth <= 1280){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.55, .55, .55)
            }
            
            if(window.innerWidth <= 1024){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.4, .4, .4)
            }
    
            if(window.innerWidth <= 768){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.4, .4, .4)
            }
            gsap.to(this.renderedFaceGroup.position, {
                y: -2,
                duration: 1.4
            })
        }
        
        else if(this.pageChange.prevPage === '/gallery/' || this.pageChange.prevPage === '/gallery'){
            this.renderedFace = this.resources.items.defaultFlat.scene
            if(window.innerWidth > 1280){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.4, .4, .4)
            }

            if(window.innerWidth <= 1280){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.4, .4, .4)
            }
            
            if(window.innerWidth <= 1024){
                this.renderedFace.visible = false
            }
    
            if(window.innerWidth <= 768){
                this.renderedFace.visible = false
            }
            gsap.to(this.renderedFaceGroup.position, {
                y: 0,
                duration: 1.4
            })
        }

        else if (this.gallerySlugList.includes(this.pageChange.prevPage)){
            this.renderedFace = this.resources.items.defaultFlat.scene
            if(window.innerWidth > 1280){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.7, .7, .7)
            }

            if(window.innerWidth <= 1280){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.55, .55, .55)
            }
            
            if(window.innerWidth <= 1024){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.4, .4, .4)
            }
    
            if(window.innerWidth <= 768){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.4, .4, .4)
            }
            gsap.to(this.renderedFaceGroup.position, {
                y: 0,
                duration: 1.4
            })
        } 

        else if(this.pageChange.prevPage === '/insights/' || this.pageChange.prevPage === '/insights'){
            this.renderedFace = this.resources.items.defaultFlat.scene
            if(window.innerWidth > 1280){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.4, .4, .4)
            }

            if(window.innerWidth <= 1280){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.4, .4, .4)
            }
            
            if(window.innerWidth <= 1024){
                this.renderedFace.visible = false
            }
    
            if(window.innerWidth <= 768){
                this.renderedFace.visible = false
            }
            gsap.to(this.renderedFaceGroup.position, {
                y: 0,
                duration: 1.4
            })
        }

        else if (this.insightsSlugList.includes(this.pageChange.prevPage)){
            this.renderedFace = this.resources.items.defaultFlat.scene
            if(window.innerWidth > 1280){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.7, .7, .7)
            }

            if(window.innerWidth <= 1280){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.55, .55, .55)
            }
            
            if(window.innerWidth <= 1024){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.4, .4, .4)
            }
    
            if(window.innerWidth <= 768){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.4, .4, .4)
            }
            gsap.to(this.renderedFaceGroup.position, {
                y: -2,
                duration: 1.4
            })
        } 
        
        else {
            this.renderedFace = this.resources.items.defaultFlat.scene
            if(window.innerWidth > 1280){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.7, .7, .7)
            }

            if(window.innerWidth <= 1280){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.55, .55, .55)
            }
            
            if(window.innerWidth <= 1024){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.4, .4, .4)
            }
    
            if(window.innerWidth <= 768){
                this.renderedFace.visible = true
                this.renderedFace.scale.set(.4, .4, .4)
            }
            gsap.to(this.renderedFaceGroup.position, {
                y: 0,
                duration: 1.4
            })
        }

        this.pageChange.on('pageChange', () => {
            if(this.pageChange.prevPage === '/'){
                this.renderedFace = this.resources.items.defaultFlat.scene
                if(window.innerWidth > 1280){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .7,
                        y: .7,
                        z: .7,
                        duration: 1
                    })
                }
    
                if(window.innerWidth <= 1280){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .55,
                        y: .55,
                        z: .55,
                        duration: 1
                    })
                }
                
                if(window.innerWidth <= 1024){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .4,
                        y: .4,
                        z: .4,
                        duration: 1
                    })
                }
        
                if(window.innerWidth <= 768){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .4,
                        y: .4,
                        z: .4,
                        duration: 1
                    })
                }
                gsap.to(this.renderedFaceGroup.position, {
                    y: 0,
                    duration: 1
                })
            }
            
            else if(this.pageChange.prevPage === '/about/' || this.pageChange.prevPage === '/about'){
                this.renderedFace = this.resources.items.defaultFlat.scene
                if(window.innerWidth > 1280){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .7,
                        y: .7,
                        z: .7,
                        duration: 1
                    })
                }
    
                if(window.innerWidth <= 1280){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .55,
                        y: .55,
                        z: .55,
                        duration: 1
                    })
                }
                
                if(window.innerWidth <= 1024){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .4,
                        y: .4,
                        z: .4,
                        duration: 1
                    })
                }
        
                if(window.innerWidth <= 768){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .4,
                        y: .4,
                        z: .4,
                        duration: 1
                    })
                }
                gsap.to(this.renderedFaceGroup.position, {
                    y: -2,
                    duration: 1
                })
            }
            
            else if(this.pageChange.prevPage === '/gallery/' || this.pageChange.prevPage === '/gallery'){
                this.renderedFace = this.resources.items.defaultFlat.scene
                if(window.innerWidth > 1280){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .4,
                        y: .4,
                        z: .4,
                        duration: 1
                    })
                }
    
                if(window.innerWidth <= 1280){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .4,
                        y: .4,
                        z: .4,
                        duration: 1
                    })
                }
                
                if(window.innerWidth <= 1024){
                    this.renderedFace.visible = false
                }
        
                if(window.innerWidth <= 768){
                    this.renderedFace.visible = false
                }
                gsap.to(this.renderedFaceGroup.position, {
                    y: 0,
                    duration: 1
                })
            }

            else if (this.gallerySlugList.includes(this.pageChange.prevPage)){
                this.renderedFace = this.resources.items.defaultFlat.scene
                if(window.innerWidth > 1280){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .7,
                        y: .7,
                        z: .7,
                        duration: 1
                    })
                }
    
                if(window.innerWidth <= 1280){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .55,
                        y: .55,
                        z: .55,
                        duration: 1
                    })
                }
                
                if(window.innerWidth <= 1024){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .4,
                        y: .4,
                        z: .4,
                        duration: 1
                    })
                }
        
                if(window.innerWidth <= 768){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .4,
                        y: .4,
                        z: .4,
                        duration: 1
                    })
                }
                gsap.to(this.renderedFaceGroup.position, {
                    y: 0,
                    duration: 1
                })
            } 

            else if(this.pageChange.prevPage === '/insights/' || this.pageChange.prevPage === '/insights'){
                this.renderedFace = this.resources.items.defaultFlat.scene
                if(window.innerWidth > 1280){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .4,
                        y: .4,
                        z: .4,
                        duration: 1
                    })
                }
    
                if(window.innerWidth <= 1280){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .4,
                        y: .4,
                        z: .4,
                        duration: 1
                    })
                }
                
                if(window.innerWidth <= 1024){
                    this.renderedFace.visible = false
                }
        
                if(window.innerWidth <= 768){
                    this.renderedFace.visible = false
                }
                gsap.to(this.renderedFaceGroup.position, {
                    y: 0,
                    duration: 1
                })
            }

            else if (this.insightsSlugList.includes(this.pageChange.prevPage)){
                this.renderedFace = this.resources.items.defaultFlat.scene
                if(window.innerWidth > 1280){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .7,
                        y: .7,
                        z: .7,
                        duration: 1
                    })
                }
    
                if(window.innerWidth <= 1280){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .55,
                        y: .55,
                        z: .55,
                        duration: 1
                    })
                }
                
                if(window.innerWidth <= 1024){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .4,
                        y: .4,
                        z: .4,
                        duration: 1
                    })
                }
        
                if(window.innerWidth <= 768){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .4,
                        y: .4,
                        z: .4,
                        duration: 1
                    })
                }
                gsap.to(this.renderedFaceGroup.position, {
                    y: -2,
                    duration: 1
                })
            } 
            
            else {
                this.renderedFace = this.resources.items.defaultFlat.scene
                if(window.innerWidth > 1280){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .7,
                        y: .7,
                        z: .7,
                        duration: 1
                    })
                }
    
                if(window.innerWidth <= 1280){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .55,
                        y: .55,
                        z: .55,
                        duration: 1
                    })
                }
                
                if(window.innerWidth <= 1024){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .4,
                        y: .4,
                        z: .4,
                        duration: 1
                    })
                }
        
                if(window.innerWidth <= 768){
                    this.renderedFace.visible = true
                    gsap.to(this.renderedFace.scale,{
                        x: .4,
                        y: .4,
                        z: .4,
                        duration: 1
                    })
                }
                gsap.to(this.renderedFaceGroup.position, {
                    y: 0,
                    duration: 1
                })
            }
        })

        this.renderedFaceMesh = this.renderedFace.children[0]
        this.glassMaterial = new THREE.MeshPhysicalMaterial({ 
            roughness: 0.3,   
            transmission: .8,  
            thickness: .8
        })
        
        this.renderedFaceMesh.material = this.glassMaterial

        this.directionalLight = new THREE.DirectionalLight(0xafb2ff, 0.5)
        this.directionalLight.position.set(0, 5, 10)
        this.ambientLight = new THREE.AmbientLight(0xafb2ff, 1)
        this.scene.add(this.renderedFaceGroup, this.directionalLight, this.ambientLight)
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
            samples: window.devicePixelRatio === 1 ? 2 : 0
        })

        this.renderPlaneGeometry = new THREE.PlaneGeometry(1, 1)
        this.renderPlaneMaterial = new THREE.ShaderMaterial({
            vertexShader: renderTargetVertex,
            fragmentShader: renderTargetFragment,
            uniforms: {
                uTexture: new THREE.Uniform(),
                uImageSize: new THREE.Uniform(new THREE.Vector2(this.sizes.width, this.sizes.height)),
                uPlaneSize: new THREE.Uniform(new THREE.Vector2(this.fovY * this.camera.aspect, this.fovY)),
            },
        })
        this.renderPlane = new THREE.Mesh(this.renderPlaneGeometry, this.renderPlaneMaterial)
        this.renderPlane.scale.set(this.fovY * this.camera.aspect, this.fovY, 1)
        this.renderPlane.position.set(0, 0, -2)

        this.scene.add(this.renderPlane)

        gsap.to(this.renderPlane.position, {
            z: -4,
            duration: 2,
        })
    }

    transition(){

        this.pageChange.on('pageChange', () => {
            this.renderPlane.position.z = -2
            gsap.to(this.renderPlane.position, {
                z: -4,
                duration: 2,
            })
        })
    }

    resize(){
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()
    }

    update(){
        this.normalizedCursor = new THREE.Vector2(this.cursor.cursorX / this.sizes.width - .5, - (this.cursor.cursorY / this.sizes.height - .5))

        this.targetPosition.lerp(this.normalizedCursor, .05)

        this.lookAtMesh.position.x = (this.cursor.cursorX / this.sizes.width - .5)
        this.lookAtMesh.position.y = - (this.cursor.cursorY / this.sizes.height - .5)

        if (this.orbitParams) {
            this.controls.update();
        }

        if(this.pageChange.prevPage === '/'){
            this.renderedFace.lookAt(this.lookAtMesh.position)
        
            this.renderedFace.position.x = this.renderedFace.position.x = this.targetPosition.x * .4
            this.renderedFace.position.y = this.renderedFace.position.y = this.targetPosition.y * .4
        }
        
        else if(this.pageChange.prevPage === '/about/' || this.pageChange.prevPage === '/about'){
            this.renderedFace.lookAt(this.lookAtMesh.position)
        
            this.renderedFace.position.x = this.renderedFace.position.x = this.targetPosition.x * .4
            this.renderedFace.position.y = this.renderedFace.position.y = this.targetPosition.y * .4
        }
        
        else if(this.pageChange.prevPage === '/gallery/' || this.pageChange.prevPage === '/gallery'){
            this.renderedFace.rotation.set(0, 0, 0)
            this.renderedFace.rotation.y = -this.targetPosition.x * 4
            this.renderedFace.rotation.x = this.targetPosition.y * 2
            this.renderedFace.position.x = this.targetPosition.x * 8
            this.renderedFace.position.y = this.targetPosition.y * 4
        }

        else if (this.gallerySlugList.includes(this.pageChange.prevPage)){
            this.renderedFace.lookAt(this.lookAtMesh.position)
        
            this.renderedFace.position.x = this.renderedFace.position.x = this.targetPosition.x * .4
            this.renderedFace.position.y = this.renderedFace.position.y = this.targetPosition.y * .4
        } 

        else if(this.pageChange.prevPage === '/insights/' || this.pageChange.prevPage === '/insights'){
            this.renderedFace.rotation.set(0, 0, 0)
            this.renderedFace.rotation.y = -this.targetPosition.x * 4
            this.renderedFace.rotation.x = this.targetPosition.y * 2
            this.renderedFace.position.x = this.targetPosition.x * 8
            this.renderedFace.position.y = this.targetPosition.y * 4
        }

        else if (this.insightsSlugList.includes(this.pageChange.prevPage)){
            this.renderedFace.lookAt(this.lookAtMesh.position)
        
            this.renderedFace.position.x = this.renderedFace.position.x = this.targetPosition.x * .4
            this.renderedFace.position.y = this.renderedFace.position.y = this.targetPosition.y * .4
        } 
        
        else {
            this.renderedFace.lookAt(this.lookAtMesh.position)
        
            this.renderedFace.position.x = this.renderedFace.position.x = this.targetPosition.x * .4
            this.renderedFace.position.y = this.renderedFace.position.y = this.targetPosition.y * .4
        }

    }
}