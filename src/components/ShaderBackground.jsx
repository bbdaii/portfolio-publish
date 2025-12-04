import React, { useEffect, useRef, useState } from 'react';
import Stats from 'stats.js';
import * as THREE from 'three';
import gsap from 'gsap';
import vertexShader from './shaders/vertexShader.glsl';
import fragmentShader from './shaders/fragmentShader.glsl';

export default function ShaderBackground() {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const materialRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const mouseTweenRef = useRef(null); // 儲存 tween 引用
  const animationIdRef = useRef(null); // 儲存 RAF ID
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    // const stats = new Stats();
    // stats.showPanel(0);
    // document.body.appendChild(stats.dom);

    // 場景設置
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer(
      {
        antialias: false, // 關閉抗鋸齒以提升效能
        powerPreference: "high-performance"
      }
    );

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(window.devicePixelRatio, 2)
    }

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(sizes.pixelRatio);

    // 設置canvas樣式為滿版
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    mountRef.current.appendChild(renderer.domElement);

    // 創建shader材質
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(sizes.width, sizes.height) },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uSpeed: { value: new THREE.Vector3(0.05, 0.03, 0.01) },
        uMouseSize: { value: 0.01 }
      },
      vertexShader,
      fragmentShader
    });

    // 創建平面幾何體
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 保存引用
    sceneRef.current = scene;
    materialRef.current = material;

    // 滑鼠移動事件 - 使用平滑動畫，在小螢幕上禁用
    const handleMouseMove = (event) => {
      // 在寬度小於 768px 時禁用鼠標互動
      if (window.innerWidth < 768) return;

      const targetX = event.clientX;
      const targetY = sizes.height - event.clientY; // 翻轉Y軸

      // 如果已有動畫在進行，先終止它
      if (mouseTweenRef.current) {
        mouseTweenRef.current.kill();
      }

      // 創建新動畫並保存引用
      mouseTweenRef.current = gsap.to(mouseRef.current, {
        x: targetX,
        y: targetY,
        duration: 0.6,
        ease: "power2.out",
        // 移除 onUpdate，讓動畫循環統一處理
      });
    };

    // 視窗大小變化處理
    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

      // 更新 windowWidth state
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);

      // Update orthographic camera - 正交相機需要更新邊界而非aspect ratio
      camera.left = -1;
      camera.right = 1;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(sizes.pixelRatio);

      // 確保canvas在resize時保持滿版
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';

      material.uniforms.uResolution.value.set(sizes.width, sizes.height);
    };

    // 動畫循環
    const clock = new THREE.Clock();
    const animate = () => {
      // stats.begin();
      const elapsedTime = clock.getElapsedTime();

      // 更新時間
      material.uniforms.uTime.value = elapsedTime;

      // 更新滑鼠位置（統一在這裡更新）
      material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);

      renderer.render(scene, camera);
      // stats.end();
      animationIdRef.current = requestAnimationFrame(animate);
    };

    // 添加事件監聽器
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // 開始動畫
    animate();

    // 清理函數
    return () => {
      // 清理事件監聽器
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      // 取消動畫循環
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      // 終止 GSAP 動畫
      if (mouseTweenRef.current) {
        mouseTweenRef.current.kill();
      }

      // 清理 DOM 和 Three.js 資源
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      // 釋放 Three.js 資源
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []); // 移除依賴，避免重新建立場景

  return (
    <div className="fixed w-[100vw] h-[100vh] overflow-hidden top-0 left-0 z-[1]">
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
