import WaterTexture from "./WaterTexture"

const WaterEffect = {

	name: 'WaterEffect',

	uniforms: {

		'uTexture': { value: null },
        'tDiffuse': { value: null },
	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`
    uniform sampler2D uTexture;
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    #define PI 3.14159265359

    void main(){
        vec4 tex = texture2D(uTexture, vUv);
		// Convert normalized values into regular unit vector
        float vx = -(tex.r *2. - 1.);
        float vy = -(tex.g *2. - 1.);
		// Normalized intensity works just fine for intensity
        float intensity = tex.b;
        float maxAmplitude = 0.05;
        vec2 newUv = vUv;

        newUv.x += vx * intensity * maxAmplitude;
        newUv.y += vy * intensity * maxAmplitude;

        vec4 color = texture2D(tDiffuse, newUv);

        gl_FragColor = color;
    }
`

}

export { WaterEffect };