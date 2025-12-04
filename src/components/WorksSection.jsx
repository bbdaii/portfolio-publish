import { Link } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { WorksContext } from "../contexts/WorksContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import gsap from "gsap";
import { useGSAP } from '@gsap/react';
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger)

export default function WorksSection() {
    const worksData = useContext(WorksContext);
    const { lang } = useLanguage();
    const [hoveredWork, setHoveredWork] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const videoRef = useRef(null);
    const videoContainerRef = useRef(null);
    const mousePos = useRef({ x: windowWidth / 2, y: window.innerHeight });
    const worksSectionRef = useRef(null);

    const gridRows = worksData.length;
    const ulClassName = `font-semibold text-no-wrap col-span-12 col-start-1 grid grid-cols-12 grid-rows-${gridRows}
    md:text-2xl sm:text-xl text-4xl 
    md:row-span-4 sm:row-span-3 row-span-5
    md:row-start-3 sm:row-start-2 row-start-2`;

    const videoSize = {
        width: 200,
        height: 300
    }
    // 處理窗口大小變化
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 追踪鼠標位置
    useEffect(() => {
        const handleMouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
            if (videoContainerRef.current && hoveredWork) {
                gsap.to(videoContainerRef.current, {
                    x: e.clientX + videoSize.width / 2, // 調整偏移量
                    y: e.clientY + videoSize.height / 2,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        };

        const handleScroll = () => {
            checkMousePosition();
        };

        const checkMousePosition = () => {
            const elements = document.querySelectorAll('[data-work-id]');
            let foundHover = false;

            elements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const isHovered = mousePos.current.x >= rect.left &&
                    mousePos.current.x <= rect.right &&
                    mousePos.current.y >= rect.top &&
                    mousePos.current.y <= rect.bottom;

                const workId = element.getAttribute('data-work-id');

                if (isHovered && (!hoveredWork || hoveredWork.id !== workId)) {
                    foundHover = true;
                    handleMouseEnter(workId);
                } else if (!isHovered && hoveredWork && hoveredWork.id === workId) {
                    handleMouseLeave();
                }
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [hoveredWork]);

    // 處理 video 顯示動畫
    useEffect(() => {
        if (hoveredWork && videoContainerRef.current) {
            // 立即設置初始位置到當前鼠標位置
            gsap.set(videoContainerRef.current, {
                x: mousePos.current.x + videoSize.width / 2,
                y: mousePos.current.y + videoSize.height / 2,
                opacity: 0,
                scale: 0.8
            });

            // 顯示 video 容器
            gsap.to(videoContainerRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: "power2.out"
            });
        }
    }, [hoveredWork]);

    useGSAP(() => {
        if (worksSectionRef.current) {
            const listItems = worksSectionRef.current.querySelectorAll('li');

            // 使用 ScrollTrigger 觸發動畫
            const contentElements = Array.from(listItems).map(li => li.querySelector('a'));
            gsap.to(contentElements, {
                duration: 1.0,
                transform: 'translateY(0)',
                opacity: 1,
                stagger: 0.25,
                ease: "power1.out",
                scrollTrigger: {
                    trigger: worksSectionRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "restart pause resume reset", //onEnter 、 onLeave 、 onEnterBack、 onLeaveBack
                }
            });
        }
    }, { scope: worksSectionRef });

    function handleMouseEnter(workId) {
        // 在寬度小於 768px 時禁用 hover video 效果
        if (windowWidth < 768) return;

        const work = worksData.find(w => w.id === workId);
        if (work) {
            setHoveredWork(work);
        }
    }

    function handleMouseLeave() {
        // 在寬度小於 768px 時禁用 hover video 效果
        if (windowWidth < 768) return;

        if (videoContainerRef.current) {
            setHoveredWork(null)
            gsap.to(videoContainerRef.current, {
                opacity: 0,
                scale: 0.8,
                duration: 0.5,
                ease: "power2.in",

            });
        }
    }


    return (
        <>
            <section
                className="grid grid-cols-12 grid-rows-7 w-full h-screen relative z-[10] isolate" id="works-section">
                <ul className={ulClassName} ref={worksSectionRef}>
                    {worksData.map((work, index) => (
                        <li
                            key={`${work.id}`}
                            className={`col-span-12 col-start-1 row-span-1 flex items-center overflow-hidden clickable`}
                            style={{ gridRowStart: index + 1 }}
                            data-work-id={work.id}
                            onMouseEnter={() => handleMouseEnter(work.id)}
                            onMouseLeave={() => handleMouseLeave()}
                        >
                            <Link to={`/works/${work.id}`} className="flex items-center opacity-0" style={{ transform: 'translateY(300%)', willChange: 'transform, opacity' }}>
                                <span
                                    className={`transition-all duration-300 ease-out overflow-hidden ${hoveredWork && hoveredWork.id === work.id
                                        ? 'w-12 opacity-100 mr-2'
                                        : 'w-0 opacity-0 mr-0'
                                        }`}
                                >
                                    ⭢
                                </span>
                                ({work.year}) {windowWidth > 768 ? work.title[lang] : work.shortTitle[lang]}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Preview Video Container */}
            {hoveredWork && windowWidth > 768 && (
                <div
                    ref={videoContainerRef}
                    className="fixed pointer-events-none z-[100] w-[200px] h-[300px] overflow-hidden"
                    style={{
                        left: 0,
                        top: 0,
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <video
                        ref={videoRef}
                        src={`./videos/${hoveredWork.id}.mp4`}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
        </>
    )
}