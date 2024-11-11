const fragment = `
    precision mediump float;
    uniform vec2 vRes;
    uniform vec2 vRatio;

    uniform float time;

    void main() {
        vec2 vUv = 2.*(gl_FragCoord.xy / vRes) - 1.;
        gl_FragColor = vec4(vUv, 1., 1.);
    }
`

function setup() {

}

function render() {
    let time = (performance.now() / 1000) * 20
    gl.uniformFloat("time", time)

    gl.drawScreen()
    requestAnimationFrame(render)
}
