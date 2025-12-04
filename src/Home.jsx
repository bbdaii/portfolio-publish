import gsap from "gsap";
import { useGSAP } from '@gsap/react';
import ScrollTrigger from "gsap/ScrollTrigger";
import HeroSection from "./components/HeroSection.jsx";
import WorksSection from "./components/WorksSection.jsx";
import AboutSection from "./components/AboutSection.jsx";
import ContactSection from "./components/ContactSection.jsx";
gsap.registerPlugin(useGSAP, ScrollTrigger)


export default function Home() {
    return (
        <>
            <div
                id="container"
                className="max-w-dvw my-padding overscroll-x-none overflow-y-hidden bg-white">
                <HeroSection />
                <WorksSection />
                <AboutSection />
                <ContactSection />
            </div>
        </>

    )
}