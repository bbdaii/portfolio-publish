import { useContext, useRef, useState, useEffect } from "react";
import { useGSAP } from '@gsap/react';
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import { aboutData } from "../datas/aboutData.js";
import { useLanguage } from "../contexts/LanguageContext.jsx";
gsap.registerPlugin(SplitText, ScrollTrigger)

export default function AboutSection() {
    const { aboutMe } = aboutData;
    const { lang, key } = useLanguage();
    const aboutRef = useRef(null);
    const aboutArticleRef = useRef(null);
    const splitRef = useRef(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        let resizeTimer;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                setWindowWidth(window.innerWidth);
            }, 150);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimer);
        };
    }, []);

    useGSAP(() => {
        if (aboutArticleRef.current) {
            // 清理舊的 SplitText
            if (splitRef.current) {
                splitRef.current.revert();
            }

            
            // 確保文字已切換至目前語系再進行 SplitText
            if (aboutArticleRef.current) {
                aboutArticleRef.current.textContent = aboutMe[lang];
            }

            splitRef.current = SplitText.create(aboutArticleRef.current, {
                type: "words,lines",
                mask: "lines", 
            });
            gsap.fromTo(splitRef.current.lines, {
                y: "100%",
                opacity: 0,
            }, {
                duration: 1.0,
                y: 0,
                opacity: 1,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: aboutRef.current,
                    start: "top 60%",
                    end: "bottom 20%",
                    toggleActions: "restart pause resume  reset", //onEnter 、 onLeave 、 onEnterBack、 onLeaveBack
                }
            });
        }

        return () => {
            if (splitRef.current) {
                splitRef.current.revert();
            }
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, { scope: aboutRef, dependencies: [windowWidth, key] });

    return (
        <section
            ref={aboutRef}
            id="about-section"
            className="grid grid-cols-12 w-full h-screen relative z-[10]
            sm:grid-rows-4  grid-rows-7
            sm:h-[calc(100vh/7*4)] h-screen">
            <article
                ref={aboutArticleRef}
                className="font-medium col-span-8 col-start-5 
                md:text-xl sm:text-lg text-2xl
                sm:row-span-4 row-span-4 
                sm:row-start-1 row-start-3
                md:col-start-5  sm:col-start-4 col-start-5 
                md:col-span-7 sm:col-span-9 col-span-8
            ">
                {aboutMe[lang]}
            </article>
        </section>
    )
}