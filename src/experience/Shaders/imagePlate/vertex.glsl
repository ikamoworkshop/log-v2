varying vec2 vUv;

void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vec2 newUV = uv;

    newUV.x *= .8;
    newUV.x += modelPosition.x * .04 + .1;

    vUv = newUV;
}