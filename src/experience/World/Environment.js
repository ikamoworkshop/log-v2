import Experience from "../Experience";
import * as THREE from 'three'

export default class Environment{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;

        // Debug
        if(this.debug.active){
            this.debugFolder = this.debug.ui.addFolder('Environment')
        }

        this.setSunLight();
    };

    setSunLight() {
        this.AmbientLight = new THREE.AmbientLight('#ffffff', 0)
        this.scene.add(this.AmbientLight)
    }
}