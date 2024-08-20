uniform sampler2D uTexture;
uniform float uOpacity;
uniform vec2 uImageSize;
uniform vec2 uPlaneSize;

varying vec2 vUv;
varying vec2 roundUv;

vec2 getUv(vec2 uv, vec2 texureSize, vec2 planeSize){
	vec2 tempUV = uv - vec2(.5);

	float planeAspect = planeSize.x / planeSize.y;
	float textureAspect = texureSize.x / texureSize.y;

	if(planeAspect < textureAspect){
		tempUV = tempUV * vec2(planeAspect/textureAspect, 1.);
	}else{
		tempUV = tempUV * vec2(1., textureAspect/planeAspect);
	}


	tempUV += vec2(0.5);
	return tempUV;
}

void main(){
    vec2 newUv = getUv(vUv, uImageSize, uPlaneSize);
    float distanceToCenter = length(roundUv - vec2(.5));

    if(distanceToCenter > .5)
        discard;

    vec4 color = texture2D(uTexture, newUv);
    
    color.a = uOpacity;

    gl_FragColor = color;

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}