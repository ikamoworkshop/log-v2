uniform sampler2D uTexture;
uniform float uOpacity;

varying vec2 vUv;

void main(){
    vec4 color = texture2D(uTexture, vUv);
    
    color.a = uOpacity;

    gl_FragColor = color;
    // gl_FragColor = vec4(newUv, 0.0, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}