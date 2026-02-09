import React, { useRef } from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const FONT_WEIGHTS = {
    subtitle: { min: 100, max: 400, default: 100 },
    title: { min: 400, max: 900, default: 400 }
}

const renderText = (text, className, baseWeight = 400) => {
    return [...text].map((char, index) => (
        <span
            key={index}
            className={className}
            style={{ fontVariationSettings: `'wght' ${baseWeight}` }}>
            {char === ' ' ? '\u00A0' : char}
        </span>
    ))
}

const setupTextHover = (container, type) => {
    if (!container) return;

    const letters = container.querySelectorAll('span');
    const { min, max, default: base } = FONT_WEIGHTS[type];
    const animateLetters = (letter, weight, duration = 0.25) => {
        gsap.to(letter, {
            duration,
            ease: 'power2.out',
            fontVariationSettings: `'wght' ${weight}`,
        })
    };

    const handleMouseMove = (e) => {
        const mouseX = e.clientX; // Mouse position relative to viewport

        letters.forEach((letter) => {
            const { left: l, width: w } = letter.getBoundingClientRect(); // Letter position relative to viewport
            const letterCenter = l + w / 2;
            const distance = Math.abs(mouseX - letterCenter);
            const intensity = Math.exp(-(distance ** 2) / 15000);
            const weight = min + (max - min) * intensity;

            animateLetters(letter, weight);
        });
    };

    const handleMouseLeave = () => {
        letters.forEach((letter) => {
            animateLetters(letter, base, 0.3);
        });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
    };
};

const Welcome = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useGSAP(() => {
        const cleanupTitle = setupTextHover(titleRef.current, 'title');
        const cleanupSubtitle = setupTextHover(subtitleRef.current, 'subtitle');

        return () => {
            if (cleanupTitle) cleanupTitle();
            if (cleanupSubtitle) cleanupSubtitle();
        }
    }, { scope: titleRef }); // scoping isn't strictly necessary for this vanilla-ish implementation but good practice. actually let's just use empty dependency array and manual cleanup as implemented.

    return (
        <section id="welcome" >
            <p ref={subtitleRef}>
                {renderText(
                    "Hey, I'm Sarthak! Welcome to my",
                    "text-3xl font-georama", 100
                )}
            </p>
            <h1 ref={titleRef} className="mt-7">
                {renderText(
                    "Portfolio",
                    "text-9xl italic font-georama", 100
                )}
            </h1>
            <div className="small-screen">
                <p>This portfolio is degined for desktop/tabled screens</p>
            </div>
        </section>
    )
}

export default Welcome
