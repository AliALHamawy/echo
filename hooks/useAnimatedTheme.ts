'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

export type TransitionVariant =
    | "circle"
    | "square"
    | "triangle"
    | "diamond"
    | "hexagon"
    | "rectangle"
    | "star";

function polygonCollapsed(point: string, vertexCount: number): string {
    const pairs = Array.from({ length: vertexCount }, () => point).join(", ");
    return `polygon(${pairs})`;
}

function getThemeTransitionClipPaths(
    variant: TransitionVariant,
    cx: number,
    cy: number,
    maxRadius: number,
    viewportWidth: number,
    viewportHeight: number
): [string, string] {
    const toX = (x: number) => `${(x / viewportWidth) * 100}%`;
    const toY = (y: number) => `${(y / viewportHeight) * 100}%`;
    const point = (x: number, y: number) => `${toX(x)} ${toY(y)}`;
    const toRadius = (r: number) =>
        `${(r / (Math.hypot(viewportWidth, viewportHeight) / Math.SQRT2)) * 100}%`;

    switch (variant) {
        case "circle":
            return [
                `circle(0% at ${point(cx, cy)})`,
                `circle(${toRadius(maxRadius)} at ${point(cx, cy)})`,
            ];
        case "square": {
            const halfW = Math.max(cx, viewportWidth - cx);
            const halfH = Math.max(cy, viewportHeight - cy);
            const halfSide = Math.max(halfW, halfH) * 1.05;
            const end = [
                point(cx - halfSide, cy - halfSide),
                point(cx + halfSide, cy - halfSide),
                point(cx + halfSide, cy + halfSide),
                point(cx - halfSide, cy + halfSide),
            ].join(", ");
            return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
        }
        default:
            return [
                `circle(0% at ${point(cx, cy)})`,
                `circle(${toRadius(maxRadius)} at ${point(cx, cy)})`,
            ];
    }
}

export function useAnimatedTheme(variant: TransitionVariant = "circle", duration = 400) {
    const [isDark, setIsDark] = useState(false);
    const isTransitioningRef = useRef(false);
    const activeAnimRef = useRef<Animation | null>(null);

    useEffect(() => {
        const updateTheme = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };

        updateTheme();

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    const toggleTheme = useCallback(
        (event?: React.MouseEvent<HTMLElement>) => {
            if (
                isTransitioningRef.current ||
                document.documentElement.dataset.magicuiThemeVt === "active"
            )
                return;

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let x = viewportWidth / 2;
            let y = viewportHeight / 2;

            if (event?.currentTarget) {
                const rect = event.currentTarget.getBoundingClientRect();
                x = rect.left + rect.width / 2;
                y = rect.top + rect.height / 2;
            }

            const maxRadius = Math.hypot(
                Math.max(x, viewportWidth - x),
                Math.max(y, viewportHeight - y)
            );

            const applyTheme = () => {
                const newTheme = !isDark;
                document.documentElement.classList.toggle("dark");
                setIsDark(newTheme);
                localStorage.setItem("theme", newTheme ? "dark" : "light");
            };

            if (typeof document.startViewTransition !== "function") {
                applyTheme();
                return;
            }

            const clipPath = getThemeTransitionClipPaths(
                variant,
                x,
                y,
                maxRadius,
                viewportWidth,
                viewportHeight
            );

            const root = document.documentElement;
            root.dataset.magicuiThemeVt = "active";
            root.style.setProperty("--magicui-theme-toggle-vt-duration", `${duration}ms`);
            root.style.setProperty("--magicui-theme-vt-clip-from", clipPath[0]);

            const cleanup = () => {
                isTransitioningRef.current = false;
                delete root.dataset.magicuiThemeVt;
                root.style.removeProperty("--magicui-theme-toggle-vt-duration");
                root.style.removeProperty("--magicui-theme-vt-clip-from");
                activeAnimRef.current?.cancel();
                activeAnimRef.current = null;
            };

            isTransitioningRef.current = true;
            const transition = document.startViewTransition(() => {
                flushSync(applyTheme);
            });

            if (typeof transition?.finished?.finally === "function") {
                transition.finished.finally(cleanup).catch(() => { });
            } else {
                cleanup();
            }

            transition?.ready?.then(() => {
                const anim = document.documentElement.animate(
                    { clipPath },
                    {
                        duration,
                        easing: "ease-in-out",
                        fill: "forwards",
                        pseudoElement: "::view-transition-new(root)",
                    }
                );
                activeAnimRef.current = anim;
            }).catch(() => { });
        },
        [isDark, variant, duration]
    );

    return { isDark, toggleTheme };
}