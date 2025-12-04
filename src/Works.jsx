import { useParams } from "react-router";
import { useContext, useRef, useState, useEffect } from "react";
import { useGSAP } from '@gsap/react';
import gsap from "gsap";
import { WorksContext } from "./contexts/WorksContext.jsx";
import { useNavigate } from "react-router";
import { useLanguage } from "./contexts/LanguageContext.jsx";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
gsap.registerPlugin(SplitText, ScrollTrigger)

export default function Works() {
    const worksData = useContext(WorksContext);
    const { workId } = useParams();
    const navigate = useNavigate();
    const { lang, key } = useLanguage();
    const lenis = useLenis();
    const workRef = useRef(null);
    const workDescriptionRef = useRef(null);
    const workDetailsRef = useRef(null);
    const workImagesRef = useRef(null);
    const splitDescriptionRef = useRef(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const currentIndex = worksData.findIndex(work => work.id === workId);
    const worksCount = worksData.length;
    const prevWorkIndex = currentIndex - 1 < 0 ? worksCount - 1 : currentIndex - 1;
    const nextWorkIndex = currentIndex + 1 > worksCount - 1 ? 0 : currentIndex + 1;

    const handlePrevClick = () => {
        navigate(`/works/${worksData[prevWorkIndex].id}`);
    }

    const handleNextClick = () => {
        navigate(`/works/${worksData[nextWorkIndex].id}`);
    }

    const handleTitleClick = () => {
        if (lenis) {
            lenis.scrollTo(0, { immediate: false });
        }
    }

    const work = worksData.find(work => work.id === workId);

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
        if (workRef.current) {
            // 清理舊的 SplitText
            if (splitDescriptionRef.current) {
                splitDescriptionRef.current.revert();
                splitDescriptionRef.current = null;
            }

            // 確保文字已切換至目前語系再進行 SplitText
            if (workDescriptionRef.current) {
                workDescriptionRef.current.textContent = work.description[lang];
            }

            ScrollTrigger.refresh();
            const splitType = lang === 'en' ? "words,lines" : "chars,lines";
            splitDescriptionRef.current = SplitText.create(workDescriptionRef.current, {
                type: splitType,
                mask: "lines",
                reduceWhiteSpace: false,
            })

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: workRef.current,
                    start: "top 60%",
                    end: "bottom 20%",
                    toggleActions: "restart none resume reset",
                }
            });
            const workDetailsList = workDetailsRef.current.querySelectorAll('li');
            tl
                .fromTo(splitDescriptionRef.current.lines, {
                    y: "100%",
                    opacity: 0,
                }, {
                    duration: 1.0,
                    y: 0,
                    opacity: 1,
                    stagger: 0.1,
                    delay: 1.0,
                    ease: "power2.out",
                })
                .fromTo(workDetailsList, {
                    y: "100%",
                    opacity: 0,
                }, {
                    duration: 1.0,
                    y: 0,
                    opacity: 1,
                    stagger: 0.1,
                    ease: "power2.out",
                }, "<0.5")

                .fromTo(workImagesRef.current, {
                    opacity: 0,
                    clipPath: "inset(0% 0% 100% 0%)",
                }, {
                    duration: 1.0,
                    opacity: 1,
                    clipPath: "inset(0% 0% 0% 0%)",
                    ease: "power2.out",
                }, "<0.5")
        }

        return () => {
            if (splitDescriptionRef.current) {
                splitDescriptionRef.current.revert();
                splitDescriptionRef.current = null;
            }
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, { scope: workRef, dependencies: [workId, key, windowWidth, lang] });
    return (
        <>
            {
                work &&
                <div
                    id={work.id}
                    className="max-w-dvw my-padding overscroll-x-none bg-white">
                    <section className="grid grid-cols-12 w-full relative z-[10]
                     md:h-[calc(100vh/7*9)] sm:h-[calc(100vh/7*9)] h-[calc(100vh/7*9)]
                     md:grid-rows-9 sm:grid-rows-9 grid-rows-9
                     "                     ref={workRef}>
                        <h1 className=" col-start-1 row-span-3 row-start-2 self-start text-6xl font-extrabold leading-none
                        md:col-span-10 sm:col-span-12 col-span-8">{work.shortTitle[lang]}</h1>
                        {windowWidth > 1199 &&
                            <div className="col-span-3 col-start-10 row-span-6 row-start-2">
                                <video
                                    className="h-full object-cover"
                                    src={`./videos/${work.id}.mp4`}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    webkit-playsinline="true"
                                    preload="metadata"
                                    disablePictureInPicture
                                ></video>
                            </div>
                        }
                        <article className="col-start-1 row-span-2 row-start-5
                        md:col-span-11 sm:col-span-12 col-span-8">
                            <p className="text-lg text-left font-regular" ref={workDescriptionRef}>{work.description[lang]}</p>
                        </article>
                        <ul className="col-start-1 row-span-2 row-start-8 inset(0% 0% 100% 0%)   
                        md:col-span-10 sm:col-span-12 col-span-8" ref={workDetailsRef}>
                            <li className="text-lg text-left font-medium">
                                <span>{lang === 'en' ? '(Client)' : '(客戶)'}</span>
                                <span className={lang === 'en' ? 'pl-1' : 'pl-2'}>{work.details.client[lang]}</span>
                            </li>
                            <li className="text-lg text-left font-medium  pt-2">
                                <span >{lang === 'en' ? '(Role)' : '(角色)'}</span>
                                <span className={lang === 'en' ? 'pl-6' : 'pl-2'}>{work.details.role[lang]}</span>
                            </li>
                            <li className="text-lg text-left font-medium  pt-2">
                                <span >{lang === 'en' ? '(Tech)' : '(技術)'}</span>
                                <span className={lang === 'en' ? 'pl-4' : 'pl-2'}>{work.details.tech[lang]}</span>
                            </li>
                        </ul>
                    </section>
                    <section className={`grid gap-4 w-full relative z-[10] 
                    ${windowWidth < 768 ? 'grid-cols-1 h-[calc(100vh/7*28)] grid-rows-28' : windowWidth <= 1199 ? 'grid-cols-2 h-[calc(100vh/7*14)] grid-rows-14' : 'grid-cols-3 h-[calc(100vh/7*7)] grid-rows-7'}`}
                        ref={workImagesRef}>
                        {windowWidth <= 1199 &&
                            <div className="h-full row-span-7 flex items-center md:justify-end sm:justify-center">
                                <video
                                    className="h-full object-contain"
                                    src={`./videos/${work.id}.mp4`}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    webkit-playsinline="true"
                                    preload="metadata"
                                    disablePictureInPicture
                                ></video>
                            </div>
                        }
                        {work.images.map((workImage, index) => (
                            workImage.type === 'image' ? (
                                <div key={workImage.id} className={`h-full row-span-7 flex items-center sm:justify-center ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                                    <img
                                        src={workImage.url}
                                        alt={workImage.id}
                                        className="h-full object-contain border-2 border-black" />
                                </div>
                            ) : (
                                <div key={workImage.id} className={`h-full row-span-7 flex items-center sm:justify-center ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                                    <video
                                        src={workImage.url}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        webkit-playsinline="true"
                                        preload="metadata"
                                        disablePictureInPicture
                                        className="h-full object-contain"
                                    />
                                </div>
                            )
                        ))}
                    </section>
                    <section className="grid grid-cols-12 grid-rows-2 w-full h-[calc(100vh/7*2)]">
                        <div className="col-span-12 col-start-1 row-span-1 row-start-2 grid grid-cols-12 relative z-[10]">
                            <button
                                onClick={handlePrevClick}
                                className="col-start-1 text-left font-regular italic cursor-pointer whitespace-nowrap
                                sm:col-span-6  md:col-span-4  col-span-3 
                                md:text-3xl sm:text-2xl text-5xl">
                                &lt;&lt; {lang === 'en' ? 'prev' : '上一個'}
                            </button>
                            {windowWidth > 1199 &&
                                <button
                                    onClick={handleTitleClick}
                                    className="col-span-6 col-start-4 text-center text-5xl font-bold text-no-wrap cursor-pointer">
                                    (({work.shortTitle[lang]}))
                                </button>
                            }
                            <button
                                onClick={handleNextClick}
                                className=" text-right font-regular italic cursor-pointer whitespace-nowrap
                                  sm:col-span-6  md:col-span-4  col-span-3 
                               sm:col-start-7  md:col-start-9 col-start-10
                               md:text-3xl sm:text-2xl text-5xl">
                                {lang === 'en' ? 'next' : '下一個'} &gt;&gt;
                            </button>
                        </div>
                    </section>
                </div>
            }
        </>
    )
}