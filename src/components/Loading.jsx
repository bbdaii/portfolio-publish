import { useEffect, useRef } from "react";
import { createPortal } from 'react-dom';
import gsap from "gsap";

export default function Loading({ isLoading = true, onComplete }) {
    const containerRef = useRef();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        if (isLoading) {
            // 進入動畫：從下往上滑入
            // gsap.fromTo(container,
            //     {
            //         // y: "100%"
            //         opacity: 0
            //     },
            //     {
            //         // y: "0%",
            //         opacity: 1,
            //         duration: 0,
            //         ease: "power2.out"
            //     }
            // );
        } else {
            // 離開動畫：從上往下滑出
            // gsap.to(container, {
            //     // y: "100%",
            //     opacity: 0,
            //     duration: 0,
            //     ease: "power2.in",
            //     onComplete: () => {
            //         if (onComplete) onComplete();
            //     }
            // });
        }
    }, [isLoading, onComplete]);

    return (
        createPortal(
            <div
                ref={containerRef}
                className="flex justify-center items-center h-screen w-screen overflow-hidden fixed top-0 bottom-0 left-0 right-0 z-[10000] bg-white"
            // style={{ transform: 'translateY(100%)' }} // 初始位置在下方
            >
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black mr-8"></div>
                <p className="text-2xl font-bold text-black">Loading...</p>
            </div>,
            document.body
        )
    )
}