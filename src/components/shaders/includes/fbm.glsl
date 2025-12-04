// ===========================================
// FBM 函數庫 - 複製貼上即可使用
// ===========================================

// 基礎 noise 函數 (Simplex Noise)
vec3 permute(vec3 x) { 
    return mod(((x*34.0)+1.0)*x, 289.0); 
}

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                   + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                           dot(x12.zw, x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

// ===========================================
// 標準 FBM 函數 (可調整層數)
// ===========================================
float fbm(vec2 p, int octaves) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    
    for(int i = 0; i < 8; i++) {
        if(i >= octaves) break;
        value += amplitude * snoise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

// 預設 5 層的 FBM (最常用)
float fbm(vec2 p) {
    return fbm(p, 5);
}

// ===========================================
// 特化版本 FBM
// ===========================================

// 雲朵 FBM (較柔和)
float fbmClouds(vec2 p) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    
    for(int i = 0; i < 4; i++) {
        value += amplitude * abs(snoise(p * frequency));
        frequency *= 2.2;
        amplitude *= 0.45;
    }
    return value;
}

// 火焰 FBM (更劇烈變化)
float fbmFire(vec2 p) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    
    for(int i = 0; i < 6; i++) {
        value += amplitude * snoise(p * frequency);
        frequency *= 2.5;
        amplitude *= 0.4;
    }
    return value;
}

// 地形 FBM (更多細節)
float fbmTerrain(vec2 p) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    
    for(int i = 0; i < 7; i++) {
        value += amplitude * snoise(p * frequency);
        frequency *= 2.1;
        amplitude *= 0.48;
    }
    return value * 0.5 + 0.5; // 轉換到 0-1 範圍
}

// 水波 FBM (適合動畫)
float fbmWater(vec2 p, float time) {
    vec2 q = p + vec2(time * 0.1, time * 0.05);
    vec2 r = p + vec2(time * 0.07, time * 0.12);
    
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    
    for(int i = 0; i < 4; i++) {
        value += amplitude * snoise(q * frequency);
        q += r * 0.1;
        frequency *= 2.3;
        amplitude *= 0.5;
    }
    return value;
}

// ===========================================
// 進階 FBM (Ridged 和 Billow)
// ===========================================

// Ridged FBM (山脊效果)
float fbmRidged(vec2 p) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    
    for(int i = 0; i < 5; i++) {
        float n = abs(snoise(p * frequency));
        n = 1.0 - n; // 反轉
        n = n * n;   // 平方增強對比
        value += amplitude * n;
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

// Billow FBM (雲朵泡泡效果)
float fbmBillow(vec2 p) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    
    for(int i = 0; i < 5; i++) {
        value += amplitude * abs(snoise(p * frequency));
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

// ===========================================
// 方向性 FBM (有流向的效果)
// ===========================================
float fbmDirectional(vec2 p, vec2 direction, float time) {
    vec2 flow = direction * time;
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    
    for(int i = 0; i < 5; i++) {
        vec2 pos = p * frequency + flow * float(i) * 0.1;
        value += amplitude * snoise(pos);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

// ===========================================
// 使用範例
// ===========================================

/* 
基本用法：
float noise = fbm(uv * 4.0);
gl_FragColor = vec4(vec3(noise * 0.5 + 0.5), 1.0);

時間動畫：
float noise = fbmWater(uv * 3.0, uTime);

雲朵效果：
float clouds = fbmClouds(uv * 2.0);
clouds = smoothstep(0.0, 0.8, clouds);

地形高度：
float height = fbmTerrain(uv * 6.0);

扭曲效果：
vec2 distortion = vec2(fbm(uv), fbm(uv + 100.0));
vec2 newUv = uv + distortion * 0.1;
float pattern = fbm(newUv * 8.0);
*/