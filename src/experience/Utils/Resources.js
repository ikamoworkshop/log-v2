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
        }
    }

    sourceLoaded(source, file){
        this.items[source.name] = file;

        this.loaded++

        this.loadPercentage = this.loaded / this.toLoad
        this.loaderText = document.getElementById('loader-text')
        this.loaderBox = document.getElementById('loader-container')
        this.loaderContainer = document.getElementById('loader-move')
        this.loaderContainerWidth = this.loaderContainer.getBoundingClientRect().width

        this.loaderContainer.style.transform = `translateX(${this.loadPercentage * window.innerWidth - this.loaderContainerWidth}px)`
        this.loaderText.textContent = `${Math.round(this.loadPercentage * 100)}`
            
        if(this.loaded === this.toLoad){
            this.loaderBox.style.opacity = '0'
            setTimeout(() => {
                this.loaderBox.style.display = 'none'
            }, 1000)
            setTimeout(() => {
                this.loaderBox.style.filter = 'blur(6vmax)'
                this.trigger('ready')
            }, 100)
        }

    }
};