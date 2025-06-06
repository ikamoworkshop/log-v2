import Experience from "../../Experience"

import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import gsap from "gsap"

import imageVertex from '../../Shaders/landingPlate/vertex.glsl'
import imageFragment from '../../Shaders/landingPlate/fragment.glsl'

export default class HomeContent {
    constructor(){
        this.experience = new Experience()
        this.pageChange = this.experience.pageChange
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.cursor = this.experience.cursor

        this.buttons = document.getElementsByTagName('a')

        this.setScene()
        this.setCamera()
        this.setTitle()
        this.setTextures()
        this.createImagePlates()
        this.setImagePlates()
        this.responsive()
        this.getImageGroupSize()
        this.transition()
    }

    setScene(){
        this.HomeScene = new THREE.Scene()
        this.background = this.resources.items.background
        this.background.colorSpace = THREE.SRGBColorSpace
        this.HomeScene.background = this.background
    }

    setCamera(){
        this.camera = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 1, 15)
        this.camera.position.set(0, 0, 5)
        this.HomeScene.add(this.camera)
    }

    setTitle(){
        this.spaceBold = this.resources.items.spaceBold
        this.textMaterial = new THREE.MeshBasicMaterial({
            opacity: 0,
            transparent: true
        })
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
        this.HomeTitleOne.position.set(0, .4, 0)

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
        this.HomeTitleTwo.position.set(0, -.4, 0)

        this.textGroup.add(this.HomeTitleOne, this.HomeTitleTwo)
        this.HomeScene.add(this.textGroup)

        gsap.to(this.textMaterial, {
            opacity: 1,
            duration: 4

        })
    }

    responsive(){
        if(window.innerWidth <= 1280){
            this.HomeTitleOne.scale.set(.8, .8, .8)
            this.HomeTitleTwo.scale.set(.8, .8, .8)
            this.HomeTitleOne.position.set(0, .3, 0)
            this.HomeTitleTwo.position.set(0, -.3, 0)
        }
        
        if(window.innerWidth <= 1024){
            this.HomeTitleOne.scale.set(.6, .6, .6)
            this.HomeTitleTwo.scale.set(.6, .6, .6)
            this.HomeTitleOne.position.set(0, .25, 0)
            this.HomeTitleTwo.position.set(0, -.25, 0)
        }

        if(window.innerWidth <= 768){
            this.HomeTitleOne.scale.set(.45, .45, .45)
            this.HomeTitleTwo.scale.set(.45, .45, .45)
            this.HomeTitleOne.position.set(0, .2, 0)
            this.HomeTitleTwo.position.set(0, -.2, 0)
        }
    }

    setTextures(){
        this.sizeBase = 2
        this.transitionObject = {}
        this.transitionObject.uOpacity = 0

        this.textureBridge = this.resources.items.landingOne
        this.textureDesk = this.resources.items.landingTwo
        this.textureGradshow = this.resources.items.landingThree
        this.textureWater = this.resources.items.landingFour
        this.textureAida = this.resources.items.landingFive
        this.textureGrad = this.resources.items.landingSix
        this.textureComic = this.resources.items.landingSeven

        this.imagePlateMaterialBridge = new THREE.ShaderMaterial({
            vertexShader: imageVertex,
            fragmentShader: imageFragment,
            uniforms: {
                uTexture: new THREE.Uniform(this.textureBridge),
                uTextureSize: new THREE.Uniform(new THREE.Vector2(320, 560)),
                uPlaneSize: new THREE.Uniform(new THREE.Vector2(this.sizeBase, this.sizeBase * 2)),
                uOpacity: new THREE.Uniform(this.transitionObject.uOpacity),
            },
            transparent: true,
        })
        this.imagePlateMaterialGradshow = new THREE.ShaderMaterial({
            vertexShader: imageVertex,
            fragmentShader: imageFragment,
            uniforms: {
                uTexture: new THREE.Uniform(this.textureGradshow),
                uTextureSize: new THREE.Uniform(new THREE.Vector2(420, 400)),
                uPlaneSize: new THREE.Uniform(new THREE.Vector2(this.sizeBase, this.sizeBase * 1.2)),
                uOpacity: new THREE.Uniform(this.transitionObject.uOpacity),
            },
            transparent: true,
        })
        this.imagePlateMaterialWater = new THREE.ShaderMaterial({
            vertexShader: imageVertex,
            fragmentShader: imageFragment,
            uniforms: {
                uTexture: new THREE.Uniform(this.textureWater),
                uTextureSize: new THREE.Uniform(new THREE.Vector2(680, 360)),
                uPlaneSize: new THREE.Uniform(new THREE.Vector2(this.sizeBase * 2, this.sizeBase)),
                uOpacity: new THREE.Uniform(this.transitionObject.uOpacity),
            },
            transparent: true,
        })
        this.imagePlateMaterialDesk = new THREE.ShaderMaterial({
            vertexShader: imageVertex,
            fragmentShader: imageFragment,
            uniforms: {
                uTexture: new THREE.Uniform(this.textureDesk),
                uTextureSize: new THREE.Uniform(new THREE.Vector2(480, 400)),
                uPlaneSize: new THREE.Uniform(new THREE.Vector2(this.sizeBase, this.sizeBase * 1.2)),
                uOpacity: new THREE.Uniform(this.transitionObject.uOpacity),
            },
            transparent: true,
        })
        this.imagePlateMaterialComic = new THREE.ShaderMaterial({
            vertexShader: imageVertex,
            fragmentShader: imageFragment,
            uniforms: {
                uTexture: new THREE.Uniform(this.textureComic),
                uTextureSize: new THREE.Uniform(new THREE.Vector2(480, 360)),
                uPlaneSize: new THREE.Uniform(new THREE.Vector2(this.sizeBase, this.sizeBase * 1.2)),
                uOpacity: new THREE.Uniform(this.transitionObject.uOpacity),
            },
            transparent: true,
        })
        this.imagePlateMaterialGrad = new THREE.ShaderMaterial({
            vertexShader: imageVertex,
            fragmentShader: imageFragment,
            uniforms: {
                uTexture: new THREE.Uniform(this.textureGrad),
                uTextureSize: new THREE.Uniform(new THREE.Vector2(520, 280)),
                uPlaneSize: new THREE.Uniform(new THREE.Vector2(this.sizeBase * 2, this.sizeBase)),
                uOpacity: new THREE.Uniform(this.transitionObject.uOpacity),
            },
            transparent: true,
        })
        this.imagePlateMaterialAida = new THREE.ShaderMaterial({
            vertexShader: imageVertex,
            fragmentShader: imageFragment,
            uniforms: {
                uTexture: new THREE.Uniform(this.textureAida),
                uTextureSize: new THREE.Uniform(new THREE.Vector2(360, 420)),
                uPlaneSize: new THREE.Uniform(new THREE.Vector2(this.sizeBase, this.sizeBase * 1.2)),
                uOpacity: new THREE.Uniform(this.transitionObject.uOpacity),
            },
            transparent: true,
        })

        gsap.to(this.transitionObject, {
            uOpacity: .5,
            duration: 4
        })

    }

    transition(){
        for(let i = 0 ; i < this.buttons.length; i++){

            this.buttons[i].addEventListener('click', () => {

                gsap.to(this.textMaterial, {
                    opacity: 0,
                    duration: .5
                })
                
                gsap.to(this.transitionObject, {
                    uOpacity: 0,
                    duration: .5
                })

            })

        }

        this.pageChange.on('pageChange', () => {
            gsap.to(this.textMaterial, {
                opacity: 1,
                duration: .5
            })

            gsap.to(this.transitionObject, {
                uOpacity: .5,
                duration: .5
            })
        })
    }

    createImagePlates(){
        this.imagePlateTall = new THREE.PlaneGeometry(this.sizeBase, this.sizeBase * 2)
        this.imagePlateWide = new THREE.PlaneGeometry(this.sizeBase * 2, this.sizeBase)
        this.imagePlateSquare = new THREE.PlaneGeometry(this.sizeBase, this.sizeBase * 1.2)

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
        this.imagePlateGradshow.position.set(- this.sizeBase * 3, this.sizeBase * .1, 0)
        this.imagePlateWater.position.set(-this.sizeBase * 1.3, - this.sizeBase * 1.8, 0)
        this.imagePlateDesk.position.set(this.sizeBase * .7, this.sizeBase * .1, 0)
        this.imagePlateComic.position.set(this.sizeBase * 2.5, this.sizeBase * 2, 0)
        this.imagePlateGrad.position.set(this.sizeBase * 4, -this.sizeBase * .2, 0)
        this.imagePlateAida.position.set(this.sizeBase * 2, -this.sizeBase * 2.5, 0)

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
        this.buttons = document.getElementsByTagName('a')

        this.normalizedCursor = new THREE.Vector2(this.cursor.cursorX / this.sizes.width - .5, - (this.cursor.cursorY / this.sizes.height - .5))

        this.textGroup.position.x = (this.textGroup.position.x + ((this.cursor.cursorX / this.sizes.width - .5) - this.textGroup.position.x) * .05) * .6
        this.textGroup.position.y = (this.textGroup.position.y - ((this.cursor.cursorY / this.sizes.height - .5) + this.textGroup.position.y) * .05) * .6

        this.imagePlateMaterialBridge.uniforms.uOpacity.value = this.transitionObject.uOpacity
        this.imagePlateMaterialGradshow.uniforms.uOpacity.value = this.transitionObject.uOpacity
        this.imagePlateMaterialWater.uniforms.uOpacity.value = this.transitionObject.uOpacity
        this.imagePlateMaterialDesk.uniforms.uOpacity.value = this.transitionObject.uOpacity
        this.imagePlateMaterialComic.uniforms.uOpacity.value = this.transitionObject.uOpacity
        this.imagePlateMaterialGrad.uniforms.uOpacity.value = this.transitionObject.uOpacity
        this.imagePlateMaterialAida.uniforms.uOpacity.value = this.transitionObject.uOpacity

        // Update Image Grup Position
        this.targetPosition.lerp(this.normalizedCursor, .1)
        this.imagePlateGroup.position.x = - (this.targetPosition.x * this.groupSize.x * .25) - 1
        this.imagePlateGroup.position.y = - (this.targetPosition.y * this.groupSize.y * .25)
    }
}