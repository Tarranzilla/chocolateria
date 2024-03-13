import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Banner from "@/types/Banner";
import { motion as m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSimpleTranslation } from "@/international/useSimpleTranslation";

type ImageSliderProps = {
    content: Banner[];
};

export default function ImageSlider({ content }: ImageSliderProps) {
    const t = useSimpleTranslation();

    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    function toUrlValidString(str: string) {
        return encodeURIComponent(str);
    }

    const telephone = "5541999977955";
    const message = "Olá gostaria de saber mais sobre os produtos da tropical cacau.";
    const encodedMessage = toUrlValidString(message);

    const intervalRef = useRef<NodeJS.Timeout>();

    const startInterval = () => {
        intervalRef.current = setInterval(() => {
            setActiveIndex((current) => (current + 1) % content.length);
        }, 5000);
    };

    const nextSlide = () => {
        clearInterval(intervalRef.current as NodeJS.Timeout);
        setActiveIndex((current) => (current + 1) % content.length);
        if (isPlaying) {
            startInterval();
        }
    };

    const prevSlide = () => {
        clearInterval(intervalRef.current as NodeJS.Timeout);
        setActiveIndex((current) => (current === 0 ? content.length - 1 : current - 1));
        if (isPlaying) {
            startInterval();
        }
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    // Change slide every 5 seconds
    useEffect(() => {
        if (isPlaying) {
            startInterval();
        }
        return () => clearInterval(intervalRef.current as NodeJS.Timeout);
    }, [content, isPlaying]);

    return (
        <div className="ImageSlider">
            <button className="ImageSlider_Btn ImageSlider_Previous_Btn" onClick={prevSlide}>
                <span className="material-icons ImageSlider_Arrow">arrow_back_ios</span>
            </button>

            <AnimatePresence mode="wait">
                {content.map((contentItem, index) => {
                    if (index === activeIndex) {
                        return (
                            <m.div
                                className="Banner_Slide"
                                key={contentItem.key}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="Banner_Top_Fader"></div>
                                <h1 className="Banner_Title">{contentItem.title}</h1>
                                <h2 className="Banner_SubTitle">{contentItem.subtitle}</h2>

                                <Link href={`https://wa.me/${telephone}?text=${encodedMessage}`} className="Banner_Action_Btn">
                                    Saiba Mais
                                </Link>

                                <Image
                                    src={contentItem.imgSrc}
                                    alt={contentItem.title}
                                    width={contentItem.size.width}
                                    height={contentItem.size.height}
                                    priority={index === 0}
                                />
                            </m.div>
                        );
                    }
                })}
            </AnimatePresence>

            <button className="ImageSlider_Btn ImageSlider_Next_Btn" onClick={nextSlide}>
                <span className="ImageSlider_Arrow material-icons">arrow_forward_ios</span>
            </button>

            <button className="ImageSlider_Btn ImageSlider_StopAnimation_Btn" onClick={togglePlay}>
                {isPlaying ? (
                    <span className="material-icons ImageSlider_Arrow">pause_circle</span>
                ) : (
                    <span className="material-icons ImageSlider_Arrow">play_circle</span>
                )}
            </button>

            <div className="ImageSlider_Indicators">
                {content.map((_, index) => (
                    <div key={index} className={`ImageSlider_Indicator ${index === activeIndex ? "active" : ""}`} />
                ))}
            </div>
        </div>
    );
}
