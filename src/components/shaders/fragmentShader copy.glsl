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
    float time = uTime * 0.2; // 移除 mod 限制，使用較慢的時間係數
    vec2 pixelSize = vec2(8.0, 16.0);
    vec2 normalizedPixelSize = pixelSize / uResolution;
    
    // 預計算常用值
    float minRes = min(uResolution.x, uResolution.y);
    vec2 aspectRatio = uResolution / minRes;
    
    // 將螢幕座標轉為 0~1 區間，並保持 1:1 比例
    vec2 mouseUv = (uMouse / uResolution) * aspectRatio;
    vec2 uvNormalized = vUv * aspectRatio;

    float distance = distance(uvNormalized, mouseUv);
    distance = fbm(vec2(distance * 0.2), 3); // 從 7 層降到 3 層
    
    vec2 baseUv = vUv + sin(time * uSpeed.xy) * 0.2; // 增加動畫幅度
    vec2 newUv = baseUv * distance;

    float noiseScale = 3.0;
    float noise = simplexNoise3d(vec3(newUv * noiseScale, time * 0.3)); // 加快 noise 動畫
    noise = smoothstep(-1.5, 1.0, noise);

    vec4 color = vec4(noise, noise, noise, 1.0);

    // float luma = dot(vec3(0.2126, 0.7152, 0.0722), color.rgb);
    float luma = dot(vec3(0.2126, 0.7152, 0.0722), color.rgb);
    vec2 cellUV = fract(vUv / normalizedPixelSize);

    // 根據亮度決定線條寬度
    float lineWidth = 0.0;
    if(luma <= 0.2)
        lineWidth = 0.6;
    if(luma > 0.2)
        lineWidth = 0.4;
    if(luma > 0.4)
        lineWidth = 0.2;
    if(luma > 0.6)
        lineWidth = 0.1;
    if(luma > 0.8)
        lineWidth = 0.05;
    // if (luma > 0.99) lineWidth = 0.01;

    // 繪製線條
    float yStart = 0.15;
    float yEnd = 0.85;
    if(cellUV.y > yStart && cellUV.y < yEnd && cellUV.x > 0.0 && cellUV.x < lineWidth) {
        // color = vec4(0.0, 0.0, 0.0, 1.0);
        color = vec4(vec3(0.4), 1.0);
    } else {
        // color = vec4(0.70, 0.74, 0.73, 1.0);
        color = vec4(1.0, 1.0, 1.0, 1.0);
    }

    gl_FragColor = color;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
