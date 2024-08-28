uniform sampler2D uTexture;
uniform vec2 uImageSize;
uniform vec2 uPlaneSize;

varying vec2 vUv;

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

    vec4 color = texture2D(uTexture, newUv);

    gl_FragColor = color;

    #include <colorspace_fragment>
    // #include <tonemapping_fragment>
}