import Experience from "../Experience";
import Environment from "./Environment";
import TestCube from "./TestCube.js";

export default class World{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.resources.on('ready', () => {
            // Setup
            this.testCube = new TestCube();
        })
    }

    update(){
        if(this.testCube){
            this.testCube.update();
        }
    };
}