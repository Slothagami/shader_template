const fragment = `
    precision highp float;
    uniform vec2 vRes;
    uniform vec2 vRatio;

    uniform vec2 uWorldRot;

    uniform float power;

    mat4 rotateX(float angle) {
        return mat4(
            1, 0,           0,          0,
            0, cos(angle), -sin(angle), 0,
            0, sin(angle),  cos(angle), 0,
            0, 0,           0,          1
        );
    }
    
    mat4 rotateY(float angle) {
        return mat4(
            cos(angle), 0, sin(angle), 0,
            0,          1, 0,          0,
           -sin(angle), 0, cos(angle), 0,
            0,          0, 0,          1
        );
    }
    
    vec3 rotate(vec3 vector, vec2 rot) {
        mat4 rot_x = rotateX(rot.y);
        mat4 rot_y = rotateY(-rot.x);
        mat4 rot_xy = rot_y * rot_x;
        return (rot_xy * vec4(vector, 1.)).xyz;
    }


    float mandelbulb(vec3 pos) {
        vec3 z = pos;
        float dr = 1.;
        float r;

        for(int i = 0; i < 20; i++) {
            r = length(z);
            if(r > 2.) break;

            float theta = acos(z.z / r) * power;
            float phi   = atan(z.y, z.x) * power;
            float zr    = pow(r, power);

            dr = pow(r, power - 1.) * power * dr + 1.;
            z  = zr * vec3(
                sin(theta) * cos(phi), 
                sin(theta) * sin(phi),
                cos(theta)
            );
            z += pos; // Mandelbrot set Part
        }

        return .5 * log(r) * r / dr;
    }


    float world(vec3 point) {
        point = rotate(point, uWorldRot);
        return mandelbulb(point);
    }

    void main() {
        vec2 vUv = ((gl_FragCoord.xy / vRes - vec2(.5)) * vRes) - vec2(.5);
             vUv = (gl_FragCoord.xy / vRes - vec2(.5)) * vRatio;
        vec3 camPos = vec3(0., 0., 3.);
        
        // raymarching
        vec3  ray     = normalize(vec3(vUv, -1.));
        float maxDist = 50.;
        float dist    = 0.;
        vec3  rayPos  = camPos;

        float marches = 0.;
        for(int i = 0; i < 128; i++) {
            rayPos = camPos + ray * dist;
            float ddist = world(rayPos);
            
            if(ddist < .001 || dist > maxDist) break;

            dist += ddist;
            marches++;
        }

        vec3 color = vec3(.05); // background color
        if(dist < maxDist) {
            vec3 dark  = vec3(.01, .01, .06);
            vec3 light = vec3(.3, .5, .7);

            // Rim Lighting
            float depth = rayPos.z + 1.3;
            float rim   = marches / 128.;

            color = mix(dark, light, rim);
        }

        gl_FragColor = vec4(color, 1.);
    }
`

var power           = 8
var world_rotation  = [0, Math.PI/12]

function setup() {

}

function render() {
    world_rotation[0] = (performance.now() / 1000) * .2
    
    // send variables to the shader
    gl.uniformVec2("uWorldRot", world_rotation)
    gl.uniformFloat("power", power)

    gl.drawScreen()
    requestAnimationFrame(render)
}
