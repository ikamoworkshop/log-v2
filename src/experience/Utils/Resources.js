import EventEmitter from "./EventEmitter";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

import { getAllGallery, getAllInsights } from '../../sanity/api'

const galleryList = await getAllGallery()
const insightsList = await getAllInsights()

export default class Resource extends EventEmitter{
    constructor(sources){
        super();
        
        this.sources = sources;

        // Setup
        this.items = {}
        this.galleryList = galleryList
        this.insightsList = insightsList
        this.toLoad = this.sources.length
        this.loaded = 0

        // Loaders
        this.setLoader();
        this.startLoading();
    }

    setLoader(){
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.fontLoader = new FontLoader()
        this.loaders.audioLoader = new THREE.AudioLoader()
    };

    startLoading(){
        // Loade each source
        for(const source of this.sources){
            if(source.type === 'gltfModel'){
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file);
                    }
                )
            }
            else if(source.type === 'texture'){
                this.loaders.textureLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file);
                    }
                )
            }
            else if(source.type === 'font'){
                this.loaders.fontLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if(source.type === 'audio'){
                this.loaders.audioLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }
        }
    }

    sourceLoaded(source, file){
        this.items[source.name] = file;

        this.loaded++

        this.loadPercentage = this.loaded / this.toLoad
        this.loaderText = document.getElementById('loader-text')
        this.loaderBox = document.getElementById('loader-container')
        this.loaderContainer = document.getElementById('loader-move')

        this.audioContainer = document.getElementById('audio-container')
        this.withoutAudio = document.getElementById('without-audio')
        this.withAudio = document.getElementById('with-audio')
        this.audioToggle = document.getElementById('audio-toggle')
        this.audioPlay = false
        this.loaderContainerWidth = this.loaderContainer.getBoundingClientRect().width

        this.loaderContainer.style.transform = `translateX(${this.loadPercentage * window.innerWidth - this.loaderContainerWidth}px)`
        this.loaderText.textContent = `${Math.round(this.loadPercentage * 100)}`
            
        if(this.loaded === this.toLoad){
            this.audioListener = new THREE.AudioListener()
            this.sound = new THREE.Audio(this.audioListener)
    
            this.audioSound = this.items.backgroundAudio
    
            this.sound.setBuffer(this.audioSound)
            this.sound.setLoop(true);
            this.sound.setVolume(.5)

            this.audioContainer.style.display = 'flex'

            setTimeout(() => {
                this.loaderContainer.style.opacity = '0'
                this.audioContainer.style.opacity = '1'
            }, 500)

            this.withoutAudio.addEventListener('click', () => {
                this.loaderBox.style.opacity = '0'
                this.loaderBox.style.filter = 'blur(6vmax)'
                this.trigger('ready')
                this.audioPlay = false
                setTimeout(() => {
                    this.loaderBox.style.display = 'none'
                }, 1000)
            })

            this.withAudio.addEventListener('click', () => {
                this.loaderBox.style.opacity = '0'
                this.loaderBox.style.filter = 'blur(6vmax)'
                this.audioToggle.classList.add('audio-toggled')
                this.audioPlay = true
                this.sound.play()
                this.trigger('ready')
                setTimeout(() => {
                    this.loaderBox.style.display = 'none'
                }, 1000)
            })

            this.audioToggle.addEventListener('click', () => {
                if(this.audioPlay === true){
                    this.audioPlay = false
                    this.audioToggle.classList.remove('audio-toggled')
                    this.sound.pause()
                }
                else if(this.audioPlay === false) {
                    this.audioPlay = true
                    this.audioToggle.classList.add('audio-toggled')
                    this.sound.play()
                }
            })
        }

    }
};