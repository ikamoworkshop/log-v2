varying vec2 vUv;
varying vec2 roundUv;

void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vec2 newUV = uv;

    newUV *= .8;

    newUV.x += modelPosition.x * .09 + .05;
    newUV.y += modelPosition.y * .09 + .05;

    vUv = newUV;
    roundUv = uv;
}