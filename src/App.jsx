import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './Home.jsx';
import Works from './Works.jsx';
import NotFound from './NotFound.jsx';
import { WorksProvider } from './contexts/WorksContext.jsx';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import { ReactLenis, useLenis } from "lenis/react";
import Header from './components/Header.jsx';
import Loading from './components/Loading.jsx';
import gsap from "gsap";
import ScrollTrigger from "gsap/src/ScrollTrigger";
import Cursor from './components/Cursor.jsx';
import ShaderBackground from './components/ShaderBackground.jsx';
import { useWindowSize } from './hooks/useWindowSize.js';
gsap.registerPlugin(ScrollTrigger);


export default function App() {
    const location = useLocation();
    const { width: windowWidth } = useWindowSize();
    const [isLoading, setIsLoading] = useState(true);
    const lenis = useLenis(({ scroll }) => {
        ScrollTrigger.update();
    });

    useEffect(() => {
        const loadingDuration = 1000;
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, loadingDuration);
        setIsLoading(true);

        return () => clearTimeout(timer);

    }, [location]);

    // 換頁時重置滾動到最Top
    useEffect(() => {
        if (lenis) {
            lenis.scrollTo(0, { immediate: true });
        }
    }, [location, lenis]);

    return (
        <>
            <LanguageProvider>
                <WorksProvider>
                    {isLoading && <Loading />}
                    {/* 只有在桌面版（>768px）才啟用自訂 Cursor 及隱藏原生 cursor */}
                    {windowWidth > 768 && (
                        <>
                            <style>
                                {`
                                    *, *::before, *::after {
                                        cursor: none !important;
                                    }
                                `}
                            </style>
                            <Cursor />
                        </>
                    )}
                    <Header />
                    <ReactLenis
                        root
                        options={{
                            duration: 1.5,
                            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
                            smoothTouch: false,
                            syncTouch: true,
                        }} />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/works/:workId" element={<Works />} />
                        <Route path="*" element={<Home />} />
                    </Routes>
                    {/* ShaderBackground 暫時關閉以改善效能 */}
                    {/* <ShaderBackground /> */}
                </WorksProvider>
            </LanguageProvider>
        </>
    )
}