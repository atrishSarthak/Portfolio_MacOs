
import { dockApps } from "#constants/index.js";
import { Tooltip } from "react-tooltip";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import useWindowStore from "#store/window.js";

export const Dock = () => {
    const { windows, openWindow, closeWindow, focusWindow } = useWindowStore();
    const dockRef = useRef(null);

    useGSAP(() => {
        const dock = dockRef.current;
        if (!dock) return;

        const icons = dock.querySelectorAll(".dock-icon");

        const animateIcons = (mouseX) => {
            const { left } = dock.getBoundingClientRect();

            let closestIcon = null;
            let minDistance = Infinity;

            icons.forEach((icon) => {
                const { left: iconLeft, width } = icon.getBoundingClientRect();
                const center = iconLeft - left + width / 2;
                const distance = Math.abs(mouseX - center);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestIcon = icon;
                }
            });


            icons.forEach((icon) => {
                if (icon === closestIcon) {
                    gsap.to(icon, {
                        scale: 1.4,
                        y: -14,
                        duration: 0.08,
                        ease: "back.out(2.2)",
                    });
                } else {
                    gsap.to(icon, {
                        scale: 1,
                        y: 0,
                        duration: 0.08,
                        ease: "power2.out",
                    });
                }
            });
        };

        const handleMouseMove = (e) => {
            const { left } = dock.getBoundingClientRect();
            animateIcons(e.clientX - left);
        };

        const resetIcons = () =>
            icons.forEach((icon) =>
                gsap.to(icon, {
                    scale: 1,
                    y: 0,
                    duration: 0.12,
                    ease: "power2.out",
                })
            );

        dock.addEventListener("mousemove", handleMouseMove);
        dock.addEventListener("mouseleave", resetIcons);

        return () => {
            dock.removeEventListener("mousemove", handleMouseMove);
            dock.removeEventListener("mouseleave", resetIcons);
        };
    }, []);

    const toggleApp = (app) => {
        if (!app.canOpen) return;

        const window = windows[app.id];

        if (window.isOpen) {
            closeWindow(app.id);
        } else {
            openWindow(app.id);
        }
    };

    return (
        <section id="dock">
            <div ref={dockRef} className="dock-container flex gap-1.5 justify-center">
                {dockApps.map(({ id, name, icon, canOpen }) => (
                    <div key={id} className="relative flex justify-center">
                        <button
                            type="button"
                            className="dock-icon transition-all"
                            aria-label={name}
                            data-tooltip-id="dock-tooltip"
                            data-tooltip-content={name}
                            data-tooltip-delay-show={150}
                            disabled={!canOpen}
                            onClick={() => toggleApp({ id, canOpen })}
                        >
                            <img
                                src={`/images/${icon}`}
                                alt={name}
                                loading="lazy"
                                className={`w-[50px] h-[50px] object-contain ${canOpen ? "" : "opacity-60"
                                    }`}
                            />
                        </button>
                    </div>
                ))}

                <Tooltip id="dock-tooltip" place="top" className="tooltip" />
            </div>
        </section>
    );
};

export default Dock;