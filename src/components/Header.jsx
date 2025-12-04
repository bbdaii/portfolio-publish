import { useLenis } from "lenis/react";
import { useLocation, useNavigate } from "react-router";
import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function Header() {
    const lenis = useLenis();
    const location = useLocation();
    const navigate = useNavigate();
    const { lang, toggleLang } = useLanguage();

    const handleClick = (sectionId) => {
        if (location.pathname !== '/') {
            navigate('/', { replace: true });
            setTimeout(() => {
                directToSection(sectionId);
            }, 500);
        } else {
            scrollToSection(sectionId);
        }
    }
    const handleLangClick = () => {
        toggleLang();
        scrollToTop();
    }

    const scrollToTop = () => {
        lenis.scrollTo(0, {
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
            smoothTouch: false,
            immediate: false,
        });
    }
    const directToSection = (sectionId) => {
        const element = document.querySelector(`#${sectionId}`);
        lenis.scrollTo(element, {
            duration: 0,
            immediate: true,
        })
    }
    const scrollToSection = (sectionId) => {
        const element = document.querySelector(`#${sectionId}`);
        if (element) {
            lenis.scrollTo(element, {
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
                smoothTouch: false,
                immediate: false,
                offset: 0,
            });
        }
    };

    return (
        <header className="grid grid-cols-12 grid-rows-1 text-lg fixed top-0 right-0 left-0 my-margin z-1000 mix-blend-difference text-white">
            <button
                className="font-bold col-span-4 col-start-1 row-span-1 text-left text-no-wrap cursor-pointer
                md:self-start"
                onClick={() => handleClick('hero-section')}>
                Deb Dai
            </button>
            <ul className="flex flex-row  items-center font-medium col-span-3 col-start-10 row-span-1 justify-between text-right 
            md:flex-col md:items-end 
            sm:flex-col sm:items-end">
                <li>
                    <button
                        className="cursor-pointer hover:italic"
                        onClick={() => handleLangClick()}>
                        ({lang === 'en' ? '中' : 'EN'})
                    </button>
                </li>
                <li className="sm:hidden"><button
                    className="cursor-pointer hover:italic"
                    onClick={() => handleClick('works-section')}>
                    {lang === 'en' ? 'Works' : '作品'}
                </button>
                </li>
                <li className="sm:hidden"><button
                    className="cursor-pointer hover:italic"
                    onClick={() => handleClick('about-section')}>
                    {lang === 'en' ? 'About' : '關於'}
                </button>
                </li>
                <li className="sm:hidden"><button
                    className="cursor-pointer hover:italic"
                    onClick={() => handleClick('contact-section')}>
                    {lang === 'en' ? 'Contact' : '聯絡'}
                </button>
                </li>
            </ul>
        </header>
    )
}