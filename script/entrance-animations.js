const COLORS = {
  ACCENT: "#f15d30",
  ACCENT_HOVERED: "#bf370d",
  PRIMARY: "#dfbe9c",
  PRIMARY_LIGHT: "#f4d9be",
  PRIMARY_LIGHTER: "#f8e8d8",
  PRIMARY_LIGHTEST: "#faf6f0",
  PRIMARY_DARK: "#54433c",
  CHARCOAL_DARKER: "#1d1d1d",
  CHARCOAL_DARK: "#2c2c2c",
  CHARCOAL: "#363635",
  CHARCOAL_LIGHT: "#414141",
  CHARCOAL_LIGHTEST: "#565656",
  TURF_DARK: "#3d3b36",
  TURF: "#545044",
  TURF_LIGHT: "#645f52",
  TURN_LIGHTEST: "#dad3c0",
  RUST_LIGHT: "#c9b5ac",
  RUST: "#a58574",
};

const DEFAULT = {
  START: "top bottom-=20%",
  DURATION: 0.65,
  DELAY: 0.25,
  DISTANCE: 50,
  EASE: "power4.inOut",
  OPACITY: { START: 0, END: 1 },
  SCALE: { START: 0.95, END: 1 },
  TRANSFORM_ORIGIN: "center center",
};

const commonProperties = {
  distance: DEFAULT.DISTANCE,
  opacity: { start: 0, end: 1 },
  duration: DEFAULT.DURATION,
  ease: DEFAULT.EASE,
};

const fade = {
  up: {
    from: {
      ...commonProperties,
      opacity: commonProperties.opacity.start,
      y: commonProperties.distance,
    },
    to: {
      ...commonProperties,
      opacity: commonProperties.opacity.end,
      y: 0,
    },
  },
  left: {
    from: {
      ...commonProperties,
      opacity: commonProperties.opacity.start,
      x: -commonProperties.distance,
    },
    to: {
      ...commonProperties,
      opacity: commonProperties.opacity.end,
      x: 0,
    },
  },
  right: {
    from: {
      ...commonProperties,
      opacity: commonProperties.opacity.start,
      x: commonProperties.distance,
    },
    to: {
      ...commonProperties,
      opacity: commonProperties.opacity.end,
      x: 0,
    },
  },
  down: {
    from: {
      ...commonProperties,
      opacity: commonProperties.opacity.start,
      y: -commonProperties.distance,
    },
    to: {
      ...commonProperties,
      opacity: commonProperties.opacity.end,
      y: 0,
    },
  },
};

const pop = {
  in: {
    from: {
      opacity: DEFAULT.OPACITY.START,
      scale: DEFAULT.SCALE.START,
      transformOrigin: DEFAULT.TRANSFORM_ORIGIN,
    },
    to: {
      opacity: DEFAULT.OPACITY.END,
      scale: DEFAULT.SCALE.END,
      duration: DEFAULT.DURATION,
      ease: DEFAULT.EASE,
    },
  },
  out: {
    from: {
      opacity: DEFAULT.OPACITY.END,
      scale: DEFAULT.SCALE.END,
      transformOrigin: DEFAULT.TRANSFORM_ORIGIN,
    },
    to: {
      opacity: DEFAULT.OPACITY.START,
      scale: DEFAULT.SCALE.START,
      duration: DEFAULT.DURATION,
      ease: DEFAULT.EASE,
    },
  },
};

function safeQuerySelector(element, selector) {
  try {
    return element.querySelector(selector) || element.querySelector(`[class*='${selector}']`);
  } catch (error) {
    // console.error(`Invalid selector for ${selector}:`, error);
    return null;
  }
}

// function defaultAnimateGroup(selector, options = {}) {
//   const { group = selector, addedDelay = 0, delay = DEFAULT.DELAY, trigger, animation = fade.up } = options;

//   const selectors = Array.isArray(selector) ? selector : [selector];

//   let index = 0;
//   selectors.forEach((sel) => {
//     gsap.utils.toArray(sel).forEach((elem, i) => {
//       const groupSelector = Array.isArray(group) ? group[index] : group;
//       const triggerElement =
//         elem.closest(trigger) ||
//         document.querySelector(trigger) ||
//         elem.closest(`${groupSelector}--row`) ||
//         elem.closest(groupSelector) ||
//         elem.closest(`${sel}--row`) ||
//         elem.closest(".section") ||
//         elem;

//       // console.log(trigger);

//       const main = {
//         from: animation.from,
//         to: {
//           ...animation.to,
//           delay: delay * index + addedDelay,
//           scrollTrigger: {
//             trigger: triggerElement,
//             start: DEFAULT.START,
//           },
//         },
//       };

//       gsap.fromTo(elem, main.from, main.to);

//       index++;
//     });
//   });
// }

// function defaultAnimateSplit(selector, options = {}) {
//   // const { first, second, group, addedDelay } = options;
//   // first: "graphic", second: "body", group: "container", addedDelay: 0
//   const { first = "graphic", second = "body", group = "container", addedDelay = 0 } = options;

//   gsap.utils.toArray(selector).forEach((split) => {
//     const container = safeQuerySelector(split, group);
//     if (!container) return;

//     const body = safeQuerySelector(container, first);
//     const graphic = safeQuerySelector(container, second);
//     if (!body) return;
//     const isBodyFirst = container.children[0] === body;

//       container.classList.add("split-animation");

//     const bodyAnimation = {
//       from: isBodyFirst ? fade.left.from : fade.right.from,
//       to: {
//         ...(isBodyFirst ? fade.left.to : fade.right.to),
//         delay: DEFAULT.DELAY + addedDelay,
//         scrollTrigger: {
//           trigger: split,
//           start: DEFAULT.START,
//         },
//       },
//     };
//     gsap.fromTo(body, bodyAnimation.from, bodyAnimation.to);

//     if (!graphic) return;

//     const graphicAnimation = {
//       from: isBodyFirst ? fade.right.from : fade.left.from,
//       to: {
//         ...(isBodyFirst ? fade.right.to : fade.left.to),
//         delay: addedDelay,
//         scrollTrigger: {
//           trigger: split,
//           start: DEFAULT.START,
//         },
//       },
//     };

//     gsap.fromTo(graphic, graphicAnimation.from, graphicAnimation.to);
//   });
// }

const breakpoints = {
  xs: 0,
  sm: 478,
  md: 767,
  lg: 991,
  xl: 1328,
};

function defaultAnimateSplit(selector, options = {}) {
  // const { first, second, group, addedDelay } = options;
  // first: "graphic", second: "body", group: "container", addedDelay: 0
  const { first = "graphic", second = "body", group = "container", addedDelay = 0 } = options;

  // GSAP MatchMedia
  const mm = gsap.matchMedia();

  mm.add(
    {
      // Define conditions for the matchMedia
      isSmall: `(max-width: ${breakpoints.md}px)`,
      isLarge: `(min-width: ${breakpoints.md + 1}px)`,
    },
    (context) => {
      // Get the condition
      let { isSmall, isLarge } = context.conditions;

      // Loop through each split element
      gsap.utils.toArray(selector).forEach((split) => {
        if (isSmall) return; // Disable animations on small screens

        const container = safeQuerySelector(split, group);
        if (!container) return;

        const body = safeQuerySelector(container, first);
        const graphic = safeQuerySelector(container, second);
        if (!body) return;
        const isBodyFirst = container.children[0] === body;

        container.classList.add("split-animation");

        const fadeDirection = isBodyFirst ? fade.left : fade.right;

        const bodyAnimation = {
          from: fadeDirection.from,
          to: {
            ...fadeDirection.to,
            delay: DEFAULT.DELAY + addedDelay,
            scrollTrigger: {
              trigger: split,
              start: DEFAULT.START,
            },
          },
        };
        gsap.fromTo(body, bodyAnimation.from, bodyAnimation.to);

        if (!graphic) return;

        const graphicFadeDirection = isBodyFirst ? fade.right : fade.left;

        const graphicAnimation = {
          from: graphicFadeDirection.from,
          to: {
            ...graphicFadeDirection.to,
            delay: addedDelay,
            scrollTrigger: {
              trigger: split,
              start: DEFAULT.START,
            },
          },
        };

        gsap.fromTo(graphic, graphicAnimation.from, graphicAnimation.to);
      });
    },
  );
}

function defaultAnimateGroup(selector, options = {}) {
  const { group = selector, addedDelay = 0, delay = DEFAULT.DELAY, trigger, animation = fade.up } = options;

  const selectors = Array.isArray(selector) ? selector : [selector];

  // GSAP MatchMedia
  const mm = gsap.matchMedia();

  mm.add(
    {
      // Define conditions for the matchMedia
      isSmall: `(max-width: ${breakpoints.md}px)`,
      isLarge: `(min-width: ${breakpoints.md + 1}px)`,
    },
    (context) => {
      // Get the condition
      let { isSmall, isLarge } = context.conditions;

      let index = 0;
      selectors.forEach((sel) => {
        gsap.utils.toArray(sel).forEach((elem, i) => {
          if (isSmall) return; // Disable animations on small screens

          const groupSelector = Array.isArray(group) ? group[index] : group;
          const triggerElement =
            elem.closest(trigger) ||
            document.querySelector(trigger) ||
            elem.closest(`${groupSelector}--row`) ||
            elem.closest(groupSelector) ||
            elem.closest(`${sel}--row`) ||
            elem.closest(".section") ||
            elem;

          const main = {
            from: animation.from,
            to: {
              ...animation.to,
              delay: delay * index + addedDelay,
              scrollTrigger: {
                trigger: triggerElement,
                start: DEFAULT.START,
              },
            },
          };

          gsap.fromTo(elem, main.from, main.to);

          index++;
        });
      });
    },
  );
}

document.addEventListener("DOMContentLoaded", function () {
  // wait 0ms before continuing

  setTimeout(entrancesInit, 100);
});

function entrancesInit() {
  const body = document.querySelector("body");
  body.style.setProperty("opacity", 1);
  

  gsap.registerPlugin(ScrollTrigger);

  defaultAnimateGroup(".testimonial");
  defaultAnimateGroup(".profile-card", { addedDelay: DEFAULT.DELAY });
  defaultAnimateGroup(".looking-for");
  defaultAnimateGroup("#expeditions--stages .split-section--col", { trigger: "#expeditions--stages" });

  defaultAnimateGroup("#membership--hero .value-highlight--inner", { group: ".torn-split-section--container", addedDelay: DEFAULT.DELAY });

  defaultAnimateGroup(
    [
      "#partners--hero .separated-hero--paragraph",
      "#partners--hero .separated-hero--graphic",
      "#partners--hero .separated-hero--graphic-wrapper .separated-hero--heading",
    ],
    {
      delay: 0.15,
      group: "#partners--hero",
    },
  );

  defaultAnimateGroup(["h1", ".split-head-content--body", ".split-head-content--image"], {
    delay: 0.15,
    group: "#bootcamp--hero-group",
  });

  defaultAnimateGroup(["#careers--hero h1", "#careers--hero p", "#careers--hero a"], {
    delay: 0.15,
    group: "#careers--hero",
  });

  defaultAnimateGroup("#membership--benefits .value-highlight");

  defaultAnimateGroup(".highlight-block", { trigger: ".section", addedDelay: DEFAULT.DELAY, delay: 0.15 });

  defaultAnimateGroup("#home--featured .featured-expedition--body", { trigger: ".w-dyn-list" });

  defaultAnimateSplit(".split-section:not(#home--pitch-group *)");
  defaultAnimateSplit(".torn-split-section:not(#partners--hero)");

  defaultAnimateSplit(".map-section", {
    first: "[data-map]:not([data-map='expedition'])",
    second: ".map--selection-wrapper",
    group: ".map--container",
    addedDelay: DEFAULT.DELAY,
  });

  defaultAnimateSplit("#membership--application", {
    first: ".split-section--body",
    second: ".signup--image-wrapper",
    group: ".section--container",
  });

  defaultAnimateSplit("#about--form", {
    first: ".split-section--body",
    second: ".signup--image-wrapper",
    group: ".section--container",
  });

  defaultAnimateSplit("#membership--next-steps", {
    first: ".container > *:first-child",
    group: ".container",
  });

  defaultAnimateSplit("#expeditions-subpage--hero", {
    group: ".section-expeditions-hero--inner",
    first: ".section-expeditions-hero--body",
    second: ".section-expeditions-hero--graphic",
  });

  defaultAnimateGroup(".masonry-secondary-section--item a", {
    group: ".masonry-secondary-section--collection-list",
    trigger: ".masonry-secondary-section--container",
    delay: 0.15,
    animation: pop.in,
  });

  defaultAnimateGroup("#membership--next-steps .accordion--panel", { addedDelay: DEFAULT.DELAY, trigger: "#membership--next-steps" });

  defaultAnimateGroup(".section-expeditions-glance--item", {
    delay: 0.15,
    addedDelay: DEFAULT.DELAY,
    trigger: "#expeditions-subpage--hero",
    group: "#expeditions-subpage--hero",
  });

  defaultAnimateGroup("[data-map='expedition']", { addedDelay: DEFAULT.DELAY, group: ".map--container" });

  defaultAnimateGroup("[id*='expeditions-subpage'].split-section h3", { trigger: ".section" });
  defaultAnimateGroup("#home--pitch-intro .split-section h3", { trigger: ".section" });
  defaultAnimateGroup(".bio-card", { group: ".container__wide", addedDelay: DEFAULT.DELAY });

  gsap.utils.toArray(".pitch").forEach(function (pitch) {
    let parent = pitch.closest(".right, .left");
    let rotation = 0;
    let transformOrigin = "center center";

    if (parent && parent.classList.contains("right")) {
      rotation = -5;
      transformOrigin = "right center";
    } else if (parent && parent.classList.contains("left")) {
      rotation = 5;
      transformOrigin = "left center";
    }

    gsap.fromTo(
      pitch,
      {
        opacity: 0,
        y: 100,
        rotation: rotation,
        transformOrigin: transformOrigin,
      },
      {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 1,
        ease: "power4.inOut",
        scrollTrigger: {
          trigger: pitch,
          start: "top 90%",
        },
      },
    );
  });

  gsap.utils.toArray(".layered-background").forEach((elem) => {
    const distance = parseFloat(window.getComputedStyle(elem).getPropertyValue("--parralax-distance"));
    const parent = elem.parentElement;

    gsap.fromTo(
      elem,
      {
        y: -distance,
      },
      {
        y: distance,
        ease: "none",
        scrollTrigger: {
          trigger: parent,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });

  gsap.utils.toArray(".polaroid").forEach((elem, index) => {
    const rotation = parseFloat(window.getComputedStyle(elem).getPropertyValue("--rotation"));
    const translateY = parseFloat(window.getComputedStyle(elem).getPropertyValue("--translate-y")) * 16;

    const dY = 50;
    const dR = 5;

    gsap.fromTo(
      elem,
      {
        opacity: 0,
        rotate: rotation + dR,
        transformOrigin: "bottom left",
        y: translateY + dY,
      },
      {
        opacity: 1,
        rotate: rotation,
        y: translateY,
        ease: "power4.inOut",
        delay: 0.4 * index,
        duration: 1.25,
        scrollTrigger: {
          trigger: elem,
          // start: "top 65%",
          start: DEFAULT.START,
        },
      },
    );
  });

  gsap.utils.toArray(".logo-section--logo-row .logo-section--logo-wrapper").forEach((elem, index) => {
    const parent = elem.parentElement;
    gsap.fromTo(
      elem,
      {
        opacity: 0,
        scale: 0.95,
        transformOrigin: "50% 50%",
      },
      {
        opacity: 1,
        scale: 1,
        ease: "power4.inOut",
        duration: 0.75,
        delay: 0.15 * index,
        scrollTrigger: {
          trigger: parent,
          start: "top 75%",
        },
      },
    );
  });

  gsap.fromTo(
    ".footer--image",
    {
      opacity: 0,
      x: 100,
      willChange: "transform",
    },
    {
      opacity: 0.25,
      x: 0,
      scrollTrigger: {
        scrub: true,
        trigger: ".footer--background",
        start: "top bottom",
        end: "bottom top",
      },
    },
  );

  gsap.utils.toArray(".button").forEach((elem) => {
    const iconElem = elem.querySelector(".button--icon");

    const button = {
      from: {
        backgroundColor: COLORS.ACCENT,
      },
      to: {
        backgroundColor: COLORS.ACCENT_HOVERED,
        duration: 0.15,
        ease: "power1.inOut",
      },
    };

    const icon = {
      from: {
        x: 0,
      },
      to: {
        x: 4,
        duration: 0.15,
        ease: "power2.inOut",
      },
    };

    const buttonAnimation = gsap.fromTo(elem, button.from, button.to).pause();
    const iconAnimation = gsap.fromTo(iconElem, icon.from, icon.to).pause();

    elem.addEventListener("mouseenter", () => buttonAnimation.play());
    elem.addEventListener("mouseleave", () => buttonAnimation.reverse());
    elem.addEventListener("focus", () => buttonAnimation.play());
    elem.addEventListener("blur", () => buttonAnimation.reverse());

    elem.addEventListener("mouseenter", () => iconAnimation.play());
    elem.addEventListener("mouseleave", () => iconAnimation.reverse());
    elem.addEventListener("focus", () => iconAnimation.play());
    elem.addEventListener("blur", () => iconAnimation.reverse());
  });

  const largeSocialButtons = ".social-button:not(.social-button .social-button)";
  gsap.utils.toArray(largeSocialButtons).forEach((elem) => {
    const circleElem = elem.querySelector(".social-button--icon-wrapper");
    const iconElem = elem.querySelector(".social-button--icon");
    const textElem = elem.querySelector(".social-button--text");

    const button = {
      from: {
        backgroundColor: COLORS.CHARCOAL_LIGHTEST,
      },
      to: {
        backgroundColor: COLORS.CHARCOAL,
        duration: 0.15,
        ease: "power1.inOut",
      },
    };

    const circle = {
      from: {
        backgroundColor: COLORS.PRIMARY_LIGHTEST,
      },
      to: {
        backgroundColor: COLORS.CHARCOAL_LIGHTEST,
        duration: 0.15,
        ease: "power1.inOut",
      },
    };

    const icon = {
      from: {
        backgroundColor: COLORS.CHARCOAL_DARK,
        // scale: 1,
      },
      to: {
        backgroundColor: COLORS.PRIMARY_LIGHTEST,
        // scale: 1.15,
        duration: 0.15,
        ease: "power1.inOut",
      },
    };

    const text = {
      from: {
        scaleX: 1,
      },
      to: {
        scaleX: 0.975,
        duration: 0.15,
        ease: "power1.inOut",
      },
    };

    const buttonAnimation = gsap.fromTo(elem, button.from, button.to).pause();
    const circleAnimation = gsap.fromTo(circleElem, circle.from, circle.to).pause();
    const iconAnimation = gsap.fromTo(iconElem, icon.from, icon.to).pause();
    const textAnimation = gsap.fromTo(textElem, text.from, text.to).pause();

    elem.addEventListener("mouseenter", () => buttonAnimation.play());
    elem.addEventListener("mouseleave", () => buttonAnimation.reverse());
    elem.addEventListener("focus", () => buttonAnimation.play());
    elem.addEventListener("blur", () => buttonAnimation.reverse());

    elem.addEventListener("mouseenter", () => circleAnimation.play());
    elem.addEventListener("mouseleave", () => circleAnimation.reverse());
    elem.addEventListener("focus", () => circleAnimation.play());
    elem.addEventListener("blur", () => circleAnimation.reverse());

    elem.addEventListener("mouseenter", () => iconAnimation.play());
    elem.addEventListener("mouseleave", () => iconAnimation.reverse());
    elem.addEventListener("focus", () => iconAnimation.play());
    elem.addEventListener("blur", () => iconAnimation.reverse());

    elem.addEventListener("mouseenter", () => textAnimation.play());
    elem.addEventListener("mouseleave", () => textAnimation.reverse());
    elem.addEventListener("focus", () => textAnimation.play());
    elem.addEventListener("blur", () => textAnimation.reverse());
  });

  gsap.utils.toArray(".footer--copyright a").forEach((elem) => {
    const text = elem.innerHTML;
    elem.innerHTML = "";

    const chars = text.split("");
    const charsHTML = chars.map((char) => `<span>${char === " " ? "&nbsp;" : char}</span>`).join("");
    elem.innerHTML = charsHTML;

    const spans = elem.querySelectorAll("span");

    const timeline = gsap.timeline({ paused: true });

    spans.forEach((span, index) => {
      const delay = 0.05 * index;

      timeline.to(
        span,
        {
          y: -3,
          color: COLORS.ACCENT,
          duration: 0.15,
          ease: "power4.inOut",
          yoyo: true,
          repeat: 1,
          delay: delay,
        },
        0,
      );
    });

    const playAnimations = () => {
      timeline.restart();
    };

    elem.addEventListener("mouseenter", playAnimations);
    elem.addEventListener("focus", playAnimations);
  });

  gsap.utils.toArray(".scroll-video").forEach((video) => {
    const parent = video.closest(".scroll-video--section");
    const embed = video.querySelector(".scroll-video--embed");

    const main = {
      from: {
        "--scroll-video-opacity_progress": 0,
        "--scroll-video-y-offset_progress": 0,
      },
      to: {
        "--scroll-video-opacity_progress": 1,
        "--scroll-video-y-offset_progress": 1,
        scrollTrigger: {
          scrub: true,
          trigger: parent,
          start: "top top",
          end: "bottom bottom+=125%",
        },
      },
    };

    const brad = {
      from: {
        "--scroll-video-border-radius_progress": 0,
      },
      to: {
        "--scroll-video-border-radius_progress": 1,
        scrollTrigger: {
          scrub: true,
          trigger: parent,
          start: "top top",
          end: "bottom bottom+=50%",
        },
      },
    };

    const width = {
      from: {
        "--scroll-video-width_progress": 0,
      },
      to: {
        "--scroll-video-width_progress": 1,
        scrollTrigger: {
          scrub: true,
          trigger: parent,
          start: "top top",
          end: "bottom bottom+=110%",
        },
      },
    };

    const height = {
      from: {
        "--scroll-video-height_progress": 0,
      },
      to: {
        "--scroll-video-height_progress": 1,
        scrollTrigger: {
          scrub: true,
          trigger: parent,
          start: "top top",
          end: "bottom bottom+=125%",
        },
      },
    };

    const rot = 5;
    const rotate = {
      from: {
        "--scroll-video-rotate": rot + "deg",
        "--scroll-video-rotate_inverted": -rot + "deg",
      },
      to: {
        "--scroll-video-rotate": 0 + "deg",
        "--scroll-video-rotate_inverted": 0 + "deg",
        scrollTrigger: {
          scrub: true,
          trigger: parent,
          start: "top top",
          end: "bottom bottom+=175%",
        },
      },
    };

    gsap.fromTo(video, main.from, main.to);
    gsap.fromTo(video, width.from, width.to);
    gsap.fromTo(video, height.from, height.to);
    gsap.fromTo(video, rotate.from, rotate.to);
    gsap.fromTo(video, brad.from, brad.to);
  });

  const stipulations = [
    ":not(#home--pitch-group h3)",
    ":not(.polaroid h3)",
    ":not(.split-section h3)",
    ":not(.toolbelt h3)",
    ":not(.value-highlight--paragraph)",
  ];

  const h3s = document.querySelectorAll("h3" + stipulations.join(""));
  const ps = document.querySelectorAll("h3" + stipulations.join("") + " + p");

  const mm = gsap.matchMedia();

  mm.add(
    {
      isSmall: `(max-width: ${breakpoints.md}px)`,
      isLarge: `(min-width: ${breakpoints.md + 1}px)`,
    },
    (context) => {
      let { isSmall, isLarge } = context.conditions;

      if (isSmall) return;

      gsap.utils.toArray(h3s).forEach((h3) => {
        const scrollFade = {
          from: fade.up.from,
          to: {
            ...fade.up.to,
            scrollTrigger: {
              trigger: h3,
              start: DEFAULT.START,
              duration: DEFAULT.DURATION,
              ease: "power4.inOut",
            },
          },
        };

        gsap.fromTo(h3, scrollFade.from, scrollFade.to);
      });

      gsap.utils.toArray(ps).forEach((p) => {
        const scrollFade = {
          from: fade.up.from,
          to: {
            ...fade.up.to,
            scrollTrigger: {
              trigger: p,
              start: DEFAULT.START,
              duration: DEFAULT.DURATION,
              delay: 0.15,
              ease: "power4.inOut",
            },
          },
        };

        gsap.fromTo(p, scrollFade.from, scrollFade.to);
      });
    },
  );

  if (window.location.pathname === "/") {
    const heading = document.querySelector("#home--hero .heading");
    const subheading = document.querySelector("#home--hero p");

    gsap.fromTo(heading, fade.up.from, fade.up.to);
    gsap.fromTo(subheading, fade.up.from, {
      ...fade.up.to,
      delay: 0.5, // Adjust delay for staggering
    });
  }

  if (window.location.pathname.toLowerCase() === "/bootcamp") {
    (() => {
      const imgs = document.querySelectorAll(".toolbelt--slide-image-wrapper img");

      gsap.utils.toArray(imgs).forEach((img) => {
        const scrollPop = {
          from: pop.in.from,
          to: {
            ...pop.in.to,
            scrollTrigger: {
              trigger: ".toolbelt",
              start: DEFAULT.START,
              duration: DEFAULT.DURATION,
              ease: DEFAULT.EASE,
            },
          },
        };

        gsap.fromTo(img, scrollPop.from, scrollPop.to);
      });
    })();
  }
}
