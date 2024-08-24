uniform sampler2D uTexture;
uniform float uOpacity;
uniform vec2 uImageSize;
uniform vec2 uPlaneSize;
uniform sampler2D uGrainTexture;

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
	vec4 grain = texture2D(uGrainTexture, roundUv);

    vec2 newUv = getUv(vUv, uImageSize, uPlaneSize);
    float distanceToCenter = length(roundUv - vec2(.5));

    if(distanceToCenter > .5)
        discard;

	float r = .49;
	float g_out = pow(distanceToCenter/r, 110.);
	float mag_out = .5 - cos(g_out - 1.0);
	vec2 uvOut = distanceToCenter > r ? roundUv + mag_out * (roundUv - vec2(.5)) : roundUv;

    vec2 displayUv = newUv + (grain.rg * .05) + uvOut * .1;
    vec4 color = texture2D(uTexture, displayUv);
    
    color.a = uOpacity;

    gl_FragColor = color;

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}