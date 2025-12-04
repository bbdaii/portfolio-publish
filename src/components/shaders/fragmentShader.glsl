varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3 uSpeed;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uMouseSize;

#include ./includes/simplexNoise3d.glsl
#include ./includes/fbm.glsl

void main() {
    float time = uTime * 0.2;
    
    // 預計算常用值（移到外層避免重複計算）
    vec2 pixelSize = vec2(8.0, 16.0);
    vec2 normalizedPixelSize = pixelSize / uResolution;
    float minRes = min(uResolution.x, uResolution.y);
    vec2 aspectRatio = uResolution / minRes;
    
    // 簡化座標計算
    vec2 mouseUv = (uMouse / uResolution) * aspectRatio;
    vec2 uvNormalized = vUv * aspectRatio;
    
    // 使用更簡單的距離計算
    float distance = length(uvNormalized - mouseUv);
    // 簡化 fbm 調用，使用更少層數
    distance = fbm(vec2(distance * 0.2), 2); // 從 3 層降到 2 層
    
    // 合併動畫計算
    vec2 animOffset = sin(time * uSpeed.xy) * 0.2;
    vec2 newUv = (vUv + animOffset) * distance;
    
    // 調整 noise 參數以減少計算複雜度
    float noiseScale = 2.5; // 從 3.0 降到 2.5
    float noise = simplexNoise3d(vec3(newUv * noiseScale, time * 0.25)); // 稍微減慢
    noise = smoothstep(-1.2, 0.8, noise); // 調整範圍以減少計算
    
    // 預計算 luma（避免重複的 dot 計算）
    float luma = noise * 0.9126 + noise * 0.7152 + noise * 0.0722; // 等同於 dot 但更快
    
    // 使用 step 函數替代多個 if 語句（GPU 友好）
    float lineWidth = 0.6 * step(luma, 0.2) +
                     0.4 * step(0.2, luma) * step(luma, 0.4) +
                     0.2 * step(0.4, luma) * step(luma, 0.6) +
                     0.1 * step(0.6, luma) * step(luma, 0.8) +
                     0.05 * step(0.8, luma);
    
    // 預計算 cell UV
    vec2 cellUV = fract(vUv / normalizedPixelSize);
    
    // 合併條件檢查
    float isInLine = step(0.1, cellUV.y) * step(cellUV.y, 0.9) * 
                     step(0.0, cellUV.x) * step(cellUV.x, lineWidth);
    
    // 使用 mix 替代分支
    vec3 lineColor = vec3(0.45);
    vec3 bgColor = vec3(1.0);
    vec3 finalColor = mix(bgColor, lineColor, isInLine);
    
    gl_FragColor = vec4(finalColor, 1.0);
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}