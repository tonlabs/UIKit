/**
 * This is a template on a hlsl version of the shaders.
 * My intention was to create a `hlsl` shader and then using `spirv-cross`
 * compile it to `glsl` and `metal`, also it would give `Vulkan` support as well
 * but for now I didn't manage to get appropriate results from it,
 * hence I put it on pause for now.
 */


struct ShimmerUniforms {
    float gradientWidth;
    float skew;
    float progressShift;
    float2 resolution;
    float4 backgroundColor;
    float4 accentColor;
};

#define PI 3.14159265359

float normalizeX(float x, float min, float max) {
    return (x - min) / (max - min);
}

float4 mirroredLinearHorizontalGradient(float x) {
    if (x < 0.5) {
        float nx = normalizeX(x, 0.0, 0.5);
        return smoothstep(0.0, 1.0, float4(float3(nx, nx, nx), 1.0));
    } else {
        float nx = 1.0 - normalizeX(x, 0.5, 1.0);
        return smoothstep(0.0, 1.0, float4(float3(nx, nx, nx), 1.0));
    }
}

float4 gradient(float4 accent, float4 background, float x, float min, float max) {
    if (x < min || x > max) {
        return background;
    }

    float nx = normalizeX(x, min, max);

    return lerp(background, accent, mirroredLinearHorizontalGradient(nx));
}

struct ShimmerVertexOut {
  float4 position : SV_Position;
};

float4 shimmer_frag(ShimmerVertexOut input, ShimmerUniforms inUniforms) : SV_Target {
    float gradientWidth = inUniforms.gradientWidth / inUniforms.resolution.x;
    float2 currentPoint = input.position.xy / inUniforms.resolution;
    float ratio = inUniforms.resolution.y / inUniforms.resolution.x;
    float skewX = currentPoint.y * tan(inUniforms.skew * (PI / 180.0)) * ratio;

    return gradient(
        inUniforms.accentColor,
        inUniforms.backgroundColor,
        currentPoint.x,
        0.0 + skewX,
        gradientWidth + skewX
    );
}