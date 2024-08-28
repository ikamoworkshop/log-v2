import Experienece from '../../Experience'

import * as THREE from 'three'
import gsap from 'gsap'

import urlForImage from '../../../sanity/imageBuilder'

import thumbnailVertex from '../../Shaders/thumbnailPlate/vertex.glsl'
import thumbnailFrag from '../../Shaders/thumbnailPlate/fragment.glsl'

export default class InsightsTop {
    constructor(){
        this.experience = new Experienece()
        this.pageChange = this.experience.pageChange
        this.scroll = this.experience.scroll
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.cursor = this.experience.cursor
        this.drag = this.experience.drag

        this.textureLoader = new THREE.TextureLoader()

        this.insightsList = this.resources.insightsList
        this.mainDom = document.getElementById('insights-top')

        this.buttons = document.getElementsByTagName('a')

        this.targetPosition = new THREE.Vector2(0, 0)

        this.setScene()
        this.setCamera()
        this.setThumbnail()
        this.transition()
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

    setThumbnail(){
        this.insightGroup = new THREE.Group()
        this.insightPlateList = []
        this.insightsGeometry = new THREE.PlaneGeometry(2, 2)
        this.gridGap = 2.8

        this.insightsList.forEach((item, i) => {
            const insightData = {}

            insightData.image = new Image()
            insightData.image.src = urlForImage(item.heroImage).url()

            insightData.item = item

            insightData.image.onload = () => {

                insightData.imageSize = new THREE.Vector2(insightData.image.width, insightData.image.height)

                insightData.texture = this.textureLoader.load(insightData.image.src)
                insightData.material = new THREE.ShaderMaterial({
                    vertexShader: thumbnailVertex,
                    fragmentShader: thumbnailFrag,
                    uniforms:{
                        uTexture: new THREE.Uniform(insightData.texture),
                        uGrainTexture: new THREE.Uniform(this.resources.items.grain),
                        uOpacity: new THREE.Uniform(.5),
                        uPlaneSize: new THREE.Uniform(new THREE.Vector2(2,2)),
                        uImageSize: new THREE.Uniform(insightData.imageSize),
                    },
                    transparent: true,
                })

                insightData.mesh = new THREE.Mesh(this.insightsGeometry, insightData.material)

                insightData.mesh.position.y = i * this.gridGap * -1

                this.insightPlateList.push(insightData)
                this.insightGroup.add(insightData.mesh)

                insightData.screenPosition = insightData.mesh.position.clone()
                insightData.screenPosition.project(this.camera)

                const translateX = (this.targetPosition.x * .1) * this.sizes.width * .5
                const translateY = ((insightData.screenPosition.y + (this.gridGap * .97)) * (this.gridGap) * this.sizes.height * .5) * .5

                insightData.anchorButton = document.createElement('a')
                insightData.anchorButton.style.height = '600px'
                insightData.anchorButton.classList.add('insight-link')
                insightData.anchorButton.href = `/insights/` + item.slug.current
                insightData.anchorButton.style.transform = `translate(${translateX}px, ${translateY}px)`

                insightData.typeContainer = document.createElement('div')
                insightData.typeContainer.classList.add('flex', 'gap-16', 'align-center')
                insightData.anchorButton.appendChild(insightData.typeContainer)

                insightData.leftBracket = document.createElement('p')
                insightData.leftBracket.textContent = '['
                insightData.leftBracket.classList.add('text-light', 'index', 'insight-bracket')
                insightData.typeContainer.appendChild(insightData.leftBracket)

                insightData.postTypeText = document.createElement('h3')
                insightData.postTypeText.textContent = item.contentype
                insightData.postTypeText.classList.add('text-light', 'caption-light', 'insight-type')
                insightData.typeContainer.appendChild(insightData.postTypeText)

                insightData.rightBracket = document.createElement('p')
                insightData.rightBracket.textContent = ']'
                insightData.rightBracket.classList.add('text-light', 'index', 'insight-bracket')
                insightData.typeContainer.appendChild(insightData.rightBracket)

                insightData.postTitle = document.createElement('h1')
                insightData.postTitle.textContent = item.title
                insightData.postTitle.classList.add('text-light', 'title', 'insight-title')
                insightData.anchorButton.appendChild(insightData.postTitle)

                window.setTimeout(() => {
                    if(this.mainDom){
                        this.mainDom.appendChild(insightData.anchorButton)
                    }
                }, 100)
            }
        })

        this.pageChange.on('pageChange', () => {
            this.mainDom = document.getElementById('insights-top')

            this.insightPlateList.forEach((object) => {
                const translateX = (this.targetPosition.x * .1) * this.sizes.width * .5
                const translateY = ((object.screenPosition.y + (this.gridGap * .97)) * (this.gridGap) * this.sizes.height * .5) * .5

                object.anchorButton.style.transform = `translate(${translateX}px, ${-translateY}px)`

                window.setTimeout(() => {
                    if(this.mainDom){
                        this.mainDom.appendChild(object.anchorButton)
                    }
                }, 100)
            })
        })

        this.insightGroup.position.y = (2 * this.gridGap)
        this.scene.add(this.insightGroup)
    }

    transition(){
        this.pageChange.on('pageChange', () => {
            this.buttons = document.getElementsByTagName('a')

            this.insightPlateList.forEach((object) => {

                object.mesh.material.uniforms.uOpacity.value = 0
                
                gsap.to(object.mesh.material.uniforms.uOpacity, {
                    value: .5,
                    duration: .5
                })
            })
            
            for(let i = 0 ; i < this.buttons.length; i++){

                this.buttons[i].addEventListener('click', () => {
    
                    this.insightPlateList.forEach(object => {
    
                        object.mesh.material.uniforms.uOpacity.value = .5
                        gsap.to(object.mesh.material.uniforms.uOpacity, {
                            value: 0,
                            duration: .5
                        })
                    })
                })
            }
        })
    }

    update(){
        this.buttons = document.getElementsByTagName('a')

        this.normalizedCursor = new THREE.Vector2(this.cursor.cursorX / this.sizes.width - .5, - (this.cursor.cursorY / this.sizes.height - .5))

        this.targetPosition.lerp(this.normalizedCursor, .05)
        this.insightGroup.position.x = (this.targetPosition.x * .5)
        this.insightGroup.position.y = ((2 * this.gridGap) + this.targetPosition.y * .5)
        
        if(this.insightsList.length === this.insightPlateList.length){

            this.insightPlateList.forEach((object, i) => {
                object.mesh.position.y = ((this.scroll.infiniteScroll / this.sizes.height * 4) + object.mesh.position.y + (this.insightPlateList.length * this.gridGap * -1)) % (this.insightPlateList.length * this.gridGap * -1)

                object.screenPosition = object.mesh.position.clone()
                object.screenPosition.project(this.camera)

                const translateX = (this.targetPosition.x * .1) * this.sizes.width * .5
                const translateY = ((object.screenPosition.y + (this.gridGap * .97)) * (this.gridGap) * this.sizes.height * .5) * .5

                object.anchorButton.style.transform = `translate(${translateX}px, ${-translateY}px)`
            })

        }

    }
}