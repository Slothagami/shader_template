# Shader Template
Libary for easily writing fragment shaders with webGL.

## General Usage
- This libary looks for functions called `setup()` and `render()` for initialisation and drawing respectively. 
- the shaders are set using the global variables `vertex` and `fragment`, they are expected to be strings containing the code for the respective shader.
- use `gl.drawScreen()` to render the shader.
- the render method is not called in a loop, so if that is required use `requestAnimationFrame()`.
- pressing `Tab` saves a screenshot of the shader, this can also be done with the functon `screenshot()`
- the function `radians(deg)` converts angles to radians. 
- see `program.js` or `toy_mandelbulb.js` for examples

## Passing Uniforms
Use these functions to pass variables from the js program to the shaders

### `gl.uniformFloat(uniformName, value)` 
- `uniformName`: `string`. must match the name used in the shader. 
- `value`: `Number` all javascript numbers will be converted to floats before being sent to the gpu.

### `gl.uniformVec3(uniformName, value)` 
- `uniformName`: `string`. must match the name used in the shader. 
- `value`: `Array(3)` 

### `gl.uniformVec2(uniformName, value)` 
- `uniformName`: `string`. must match the name used in the shader. 
- `value`: `Array(2)` 

### `gl.uniformMat4(uniformName, value)` 
- `uniformName`: `string`. must match the name used in the shader. 
- `value`: `Array(16)` 16 element array representing the rows of a 4x4 martix.
