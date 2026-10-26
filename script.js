// Custom cursor: follows the pointer on desktop.
const cursor = document.querySelector(".cursor");

window.addEventListener("pointermove", (event) => {
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
});

document.querySelectorAll("a, button").forEach((item) => {
  item.addEventListener("pointerenter", () => cursor.classList.add("big"));
  item.addEventListener("pointerleave", () => cursor.classList.remove("big"));
});

// Reveal content as it enters the viewport.
const revealItems = document.querySelectorAll(
    ".reveal:not(.hero > .eyebrow):not(.hero-bottom)"
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealItems.forEach((item) => observer.observe(item));

// Keep project hover previews usable on touch screens: clicking a project still follows its link.


const preloader = document.querySelector(".preloader");

if (preloader) {
    // Prevent the page from scrolling during the intro.
    document.body.style.overflow = "hidden";

    window.addEventListener("load", () => {
        setTimeout(() => {
            preloader.classList.add("hide");
            document.body.style.overflow = "";
        }, 1700);
    });
}

function firstPageAnim() {
    const hero = document.querySelector(".hero");

    if (!hero || !window.gsap) {
        document.documentElement.classList.remove("gsap-ready");
        return;
    }

    // Respect accessibility preferences.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.documentElement.classList.remove("gsap-ready");
        return;
    }

    // Prevent duplicate execution.
    if (window.__heroIntroPlayed) return;
    window.__heroIntroPlayed = true;

    const subtitle = hero.querySelector(".eyebrow");
    const lines = hero.querySelectorAll(".title-line > span");
    const greenText = hero.querySelector(".hero-title em");
    const glow = hero.querySelector(".hero-orb");
    const bottom = hero.querySelector(".hero-bottom");
    // Reveal the hidden elements only when GSAP is ready.
    gsap.set(
        [subtitle, ...lines, greenText, glow, bottom],
        { visibility: "visible" }
    );    
    const tl = gsap.timeline({
        defaults: {
            ease: "power3.out"
        },
        onComplete: () => {
            document.documentElement.classList.remove("gsap-ready");
        }
    });

    // // 1. Subtitle appears first.
    tl.to(subtitle, {
        opacity: 1,
        y: 0,
        duration: 0.45
    }, 0.1);

    // 2. Heading lines rise into view one after another.
    tl.to(lines, {
        y: "0%",
        duration: 0.85, // 0.85
        stagger: 0.18
    }, 0.35);

    // 3. Green highlight and ambient glow.
    tl.to(greenText, {
        opacity: 1,
        duration: 0.45,
        ease: "power2.out"
    }, 1.45);

    tl.to(glow, {
        opacity: 1,
        scale: 1,
        duration: 1.1,
        ease: "power2.out"
    }, 0.8);

    // 4. Bottom text and scroll indicator appear last.
    tl.to(bottom, {
        opacity: 1,
        y: 0,
        duration: 0.6
    }, 1.85);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", firstPageAnim, {
        once: true
    });
} else {
    firstPageAnim();
}