document.addEventListener("DOMContentLoaded", () => {
  class Journey {
    constructor(elem) {
      this.elem = elem;
      this.items = Array.from(elem.querySelectorAll(".journey-mobile--item"));
      this.card = {
        elem: elem.querySelector(".journey-mobile--card"),
        width: 0,
      };
      this.content = elem.querySelector(".journey-mobile--content");
      this.pagination = elem.querySelector(".journey-mobile--pagination");
      this.img = elem.querySelector(".journey-mobile--image");
      this.dots = [];
      this.current = 0;
      this.handleResize = this.handleResize.bind(this);
      this.seek = {
        elems: {
          left: elem.querySelector(".journey-mobile--seek.left"),
          right: elem.querySelector(".journey-mobile--seek.right"),
        },
        handleSeek: this.handleSeek.bind(this),
        handleEnd: this.handleEnd.bind(this),
        handleNotEnd: this.handleNotEnd.bind(this),
      };
      this.updateCurrent = this.updateCurrent.bind(this);
    }

    handleResize() {
      const card = this.card.elem;
      const width = parseFloat(window.getComputedStyle(card).width);
      this.card.width = width;
      this.elem.style.setProperty("--item-width", `${width}px`);
    }

    handleSeek(arg) {
      let direction = 0;

      if (typeof arg == "object") {
        const target = arg.target;
        if (target.classList.contains("disabled")) return;
        direction = target.classList.contains("left") ? -1 : 1;
      } else if (typeof arg == "number") {
        direction = arg;
      }

      const min = 0;
      const max = this.items.length - 1;

      let current = this.current + direction;
      current = Math.max(min, Math.min(current, max));
      this.current = current;
      this.updateCurrent();

      if (current === min || current === max) {
        this.seek.handleEnd();
      } else {
        this.seek.handleNotEnd();
      }
    }

    handleEnd() {
      Object.values(this.seek.elems).forEach((elem) => {
        const handle = () => {
          elem.setAttribute("tabindex", "-1");
          elem.setAttribute("aria-disabled", "true");
          elem.classList.add("disabled");
        };

        if (
          (elem.classList.contains("left") && this.current === 0) ||
          (elem.classList.contains("right") &&
            this.current === this.items.length - 1)
        ) {
          handle();
        }
      });
    }

    handleNotEnd() {
      Object.values(this.seek.elems).forEach((elem) => {
        elem.setAttribute("tabindex", "0");
        elem.removeAttribute("aria-disabled");
        elem.classList.remove("disabled");
      });
    }

    updateCurrent() {
      const current = this.current;
      this.elem.style.setProperty("--current-item", current);
      this.dots.forEach((dot, index) => {
        if (index === current) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });

      gsap.to(this.content, {
        x: -current * this.card.width,
        duration: 0.35,
        ease: "power3.inOut",
      });

      const img = this.img;
      const imgWidth = parseFloat(window.getComputedStyle(img).width);
      const moveableSpace = this.card.width - imgWidth;
      const y = parseFloat(
        window.getComputedStyle(img).getPropertyValue("--image-translate-y"),
      );
      const move = current * (moveableSpace / (this.items.length - 1));

      gsap.to(img, {
        x: move,
        y: "20%",
        duration: 0.35,
        ease: "power3.inOut",
      });
    }
  }

  function journeyInit(journey) {
    journeySetInitialVariables(journey);
    journeyAddListeners(journey);
    journeyInitPaginiation(journey);
    journey.seek.handleSeek(0);
  }

  function journeySetInitialVariables(journey) {
    journey.elem.style.setProperty("--item-count", journey.items.length);
    journey.elem.style.setProperty("--current-item", 0);

    journey.items.forEach((item, index) => {
      item.style.setProperty("--item-index", index);
    });
  }

  function journeyAddListeners(journey) {
    journey.handleResize();
    window.addEventListener("resize", journey.handleResize);
    journey.seek.elems.left.addEventListener("click", journey.seek.handleSeek);
    journey.seek.elems.right.addEventListener("click", journey.seek.handleSeek);
    journey.seek.elems.left.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        journey.seek.handleSeek(e);
      }
    });
    journey.seek.elems.right.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        journey.seek.handleSeek(e);
      }
    });
  }

  function journeyInitPaginiation(journey) {
    const pagination = journey.pagination;

    const dot = document.createElement("div");
    dot.classList.add("journey-mobile--dot");

    journey.items.forEach((item, index) => {
      const dotClone = dot.cloneNode();
      journey.dots.push(dotClone);
      dotClone.addEventListener("click", () => {
        journey.seek.handleSeek(index - journey.current);
        // setTimeout(() => {
        //   journey.current = index;
        //   journey.updateCurrent();
        // }, 0);
      });
      pagination.appendChild(dotClone);
    });
  }

  function aboutInit() {
    const journyElems = Array.from(
      document.querySelectorAll(".journey-mobile"),
    );
    const journeys = journyElems.map((journyElem) => new Journey(journyElem));

    journeys.forEach((journey) => journeyInit(journey));
  }

  aboutInit();
});

document.addEventListener("DOMContentLoaded", function () {
  class Graph {
    constructor(element) {
      this.parent = element;
      this.data = this.getData();
    }

    getData() {
      const names = Array.from(this.parent.querySelectorAll(".terrain--name"));
      const values = Array.from(
        this.parent.querySelectorAll(".terrain--value"),
      );
      const allData = names.map((name, index) => new Data(name, values[index]));
      return allData;
    }

    postData() {
      this.data.forEach((data, index) => {
        const cssVar = `--graph-value-${index}`;
        this.parent.style.setProperty(cssVar, `${data.value}%`);
      });
    }
  }

  class Data {
    constructor(name, value) {
      this.name = name.textContent;
      this.value = Number(value.textContent);
      this.elems = {
        name: name,
        value: value,
      };
    }
  }

  function graphsInit() {
    const graphElements = Array.from(document.querySelectorAll("[data-graph]"));
    const graphs = graphElements.map((element) => new Graph(element));
    graphs.forEach((graph) => graph.postData());
  }

  graphsInit();
});

document.addEventListener("DOMContentLoaded", () => {
  if (
    !window.location.pathname.includes("/expeditions/") &&
    window.location.pathname !== "/bootcamp" &&
    window.location.pathname !== "/about"
  )
    return;

  // console.log("check");

  const section = Array.from(
    document.querySelectorAll(
      "#bootcamp--leaders, #about--founders, #expeditions-subpage--riders",
    ),
  )[0];
  const row = section.querySelector(".profile-card--row");
  const leaders = Array.from(row.querySelectorAll(".profile-card"));

  //   the value that follows .grid- on leaders classlist is the number]

  const grid = (() => {
    const gridClass = Array.from(row.classList).find((str) =>
      str.includes("grid-"),
    );
    const gridValue = gridClass ? Number(gridClass.split("-")[1]) : null;
    return gridValue || 3;
  })();

  if (grid == leaders.length) return;

  const newGrid = leaders.length;
  row.classList.remove(`grid-${grid}`);
  row.classList.add(`grid-${newGrid}`);
});

document.addEventListener("DOMContentLoaded", () => {
  let runs = 0;
  // Function to calculate the difference between two dates
  function calculateCountdown(targetDate) {
    const now = new Date();
    const diff = targetDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Add leading zeros if the value is less than 10
    const paddedHours = hours.toString().padStart(2, "0");
    const paddedMinutes = minutes.toString().padStart(2, "0");
    const paddedSeconds = seconds.toString().padStart(2, "0");

    return `${days} • ${paddedHours} • ${paddedMinutes} • ${paddedSeconds}`;
  }

  // Function to update the countdown for each element
  function updateCountdown(element, targetDate) {
    const state = element.getAttribute("data-countdown-state");
    element.innerHTML = calculateCountdown(targetDate);
    if (runs == 0) {
      setTimeout(() => {
        element.setAttribute("data-countdown-state", "ready");
      }, 1000);
    }
    runs++;
  }

  // Find all elements with the data-countdown attribute
  const countdownElements = document.querySelectorAll("[data-countdown]");

  countdownElements.forEach((element) => {
    const dateText = element.innerHTML.trim();
    const targetDate = new Date(dateText);

    if (!isNaN(targetDate.getTime())) {
      updateCountdown(element, targetDate);
      setInterval(() => {
        updateCountdown(element, targetDate);
      }, 1000);
    } else {
      console.error(`Invalid date format: ${dateText}`);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const updateElementProperty = ({
    watch,
    target,
    property = "width",
    name,
    all = false,
  }) => {
    const watchedElements = all ? document.querySelectorAll(watch) : [document.querySelector(watch)];
    if (!watchedElements.length) return;

    watchedElements.forEach((watchedElement) => {
      const computedValue = window.getComputedStyle(watchedElement)[property];
      const targetElements = all ? document.querySelectorAll(target) : [document.querySelector(target)];
      targetElements.forEach((targetElement) => {
        if (targetElement) {
          if (name) {
            targetElement.style.setProperty(name, computedValue);
          } else {
            targetElement.style[property] = computedValue;
          }
        }
      });
    });
  };

  const createObserver = ({ watch, target, property = "width", name, all = false }) => {
    const debouncedUpdateProperty = debounce(
      () => updateElementProperty({ watch, target, property, name, all }),
      100,
    );

    const observer = new MutationObserver(debouncedUpdateProperty);
    const config = { attributes: true, childList: true, subtree: true };

    const watchedElements = all ? document.querySelectorAll(watch) : [document.querySelector(watch)];
    watchedElements.forEach((watchedElement) => {
      if (watchedElement) {
        observer.observe(watchedElement, config);
      }
    });

    window.addEventListener("resize", debouncedUpdateProperty);
    debouncedUpdateProperty();
  };

  window.createObserver = createObserver;
});

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
  // ease: "linear",
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

  // scroll video on membership page
  // gsap.utils.toArray(".scroll-video").forEach((video) => {
  //   const parent = video.closest(".scroll-video--section");
  //   const embed = video.querySelector(".scroll-video--embed");

  //   const main = {
  //     from: {
  //       "--scroll-video-opacity_progress": 0,
  //       "--scroll-video-y-offset_progress": 0,
  //     },
  //     to: {
  //       "--scroll-video-opacity_progress": 1,
  //       "--scroll-video-y-offset_progress": 1,
  //       scrollTrigger: {
  //         scrub: true,
  //         trigger: parent,
  //         start: "top top",
  //         end: "bottom bottom+=125%",
  //       },
  //     },
  //   };

  //   const brad = {
  //     from: {
  //       "--scroll-video-border-radius_progress": 0,
  //     },
  //     to: {
  //       "--scroll-video-border-radius_progress": 1,
  //       scrollTrigger: {
  //         scrub: true,
  //         trigger: parent,
  //         start: "top top",
  //         end: "bottom bottom+=50%",
  //       },
  //     },
  //   };

  //   const width = {
  //     from: {
  //       "--scroll-video-width_progress": 0,
  //     },
  //     to: {
  //       "--scroll-video-width_progress": 1,
  //       scrollTrigger: {
  //         scrub: true,
  //         trigger: parent,
  //         start: "top top",
  //         end: "bottom bottom+=110%",
  //       },
  //     },
  //   };

  //   const height = {
  //     from: {
  //       "--scroll-video-height_progress": 0,
  //     },
  //     to: {
  //       "--scroll-video-height_progress": 1,
  //       scrollTrigger: {
  //         scrub: true,
  //         trigger: parent,
  //         start: "top top",
  //         end: "bottom bottom+=125%",
  //       },
  //     },
  //   };

  //   const rot = 5;
  //   const rotate = {
  //     from: {
  //       "--scroll-video-rotate": rot + "deg",
  //       "--scroll-video-rotate_inverted": -rot + "deg",
  //     },
  //     to: {
  //       "--scroll-video-rotate": 0 + "deg",
  //       "--scroll-video-rotate_inverted": 0 + "deg",
  //       scrollTrigger: {
  //         scrub: true,
  //         trigger: parent,
  //         start: "top top",
  //         end: "bottom bottom+=175%",
  //       },
  //     },
  //   };

  //   gsap.fromTo(video, main.from, main.to);
  //   gsap.fromTo(video, width.from, width.to);
  //   gsap.fromTo(video, height.from, height.to);
  //   gsap.fromTo(video, rotate.from, rotate.to);
  //   gsap.fromTo(video, brad.from, brad.to);
  // });

  const stipulations = [
    ":not(#home--pitch-group h3)",
    ":not(.polaroid h3)",
    ":not(.split-section h3)",
    ":not(.toolbelt h3)",
    ":not(.value-highlight--paragraph)",
    ":not(#about--brotherhood h3)",
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

  const splitTextElems = Array.from(document.querySelectorAll("#about--brotherhood h3"));
  const splitTextAnimators = splitTextElems.map((elem) => new SplitTextAnimator(elem, { type: "words", overlap: 0}));
  splitTextAnimators.forEach((animator) => animator.init());

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  const bootcampHero = document.querySelector("#bootcamp--hero-group");
  if (bootcampHero) bootcampHeroInit(bootcampHero);
  function bootcampHeroInit(hero) {
    const target = hero.querySelector(".split-head-content--image");
    const siteMaxWidthWide = window.getComputedStyle(document.documentElement).getPropertyValue("--site-max-width_wide");

    const from = {
      width: siteMaxWidthWide,
      borderRadius: 40,
    };

    const to = {
      width: "100%",
      borderRadius: 0,
    };

    const scrollTrigger = {
      trigger: body,
      start: "top top",
      end: "110px top",
      scrub: true,
    };

    const compiledTo = {
      ...to,
      scrollTrigger,
    };

    gsap.fromTo(target, from, compiledTo);
  }

  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });

  // call scrollTrigger refresh once every 500ms for 5 seconds
  let i = 0;
  const interval = setInterval(() => {
    i++;
    ScrollTrigger.refresh();
    if (i === 30) clearInterval(interval);
  }, 500);
}

document.addEventListener("DOMContentLoaded", function () {
  class Seek {
    constructor(elem) {
      this.section = elem;
      this.buttons = this.getButtons();
    }

    getButtons() {
      const buttons = Array.from(
        this.section.querySelectorAll(".section-expedition-seek--item"),
      );
      return buttons.map((elem) => new Button(elem, this.section));
    }
  }

  class Button {
    constructor(elem, section) {
      this.section = section;
      this.elem = elem;
      this.dir = this.getDirection();
      this.headings = this.getHeadings();
      this.background = this.getBackground();
      this.link = null;
      this.img = null;
      this.name = null;
      this.getElements();
    }

    select(param) {
      return this.elem.querySelector(param);
    }

    getBackground() {
      return this.elem.querySelector(
        ".section-expedition-seek--background-image",
      );
    }

    getHeadings() {
      const headingsParam = ".section-expedition-seek--heading";
      const headings = Array.from(this.elem.querySelectorAll(headingsParam));
      return headings;
    }

    getDirection() {
      return this.elem.classList.contains("prev")
        ? "prev"
        : this.elem.classList.contains("next")
          ? "next"
          : null;
    }

    async getElements() {
      const link = await buttonGetElement(this.section, this.dir, "a");
      const img = await buttonGetElement(
        this.section,
        this.dir,
        ".w-dyn-item img",
      );
      const name = await buttonGetElement(
        this.section,
        this.dir,
        ".w-dyn-item p",
      );

      this.link = { elem: link, value: link.href };
      this.img = { elem: img, value: img.src };
      this.name = { elem: name, value: name.textContent };

      this.postElements();
    }

    postElements() {
      this.background.src = this.img.value;
      this.elem.href = this.link.value;

      this.headings.forEach((heading) => {
        heading.textContent = this.name.value;
      });
    }
  }

  function buttonGetElement(section, dir, selector) {
    const parentQuery = `.section-expedition-seek--item.${dir}`;

    
    const checkForElement = (resolve, reject) => {
      const parent = section.querySelector(parentQuery);
      const element = parent ? parent.querySelector(selector) : null;
      if (element) {
        resolve(element);
      } else {
        setTimeout(() => checkForElement(resolve, reject), 100);
      }
    };


    return new Promise((resolve, reject) => {
      checkForElement(resolve, reject);
    });
  }

  function seekInit() {
    const seekElements = Array.from(
      document.querySelectorAll(".section-expedition-seek"),
    );
    const seeks = seekElements.map((element) => new Seek(element));
  }

  setTimeout(seekInit, 0);


});

document.addEventListener("DOMContentLoaded", () => {
  if (!window.location.pathname.includes("/expeditions/")) return;

  const riders = document.getElementById("expeditions-subpage--riders");
  function checkRiders() {
    const noRiders = riders.querySelector(".w-dyn-empty");
    if (!noRiders) return;
    riders.setAttribute("style", "display: none!important;");
    riders.classList.add("w-condition-invisible");
  }
  if (riders) {
    checkRiders();
  }

  const glance = document.getElementById("expeditions-subpage--glance");

  function checkGlanceItems() {
    const inner = glance.querySelector(".section-expeditions-glance--inner");
    const dividerSelector = ".section-expeditions-glance--divider";

    const highlightItems = Array.from(
      glance.querySelector(".section-expeditions-glance--highlights").children,
    );

    const highlightsFlex =
      highlightItems.length < 2 ? 0.175 : highlightItems.length < 3 ? 0.5 : 1;

    inner.style.setProperty("--highlights-count", highlightItems.length);
    inner.style.setProperty("--highlights-flex", highlightsFlex);
  }

  if (glance) {
    checkGlanceItems();
  }

  const seek = document.getElementById("expeditions-subpage--seek");
  
  if (seek) {
    const buttons = Array.from(
      seek.querySelectorAll(".section-expedition-seek--item"),
    );
  
    buttons.forEach((button) => {
      const heading = button.querySelector(".section-expedition-seek--heading");
      const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            if (heading.innerText !== "Heading") {
              button.classList.remove("hide");
              observer.disconnect(); 
            }
          }
        }
      });
  
      observer.observe(heading, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    });
  }
  



});

document.addEventListener("DOMContentLoaded", function () {
  const browserInfo = {
    browser: "",
    isChrome: false,
    isFirefox: false,
    isSafari: false,
    isOpera: false,
    isEdge: false,
    browserFound: false,
  };

  const userAgent = window.navigator.userAgent;

  if (userAgent.indexOf("Chrome") > -1) {
    browserInfo.browser = "Chrome";
    browserInfo.isChrome = true;
    browserInfo.browserFound = true;
  } else if (userAgent.indexOf("Safari") > -1) {
    browserInfo.browser = "Safari";
    browserInfo.isSafari = true;
    browserInfo.browserFound = true;
  } else if (userAgent.indexOf("Firefox") > -1) {
    browserInfo.browser = "Firefox";
    browserInfo.isFirefox = true;
    browserInfo.browserFound = true;
  } else if (userAgent.indexOf("Edge") > -1) {
    browserInfo.browser = "Edge";
    browserInfo.isEdge = true;
    browserInfo.browserFound = true;
  } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
    browserInfo.browser = "Opera";
    browserInfo.isOpera = true;
    browserInfo.browserFound = true;
  } else {
    browserInfo.browser = userAgent;
    browserInfo.browserFound = true;
  }

  if (browserInfo.browserFound) {
    document.documentElement.classList.add(`${browserInfo.browser.toLowerCase()}`);
  }

  if (browserInfo.isSafari) {
    const replaceLineSeparator = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = node.textContent.replace(/\u2028/g, " ");
      } else {
        node.childNodes.forEach((child) => replaceLineSeparator(child));
      }
    };

    replaceLineSeparator(document.body);
  }
});

(function () {
  let timeoutId;

  function updateDimensions() {
    const computedWidth = getComputedStyle(document.documentElement).width;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--screen-width", computedWidth);
    document.documentElement.style.setProperty(
      "--scrollbar-width",
      `${scrollbarWidth}px`,
    );
  }

  function debounceUpdate() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(updateDimensions, 0);
  }

  // Update on resize
  window.addEventListener("resize", debounceUpdate);

  // Update on mutation
  const observer = new MutationObserver(debounceUpdate);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["style"],
  });

  // Initial update
  updateDimensions();
})();

document.addEventListener("DOMContentLoaded", () => {
  // Create the invisible container elements
  const createContainer = (className) => {
    const container = document.createElement("div");
    container.className = className;
    container.style.width = "100%";
    container.style.opacity = "0";
    container.style.visibility = "hidden";
    container.style.pointerEvents = "none";
    container.style.zIndex = "-1";
    document.body.insertAdjacentElement("afterbegin", container);
    return container;
  };

  const container = createContainer("container");
  const containerWide = createContainer("container__wide");

  // Function to set the CSS variables
  const setMaxWidth = () => {
    const computedStyle = getComputedStyle(container);
    const computedStyleWide = getComputedStyle(containerWide);
    const maxWidth = computedStyle.width;
    const maxWidthWide = computedStyleWide.width;
    document.documentElement.style.setProperty(
      "--site-max-width__px",
      maxWidth,
    );
    document.documentElement.style.setProperty(
      "--site-max-width--wide__px",
      maxWidthWide,
    );
  };

  // Debounce function to limit the rate of function calls
  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Run the setMaxWidth function after a timeout of 0s to ensure everything is loaded
  setTimeout(setMaxWidth, 0);

  // Add a resize event listener with debounce
  window.addEventListener("resize", debounce(setMaxWidth, 200));
});

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.querySelectorAll("[data-hide-until-load]").forEach((element) => {
      element.setAttribute("data-hide-until-load", "true");
    });
  }, 200);
});

class Img {
  constructor(elem) {
    this.elem = elem;
    this.src = elem.getAttribute("src");
    this.width = 0;
    this.height = 0;
    this.key = `img-size-${this.src}`;
    this.storedSize = this.getStoredSize();
  }

  init() {
    if (this.storedSize) {
      this.setSize(this.storedSize.width, this.storedSize.height);
    }

    if (this.elem.complete) this.handleLoad({ target: this.elem });
    else this.elem.addEventListener("load", this.handleLoad.bind(this));
  }

  getStoredSize() {
    const stored = localStorage.getItem(this.key);
    return stored ? JSON.parse(stored) : null;
  }

  setSize(width, height) {
    if (!width || !height) return;
    this.elem.setAttribute("width", width);
    this.elem.setAttribute("height", height);
  }

  saveSize(width, height) {
    const size = { width, height, timestamp: Date.now() };
    localStorage.setItem(this.key, JSON.stringify(size));
  }

  handleLoad(e) {
    const img = e.target || this.elem;
    const width = img.naturalWidth;
    const height = img.naturalHeight;

    const widthAttr = img.getAttribute("width");
    const heightAttr = img.getAttribute("height");

    if (widthAttr && widthAttr !== "0" && widthAttr !== "auto" && heightAttr && heightAttr !== "0" && heightAttr !== "auto") {
      return;
    }

    if (!this.storedSize) {
      this.saveSize(width, height);
      return;
    }

    const { width: storedWidth, height: storedHeight } = this.storedSize;
    if (width !== storedWidth || height !== storedHeight) {
      this.saveSize(width, height);
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const imgElems = document.querySelectorAll("img");
  const imgs = Array.from(imgElems).map((elem) => new Img(elem));
  imgs.forEach((img) => img.init());
});

// animations.js

function getCSSVariable(variable) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
}

function setHoverAnimations(dot, bubble) {
  const dotNumber = dot.querySelector(".journey--dot-number");
  const bubbleChildren = bubble.children;

  const accentColor = getCSSVariable("--color--accent");
  const accentHoveredColor = getCSSVariable("--color--accent__hovered");

  let isHovered = false;

  // Set initial state
  gsap.set(bubble, {
    opacity: 0,
    y: 20,
  });

  Array.from(bubbleChildren).forEach((child) => {
    gsap.set(child, {
      opacity: 0,
      y: 20,
    });
  });

  // Idle bobbing animation with random start time
  const randomDelay = Math.random(); // Random delay between 0 and 1 second
  const bobbingAnimation = gsap
    .to(dot, {
      y: -10,
      duration: 1,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut",
      delay: randomDelay,
    })
    .pause();

  function handleMouseEnterFocus() {
    if (!isHovered) {
      isHovered = true;
      bobbingAnimation.pause(); // Pause the bobbing animation

      gsap.to(bubble, {
        duration: 0.3,
        opacity: 1,
        y: 0,
        ease: "power2.out",
      });

      Array.from(bubbleChildren).forEach((child, index) => {
        gsap.to(child, {
          duration: 0.3,
          opacity: 1,
          y: 0,
          ease: "power2.out",
          delay: 0.05 * (index + 1), // Reduced delay for more overlap
        });
      });

      gsap.to(dot, {
        duration: 0.3,
        y: 0, // Return to original position
        backgroundColor: accentHoveredColor,
        rotation: 10,
        ease: "power2.out",
      });

      gsap.to(dotNumber, {
        duration: 0.3,
        scale: 1.1,
        ease: "power2.out",
      });
    }
  }

  function handleMouseLeaveBlur() {
    if (isHovered) {
      isHovered = false;

      gsap.to(bubble, {
        duration: 0.3,
        opacity: 0,
        y: 20,
        ease: "power2.in",
      });

      Array.from(bubbleChildren).forEach((child, index) => {
        gsap.to(child, {
          duration: 0.3,
          opacity: 0,
          y: 20,
          ease: "power2.in",
          delay: 0.05 * (index + 1), // Reduced delay for more overlap
        });
      });

      gsap.to(dot, {
        duration: 0.3,
        backgroundColor: accentColor,
        rotation: 0,
        ease: "power2.in",
        onComplete: () => {
          if (!isHovered) {
            bobbingAnimation.restart(true); // Restart the bobbing animation
          }
        },
      });

      gsap.to(dotNumber, {
        duration: 0.3,
        scale: 1,
        ease: "power2.in",
      });
    }
  }

  dot.addEventListener("mouseenter", handleMouseEnterFocus);
  dot.addEventListener("focus", handleMouseEnterFocus);

  dot.addEventListener("mouseleave", handleMouseLeaveBlur);
  dot.addEventListener("blur", handleMouseLeaveBlur);

  // Start the bobbing animation initially
  bobbingAnimation.play();
}

document.addEventListener("DOMContentLoaded", () => {
  class BubbleManager {
    constructor(section) {
      this.section = section;
      this.heading = this.section.querySelector(".journey--heading");
      this.graphic = this.section.querySelector(".journey--graphic");
      this.image = this.graphic.querySelector("img");
      this.bubbles = [];
      this.largestDistance = 0;
      this.resizeListener = null;
    }

    getBubbles() {
      const bubbleElems = Array.from(
        this.section.querySelectorAll(".journey--bubble-wrapper"),
      );
      bubbleElems.forEach((bubbleElem) => {
        const newBubble = new Bubble(bubbleElem, this);
        this.bubbles.push(newBubble);
      });
    }

    getLargestDistance() {
      this.bubbles.forEach((bubble) => bubble.getDistance());
      this.largestDistance = Math.abs(
        Math.min(...this.bubbles.map((bubble) => bubble.distanceFromTop)),
      );
      // console.log("Largest distance:", this.largestDistance);
    }

    postLargestDistance() {
      const currentLargestDistance = parseFloat(
        getComputedStyle(this.section).getPropertyValue("--largest-distance"),
      );
      if (currentLargestDistance !== this.largestDistance) {
        this.section.style.setProperty(
          "--largest-distance",
          this.largestDistance + "px",
        );
      }
    }

    handleResize() {
      this.getLargestDistance();
      this.postLargestDistance();
    }

    setResizeListener() {
      let resizeTimeout;
      this.resizeListener = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => this.handleResize(), 200);
      };
      window.addEventListener("resize", this.resizeListener);
    }

    checkImageLoad() {
      if (this.image.complete) {
        this.handleResize();
        this.setResizeListener();
      } else {
        this.image.addEventListener("load", () => {
          this.handleResize();
          this.setResizeListener();
        });
      }
    }
  }

  class Bubble {
    constructor(elem, manager) {
      this.elem = elem;
      this.graphic = elem.closest(".journey--graphic");
      this.manager = manager;
      this.height = 0;
      this.distanceFromTop = 0;

      this.getDistance();
      this.setHoverAnimations();
    }

    getDistance() {
      const graphicRect = this.graphic.getBoundingClientRect();
      const bubbleRect = this.elem.getBoundingClientRect();
      this.distanceFromTop = bubbleRect.top - graphicRect.top;
    }

    setHoverAnimations() {
      const dot = this.elem.querySelector(".journey--dot");
      const bubble = this.elem.querySelector(".journey--bubble");
      const heading = this.manager.heading;

      setHoverAnimations(dot, bubble, heading);
    }
  }

  function initJourney() {
    const journeySections = document.querySelectorAll(".journey-section");
    journeySections.forEach((section) => {
      const bubbleManager = new BubbleManager(section);
      bubbleManager.getBubbles();
      bubbleManager.checkImageLoad();
    });
  }

  initJourney();
});

document.addEventListener('DOMContentLoaded', () => {
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const updateLineCount = debounce((element) => {
        const lineCount = Math.floor(element.scrollHeight / parseFloat(getComputedStyle(element).lineHeight));
        element.style.setProperty('--line-count', lineCount);

        if (element.hasAttribute('data-hide-until-load')) {
            element.setAttribute('data-hide-until-load', 'true');
            setTimeout(() => {
                element.removeAttribute('data-hide-until-load');
            }, 200);
        }
    }, 200);

    const processElements = () => {
        document.querySelectorAll('[data-line-count]').forEach((element) => {
            updateLineCount(element);
        });
    };

    // Initial line count update
    processElements();

    // Mutation observer to watch for changes in the DOM
    const observer = new MutationObserver(processElements);
    observer.observe(document.body, { childList: true, subtree: true });

    // Event listener for viewport resize
    window.addEventListener('resize', processElements);
});

document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector(".looking-for") === null) return;

  const target = document.querySelector(".looking-for");
  const parentElement = target.parentElement;

  const logPercentageDistance = () => {
    let distanceToBottom =
      target.offsetTop / (parentElement.offsetHeight - target.offsetHeight);

    const scrollTargets = document.querySelectorAll(".looking-for--scroll");
    const totalTargets = scrollTargets.length;
    let activeIndex = -1;

    scrollTargets.forEach((el, index) => {
      el.dataset.index = index;
      el.style.setProperty("--index", index);

      const sliceStart = index / totalTargets;
      const sliceEnd = (index + 1) / totalTargets;

      if (
        distanceToBottom >= sliceStart &&
        (distanceToBottom < sliceEnd ||
          (distanceToBottom === 1 && index === totalTargets - 1))
      ) {
        el.classList.add("active");
        activeIndex = index;
      } else {
        el.classList.remove("active");
      }
    });

    if (activeIndex !== -1) {
      scrollTargets.forEach((el, index) => {
        const distanceFromActive = index - activeIndex;
        el.dataset.distanceFromActive = distanceFromActive;
        el.style.setProperty("--distance-from-active", distanceFromActive);
      });
    }
  };

  window.addEventListener("scroll", logPercentageDistance);
  logPercentageDistance();
});

const BREAKPOINTS = {
  XS: 0,
  SM: 478,
  MD: 767,
  LG: 991,
  XL: 1328,
};

function isBelowBreakpoint(currentBp, targetBp) {
  return Object.keys(BREAKPOINTS).indexOf(currentBp) <= Object.keys(BREAKPOINTS).indexOf(targetBp);
}

// const MARKER_ICONS = {
//   primary: {
//     default: "https://uploads-ssl.webflow.com/6673386a4f6b7ddc70a5931f/66844fdb5d94f2dfa69b22c4_drop.svg",
//     hovered: "https://uploads-ssl.webflow.com/6673386a4f6b7ddc70a5931f/66845298a4a75c8fa2ec692b_drop__hovered.svg",
//   },

//   turf: {
//     default: "https://uploads-ssl.webflow.com/6673386a4f6b7ddc70a5931f/6686b454d3eab564fecdbfd2_drop__turf.svg",
//     hovered: "https://uploads-ssl.webflow.com/6673386a4f6b7ddc70a5931f/6686b4541f8e697bf7a571ab_drop__turf__hovered.svg",
//   },
// };

const MARKER_ICONS = {
  primary: {
    default: "https://cdn.prod.website-files.com/6673386a4f6b7ddc70a5931f/66cf9400ddd1e5db619f8cba_flag-drop_accent_non-hovered.svg",
    hovered: "https://cdn.prod.website-files.com/6673386a4f6b7ddc70a5931f/66cf9400c723430ff0769e72_flag-drop_accent_hovered.svg",
  },

  turf: {
    default: "https://cdn.prod.website-files.com/6673386a4f6b7ddc70a5931f/66cf9400bfd20cd313aad703_flag-drop_turf_hovered.svg",
    hovered: "https://cdn.prod.website-files.com/6673386a4f6b7ddc70a5931f/66cf94000391c256cbe6ec32_flag-drop_turf_non-hovered.svg",
  },
};


class MyMap {
  constructor(elem) {
    this.elem = elem;
    this.section = elem.closest(".map-section");
    this.close = Array.from(this.section.querySelectorAll(".map--close"));
    this.left = Array.from(this.section.querySelectorAll(".map--seek-button.left"));
    this.right = Array.from(this.section.querySelectorAll(".map--seek-button.right"));
    this.embed = L.map(elem).setView([20, 0], 2);
    this.theme = elem.getAttribute("data-theme") || "primary";
    this.type = elem.getAttribute("data-map") || "";
    this.link = {};
  }

  async getLink() {
    const linkElem = this.section.querySelector(".map--link");
    const linkHref = linkElem.getAttribute("href");
    const linkData = await fetch(linkHref).then((response) => response.text());

    this.link = {
      elem: linkElem,
      href: linkHref,
      data: linkData,
    };
  }

  loaded() {
    this.elem.setAttribute("data-loaded", "true");
  }

  draw() {
    // if (this.theme === "primary") {
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}" + (L.Browser.retina ? "@2x.png" : ".png"), {
        maxZoom: 20,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
      }).addTo(this.embed);
    // } else {
    //   L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}" + (L.Browser.retina ? "@2x.png" : ".png"), {
    //     maxZoom: 20,
    //     attribution:
    //       '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    //     subdomains: "abcd",
    //   }).addTo(this.embed);
    // }

    // else {
    //   L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    //     maxZoom: 19,
    //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    //   }).addTo(this.embed);
    // }
  }
}

function getExpeditions(map) {
  const mapSection = map.elem.closest(".map-section");
  const dynItems = mapSection.querySelectorAll(".w-dyn-item:not(.w-dyn-item .w-dyn-item)");

  const arr = Array.from(dynItems).map((item) => {
    const obj = { elem: item };
    const attrs = Array.from(item.attributes);
    attrs.forEach((attr) => {
      if (!attr.name.startsWith("data-")) return;
      const propName = attr.name.slice(5).replace(/-./g, (x) => x[1].toUpperCase());
      obj[propName] = attr.value;
    });
    return obj;
  });

  return arr;
}

class Marker {
  constructor(map) {
    this.map = map;

    const size = [32.3, 42.5];
    const iconAnchor = [16.15, 42.5];
    const popupAnchor = [0, -42.5];

    this.icon = {
      default: L.icon({
        iconUrl: MARKER_ICONS[map.theme].default,
        iconSize: size,
        iconAnchor: iconAnchor,
        popupAnchor: popupAnchor,
      }),
      hovered: L.icon({
        iconUrl: MARKER_ICONS[map.theme].hovered,
        iconSize: size,
        iconAnchor: iconAnchor,
        popupAnchor: popupAnchor,
      }),
    };
  }
}

async function initExpeditionMap(map) {
  await map.getLink();

  if (!map.link.data) {
    return;
  }

  const marker_options = {
    startIconUrl: null,
    endIconUrl: null,
    shadowUrl: null,
    wptIconUrls: {
      "": null,
    },
  };
  const polyline_options = {
    color: "var(--color--accent)",
    opacity: 1,
    weight: 5,
  };

  function handleExpeditionMapLoad(e) {
    const bounds = e.target.getBounds();
    const zoomOutFactor = 0.5;
    const zoomLevel = map.embed.getBoundsZoom(bounds) - zoomOutFactor;

    const bufferFactor = 0.2; // Adjust this factor as needed for more buffer
    const paddedBounds = bounds.pad(bufferFactor);

    map.embed.fitBounds(paddedBounds); // Fit map to padded GPX bounds
    map.embed.setZoom(zoomLevel); // Set initial zoom level
    map.embed.setMinZoom(map.embed.getBoundsZoom(bounds) - 2); // Set minimum zoom level
    map.embed.setMaxBounds(paddedBounds); // Restrict panning to padded GPX bounds
    map.loaded();
  }

  const gpxLayer = new L.GPX(map.link.href, {
    async: true,
    marker_options,
    polyline_options,
  });

  gpxLayer.on("loaded", handleExpeditionMapLoad);
  gpxLayer.addTo(map.embed);
}

document.addEventListener("DOMContentLoaded", async (event) => {
  document.querySelectorAll("[data-map]").forEach((mapElement) => {
    const map = new MyMap(mapElement);
    const customMarker = new Marker(map);

    const allMarkers = [];
    let selectedMarker = null;

    map.draw();

    if (map.type === "expedition") {
      initExpeditionMap(map);
      // that link will be to a text file, grab it and log its contents
    } else {
      map.close.forEach((btn) => {
        btn.addEventListener("click", handleCloseButtonClick);
      });

      map.elem.addEventListener("click", handlePopupClose);

      map.left.forEach((button) => {
        button.addEventListener("click", () => seek("left"));
      });

      map.right.forEach((button) => {
        button.addEventListener("click", () => seek("right"));
      });

      addAllMarkers();

      map.loaded();
    }

    function handleSwipe(direction) {
      seek(direction);
    }

    function handleResize() {
      const windowWidth = window.innerWidth;
      const breakpoint =
        Object.keys(BREAKPOINTS).find((key) => {
          const breakpointValue = BREAKPOINTS[key];
          return windowWidth <= breakpointValue;
        }) || "XL";

      if (!isBelowBreakpoint(breakpoint, "LG")) return;

      const expeditionsArray = getExpeditions(map);
      const firstExpedition = expeditionsArray[0];
      processItemClick(firstExpedition, firstExpedition.elem, expeditionsArray);

      const container = map.section.querySelectorAll(".map--selection-wrapper");
      container.forEach((c) => {
        c.addEventListener("swiped-left", () => handleSwipe("right"));
        c.addEventListener("swiped-right", () => handleSwipe("left"));
      });
    }

    function handlePopupClose(event) {
      const isPopupClose = event.target.classList.contains("leaflet-popup-close-button");
      const isPopupCloseChild = event.target.parentElement.classList.contains("leaflet-popup-close-button");

      if (isPopupClose || isPopupCloseChild) {
        const expeditionsArray = getExpeditions(map);
        removeSelection(expeditionsArray);
        resetMapView();
      }
    }

    function handleCloseButtonClick() {
      map.embed.closePopup();
      const expeditionsArray = getExpeditions(map);

      removeSelection(expeditionsArray);
      resetMapView();
    }

    function zoomToLocation(lat, long, marker) {
      map.embed.flyTo([lat, long], 6, {
        duration: 1.75,
      });
      marker.openPopup();
    }

    function applySelection(item, expeditionsArray) {
      map.elem.closest(".map--container").classList.add("selected");

      const selectionWrapper = map.elem.closest(".map-section").querySelector(".map--selection-wrapper");
      expeditionsArray.forEach((i) => {
        if (i.elem !== item) {
          i.elem.classList.add("d-none");
        } else {
          i.elem.classList.remove("d-none");
          i.elem.classList.add("selected");
          i.elem.removeEventListener("click", handleItemClick);
        }
      });
      // selectionWrapper.classList.add("no-scroll");
      // selectionWrapper.style.setProperty("overflow", "unset!important");
      selectionWrapper.style.setProperty("overflow", "auto!important");
    }

    function removeSelection(expeditionsArray) {
      map.elem.closest(".map--container").classList.remove("selected");

      const selectionWrapper = map.elem.closest(".map-section").querySelector(".map--selection-wrapper");
      expeditionsArray.forEach((i) => {
        i.elem.classList.remove("selected");
        i.elem.classList.remove("d-none");
        setTimeout(() => {
          i.elem.addEventListener("click", handleItemClick);
        }, 0);
      });
      selectionWrapper.classList.remove("no-scroll");
    }

    function handleItemClick(event) {
      const itemElem = event.currentTarget;
      itemElem.closest(".map--container").classList.add("selected");
      if (itemElem.classList.contains("selected")) {
        return;
      }
      const expeditionsArray = getExpeditions(map);
      const item = expeditionsArray.find((i) => i.elem === itemElem);

      if (item) {
        processItemClick(item, itemElem, expeditionsArray);
      }
    }

    function processItemClick(item, itemElem, expeditionsArray) {
      const lat = parseFloat(item.lat);
      const long = parseFloat(item.long);
      const marker = allMarkers.find((m) => m.itemElem === itemElem);
      if (marker) {
        applySelection(itemElem, expeditionsArray);
        zoomToLocation(lat, long, marker.leafletMarker);
        setSelectedMarker(marker.leafletMarker);
      }
    }

    function setSelectedMarker(marker) {
      if (selectedMarker) {
        selectedMarker.setIcon(customMarker.icon.default);
        selectedMarker.closePopup();
      }
      selectedMarker = marker;
      selectedMarker.setIcon(customMarker.icon.hovered);
      selectedMarker.openPopup();
    }

    function addAllMarkers() {
      const expeditionsArray = getExpeditions(map);

      expeditionsArray.forEach((item) => {
        const lat = parseFloat(item.lat);
        const long = parseFloat(item.long);
        const country = item.country;

        if (!isNaN(lat) && !isNaN(long)) {
          const marker = L.marker([lat, long], {
            icon: customMarker.icon.default,
          })
            .addTo(map.embed)
            .bindPopup(`<b>${country}</b>`);

          allMarkers.push({ itemElem: item.elem, leafletMarker: marker });

          item.elem.addEventListener("click", handleItemClick);

          item.elem.addEventListener("mouseover", () => {
            marker.setIcon(customMarker.icon.hovered);
            marker.openPopup();
          });

          item.elem.addEventListener("mouseout", () => {
            if (selectedMarker !== marker) {
              marker.setIcon(customMarker.icon.default);
              marker.closePopup();
            }
          });

          marker.on("mouseover", () => {
            marker.setIcon(customMarker.icon.hovered);
            marker.openPopup();
          });

          marker.on("mouseout", () => {
            if (selectedMarker !== marker) {
              marker.setIcon(customMarker.icon.default);
              marker.closePopup();
            }
          });

          marker.on("click", () => {
            applySelection(item.elem, expeditionsArray);
            zoomToLocation(lat, long, marker);
            setSelectedMarker(marker);
          });
        } else {
          console.error(`Invalid coordinates for ${country}`);
        }
      });
    }

    function resetMapView() {
      map.embed.flyTo([20, 0], 2, {
        duration: 1.75,
      });
      if (selectedMarker) {
        selectedMarker.setIcon(customMarker.icon.default);
        selectedMarker.closePopup();
        selectedMarker = null;
      }
    }

    function seek(direction) {
      const expeditionsArray = getExpeditions(map);
      const selectedElem = map.elem.closest(".map-section").querySelector(".w-dyn-item.selected");
      let selectedIndex = expeditionsArray.findIndex((item) => item.elem === selectedElem);

      if (direction === "left") {
        selectedIndex = (selectedIndex - 1 + expeditionsArray.length) % expeditionsArray.length;
      } else if (direction === "right") {
        selectedIndex = (selectedIndex + 1) % expeditionsArray.length;
      }

      const target = expeditionsArray[selectedIndex];

      if (target.elem) {
        removeSelection(expeditionsArray);
        setTimeout(() => {
          processItemClick(target, target.elem, expeditionsArray);
        }, 0);
      }
    }

    window.addEventListener("resize", handleResize);
    setTimeout(handleResize, 0);
  });
});

function replaceTag(element, newTagName) {
  // Check if the element is valid
  if (!element || !(element instanceof Element)) {
    console.error("Invalid element provided");
    return;
  }

  // Create a new element with the specified tag name
  const newElement = document.createElement(newTagName);

  // Copy attributes from the original element to the new element
  for (let attr of element.attributes) {
    newElement.setAttribute(attr.name, attr.value);
  }

  // Copy the inner HTML from the original element to the new element
  newElement.innerHTML = element.innerHTML;

  // Replace the original element with the new element in the DOM
  element.parentNode.replaceChild(newElement, element);

  return newElement;
}

document.addEventListener("DOMContentLoaded", function () {
  function updateHeights() {
    const masonrySections = Array.from(document.querySelectorAll(".masonry-section"));
    masonrySections.forEach((section) => {
      const collectionList = section.querySelector(".masonry-section--collection-list");
      const height = collectionList.offsetHeight;
      section.style.setProperty("--masonry-list-height", `${height}px`);

      const list = section.querySelector(".masonry-section--collection-list");
      list.style.setProperty("--masonry-list-height", `${height}px`);

      // Add event listeners to images within the collection list
      const images = collectionList.querySelectorAll("img");
      images.forEach((img) => {
        img.addEventListener("load", updateHeights);
      });
    });
  }

  let width = window.innerWidth;
  function handleResize() {
    if (window.innerWidth == width) return;
    width = window.innerWidth;
    updateHeights();
  }

  window.addEventListener("resize", handleResize);

  setTimeout(updateHeights, 0);
  setInterval(updateHeights, 200 * 1000);

  class Masonry {
    constructor(primary, secondary) {
      this.primary = {
        elems: {
          primary: primary,
          list: primary.querySelector(".masonry-section--collection-list"),
        },
        hide: this.primaryHide.bind(this),
      };

      this.secondary = {
        elems: {
          secondary: secondary,
          container: secondary.querySelector(".masonry-secondary-section--container"),
          listWrapper: secondary.querySelector(".masonry-secondary-section--collection-list-wrapper"),
          list: secondary.querySelector(".masonry-secondary-section--collection-list"),
          items: Array.from(secondary.querySelectorAll(".masonry-secondary-section--item")),
          controls: secondary.querySelector(".masonry-secondary-section--controls"),
          seek: {
            left: secondary.querySelector(".masonry-secondary-section--seek.left"),
            right: secondary.querySelector(".masonry-secondary-section--seek.right"),
          },
        },
        hide: this.secondaryHide.bind(this),
      };
      this.typeLimit = 12;
      this.length = this.getLength();
      this.type = this.length < this.typeLimit ? "secondary" : "primary";
      this.is = {
        primary: this.type === "primary",
        secondary: this.type === "secondary",
        empty: this.length === 0,
      };
    }

    primaryHide() {
      this.primary.elems.primary.classList.add("hide");
      this.secondary.elems.secondary.classList.remove("hide");
    }

    secondaryHide() {
      this.secondary.elems.secondary.classList.add("hide");
      this.primary.elems.primary.classList.remove("hide");
    }

    getLength() {
      const secondary = this.secondary.elems.secondary;
      const list = secondary.querySelectorAll(".masonry-secondary-section--item");
      return list.length;
    }

    init() {
      masonryHide(this);
      masonryStyle(this);
    }
  }

  function masonryHide(masonry) {
    if (masonry.is.primary) masonry.secondary.hide();
    if (masonry.is.secondary) masonry.primary.hide();
    if (masonry.is.empty) {
      masonry.primary.hide();
      masonry.secondary.hide();
    }
  }

  function masonryStyle(masonry) {
    if (masonry.is.primary) masonryPrimaryStyle(masonry);
    if (masonry.is.secondary) masonrySecondaryStyle(masonry);
  }

  function masonryPrimaryStyle(masonry) {
    const primary = masonry.primary.elems.primary;
    const list = masonry.primary.elems.list;

    if (masonry.length < 16) {
      list.classList.add(`col-3`);
    } else {
      list.classList.add(`col-4`);
    }
  }

  function masonrySecondaryStyle(masonry) {
    const secondary = masonry.secondary.elems.secondary;
    const list = masonry.secondary.elems.list;

    if (masonry.length <= 2) {
      list.classList.add(`col-3`);
      list.style.setProperty("--masonry-col", "3");
    }

    if (masonry.length > 2 && masonry.length < 5) {
      list.classList.add(`col-${masonry.length}`);
      list.style.setProperty("--masonry-col", `${masonry.length}`);
    }

    if (masonry.length >= 5) {
      list.classList.add(`col-4`);
      list.style.setProperty("--masonry-col", "4");
      masonrySplide(masonry);
    }
  }

  function masonrySplide(masonry) {
    // const container = masonry.secondary.elems.container;
    // const listWrapper = masonry.secondary.elems.listWrapper;
    // const list = masonry.secondary.elems.list;
    // const items = masonry.secondary.elems.items;

    const { container, listWrapper, list, items, controls, seek } = masonry.secondary.elems;
    let { left, right } = seek;

    container.classList.add("splide");
    listWrapper.classList.add("splide__track");
    list.classList.add("splide__list");
    list.classList.remove("gap");
    items.forEach((item) => item.classList.add("splide__slide"));
    controls.classList.add("splide__arrows");
    controls.classList.remove("d-none");

    replaceTag(left, "button");
    replaceTag(right, "button");

    left = document.querySelector(".masonry-secondary-section--seek.left");
    right = document.querySelector(".masonry-secondary-section--seek.right");

    left.classList.add("splide__arrow", "splide__arrow--prev");
    right.classList.add("splide__arrow", "splide__arrow--next");

    const gap = window.getComputedStyle(list).getPropertyValue("--gap");

    new Splide(container, {
      // Desktop on down
      perPage: 4,
      perMove: 1,
      focus: "center",
      // 0 = left and 'center' = center
      type: "slide",
      // 'loop' or 'slide'
      gap: gap,
      // space between slides
      arrows: "slider",
      // 'slider' or false
      pagination: false,
      // 'slider' or false
      speed: 550,
      // transition speed in miliseconds
      dragAngleThreshold: 80,
      // default is 30
      autoWidth: false,
      // for cards with differing widths
      rewind: false,
      // go back to beginning when reach end
      rewindSpeed: 800,
      waitForTransition: false,
      updateOnMove: true,
      trimSpace: true,
      padding: "0rem",

      breakpoints: {
        1328: {
          // Extra large devices (large desktops, 1328px and up)
          perPage: 3.05,
          // gap: "4vw",
        },
        991: {
          // Large devices (desktops, 991px and up)
          perPage: 2.05,
          // gap: "4vw",
        },
        767: {
          // Medium devices (tablets, 767px and up)
          perPage: 2.05,
          focus: "center",

          // gap: "4vw",
        },

        478: {
          // Small devices (landscape phones, 478px and up)
          perPage: 1.05,
          focus: "center",
          // gap: "4vw",
        },
      },
    }).mount();
  }

  function secondaryInit() {
    const masonryElems = Array.from(document.querySelectorAll(".masonry-section"));
    const secondaryElems = Array.from(document.querySelectorAll(".masonry-secondary-section"));

    const sections = (() => {
      let sections = [];
      for (let i = 0; i < masonryElems.length; i++) {
        sections.push(new Masonry(masonryElems[i], secondaryElems[i]));
      }
      return sections;
    })();

    sections.forEach((section) => section.init());
  }

  secondaryInit();
});

document.addEventListener("DOMContentLoaded", () => {
  createObserver({
    watch: ".testimonial--user-wrapper",
    target: ".testimonial",
    property: "height",
    name: "--testimonial-user-wrapper-height",
    all:true,
  });
});

function homeHeroSection() {
  const heroSection = document.querySelector("#home--hero");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: heroSection,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });

  // tl.fromTo(
  //   heroSection,
  //   {
  //     "--background-image-top-multiplier": -0.65,
  //     "--foreground-image-top-multiplier": 0.85,
  //   },
  //   {
  //     "--background-image-top-multiplier": 0.65,
  //     "--foreground-image-top-multiplier": 0.25,
  //     ease: Linear.easeNone,
  //   },
  // );


  tl.fromTo(
    heroSection,
    {
      "--background-image-top-multiplier": -1,
    },
    {
      "--background-image-top-multiplier": 1,
      ease: Linear.easeNone,
    },
  );





  // tl.fromTo(
  //   heroSection,
  //   {
  //     "--background-image-top-multiplier": -0.6,
  //     "--foreground-image-top-multiplier": 1.25,
  //   },
  //   {
  //     "--background-image-top-multiplier": 0.65,
  //     "--foreground-image-top-multiplier": 0.35,
  //     ease: Linear.easeNone,
  //   },
  // );
}

document.addEventListener("DOMContentLoaded", function () {
  homeHeroSection();

  // let count = 0;
  // const interval = setInterval(() => {
  // if (document.documentElement.classList.contains("safari")) {
  gsap.utils.toArray(".masonry-section--collection-list").forEach((elem) => {
    const parent = elem.closest(".masonry-section");
    const height = window.getComputedStyle(parent);

    gsap.fromTo(
      elem,
      {
        "--transform": -0.45,
        willChange: "transform",
      },
      {
        "--transform": 0,
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

  // clearInterval(interval);
  // }

  //   count += 2;
  //   if (count >= 30) {
  //     clearInterval(interval);
  //   }
  // }, 2000);
});

document.addEventListener("DOMContentLoaded", function () {
  // Find all elements with the class .section-groups
  const sectionGroups = document.querySelectorAll(".section-group");
  const sections = document.querySelectorAll(".section");

  sectionGroups.forEach((group) => {
    // Check the previous sibling element of each .section-groups
    const previousElement = group.previousElementSibling;
    const nextElement = group.nextElementSibling;

    // If the previous element has the class .section, add the class .section__before-group
    if (previousElement && previousElement.classList.contains("section")) {
      previousElement.classList.add("section-group__before-group");
    }

    if (nextElement && nextElement.classList.contains("footer")) {
      group.classList.add("section-group__before-footer");
    }
  });

  sections.forEach((section) => {
    // Check the previous sibling element of each .section-groups
    const previousElement = section.previousElementSibling;
    const nextElement = section.nextElementSibling;

    if (nextElement && nextElement.classList.contains("footer")) {
      section.classList.add("section__before-footer");
    }
  });

  // Additional functionality for the Expeditions subpage
  if (window.location.pathname.includes("/expeditions/")) {
    const expeditionElement = document.getElementById(
      "expeditions-subpage--seek",
    );
    if (expeditionElement) {
      let previousElement = expeditionElement.previousElementSibling;
      while (previousElement) {
        const className = previousElement.className;
        if (
          !className.includes("masonry") &&
          !previousElement.classList.contains("hide") &&
          !previousElement.classList.contains("w-condition-invisible")
        ) {
          previousElement.classList.add("expeditions-subpage__before-seek");
          previousElement.classList.add("section-group__bottom-transition");

          // Get the background color and traverse up if it doesn't have one
          let backgroundColor =
            window.getComputedStyle(previousElement).backgroundColor;
          let parentElement = previousElement.parentElement;

          while (backgroundColor === "rgba(0, 0, 0, 0)" && parentElement) {
            // Transparent color in RGBA
            backgroundColor =
              window.getComputedStyle(parentElement).backgroundColor;
            parentElement = parentElement.parentElement;
          }

          previousElement.style.backgroundColor = backgroundColor;


          break;
        }
        previousElement = previousElement.previousElementSibling;
      }
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Grab all .social-button elements
  const socialButtons = document.querySelectorAll(".social-button");

  // Grab all .social-icon--wrapper elements that are not inside a .social-button element
  const socialIconWrappers = document.querySelectorAll(
    ".social-icon--wrapper:not(.social-button .social-icon--wrapper)",
  );

  // Function to process elements
  function processElements(elements) {
    elements.forEach((element) => {
      const img = element.querySelector("img");
      if (img) {
        const src = img.getAttribute("src");
        element.style.setProperty("--mask-url", `url('${src}')`);
        img.remove();
      }
    });
  }

  // Process .social-button elements
  processElements(socialButtons);

  // Process .social-icon--wrapper elements
  processElements(socialIconWrappers);
});

// TODO: Give this its own file
// TODO: Add support for custom animations outside of just 'fade'
// TODO: custom durations, delays, etc.
// TODO: responsivity support where it replaces the element with the original unsplit element while resizing and then starts up again
// TODO: Make overlap optionally a float so you can set a threshhold of how complete the animation has to be before overlapping is allowed.
// TODO: Better handling for when you load the page with the element already in view
// TODO: Ability to change scroll trigger to affect your type and below, so if you choose line as the scroll trigger you can still use word and char but the lines will be the triggers for the elements they contain.
// TODO: overlap is mostly working but i think we'd need some kind of animation queue to be able to refine it further because right now theres a bug where quick movements are able to stop and start animations before they're supposed to be done and its either a timing issue or i think it could be an issue of running vs not running being one value for every animation.  so if something is running and its early in its cycle it can still start and stop again ?? idk maybe this doesn't make sense

class SplitTextTarget {
  constructor(elem, parent, index) {
    this.elem = elem;
    this.parent = parent;
    this.index = index;
    this.running = false;
    this.animation = this.getAnimation();
  }

  init() {
    requestAnimationFrame(() => {
      gsap.set(this.elem, this.animation.enter.from);
    });
  }

  getDelay(index) {
    return this.parent.delay * index;
  }

  // TODO: If you prefer the idea of the animation being managed in the parent you could always move it back and do parent.getAnimation, i guess just because thats where delay and duration and such are set.
  getAnimation() {
    const self = this;

    const listeners = (state) => {
      return {
        onStart: () => {
          this.running = true;
          this.parent.handleAnimationStart(this.index, state);
        },
        onComplete: () => {
          this.running = false;
          this.parent.handleAnimationComplete(this.index, state);
        },
        onUpdate: function () {
          const progress = this.progress();
          self.progress = progress;
        },
      };
    };

    const defaults = ({ invert = false } = {}) => {
      const count = this.parent.count;
      const delay = invert ? this.getDelay([count - 1 - this.index]) : this.getDelay(this.index);
      return {
        duration: this.parent.duration,
        delay: delay,
      };
    };

    const enter = {
      from: fade.up.from,
      to: {
        ...fade.up.to,
        ...defaults({ invert: false }),
        ...listeners("enter"),
      },
    };

    const leave = {
      from: fade.up.to,
      to: {
        ...fade.up.from,
        ...defaults({ invert: true }),
        ...listeners("leave"),
      },
    };

    const enterBack = {
      from: fade.up.from,
      to: {
        ...fade.up.to,
        ...defaults({ invert: true }),
        ...listeners("enterBack"),
      },
    };

    const leaveBack = {
      from: fade.up.to,
      to: {
        ...fade.up.from,
        ...defaults({ invert: false }),
        ...listeners("leaveBack"),
      },
    };

    return {
      enter,
      leave,
      enterBack,
      leaveBack,
    };
  }
}

class SplitTextAnimator {
  constructor(elem, { type = "lines", overlap = false } = {}) {
    this.type = type;
    this.elem = elem;
    this.split = new SplitType(elem);
    this.delay = 0.05;
    this.duration = DEFAULT.DURATION;
    this.totalDuration = this.getTotalDuration();

    this.overlap = this.getOverlap(overlap);

    this.running = false; // Current state of whether an animation is running
    // this.prevRunning = false; // Previous state of running
    this.state = null; // Current state of the animation
    this.prevState = null; // State when running last became true

    this.scrollTriggerDefaults = {
      trigger: this.elem,
      ease: DEFAULT.EASE,
      //   ease: "linear",
      start: "top bottom-=10%",
      end: "bottom top+=35%",
      markers: true,
    };

    this.handleScrollChange = this.handleScrollChange.bind(this);
    this.handleAnimationStart = this.handleAnimationStart.bind(this);
    this.handleAnimationComplete = this.handleAnimationComplete.bind(this);
    this.getSplitTargetCount = this.getSplitTargetCount.bind(this);
    this.getIsInverted = this.getIsInverted.bind(this);

    this.count = this.split[type].length;
    this.splitTargets = this.split[type].map((elem, index) => new SplitTextTarget(elem, this, index));
  }

  init() {
    this.splitTargets.forEach((target) => target.init());
    this.animateSplitTargets();
  }

  getOverlap(overlap) {
    if (typeof overlap == "boolean") {
      overlap = Number(overlap);
    }
    if (typeof overlap != "number" || overlap > 1) {
      console.log("Error: Overlap type.  Overlap must be either a bool or a number between 0-1");
    }

    return overlap;
  }

  getSplitTargetCount() {
    return this.count;
  }

  getTotalDuration() {
    return this.count * this.duration + (this.count - 1) * this.delay;
  }

  updateRunning(running) {
    // console.log(running);
    if (!this.running && running) {
      this.prevState = this.state;
    }

    if (this.running && !running) {
      if (this.prevState !== this.state) {
        // if (this.overlap == 0) return;
        // Prevents a flicker
        setTimeout(() => {
          this.handleScrollChange({ state: this.state, force: true });
        }, 0);
      }
    }

    this.running = running;
  }

  animateSplitTargets() {
    this.ScrollTrigger = ScrollTrigger.create({
      ...this.scrollTriggerDefaults,
      onEnter: () => this.handleScrollChange({ state: "enter" }),
      onEnterBack: () => this.handleScrollChange({ state: "enterBack" }),
      onLeave: () => this.handleScrollChange({ state: "leave" }),
      onLeaveBack: () => this.handleScrollChange({ state: "leaveBack" }),
    });
  }

  handleScrollChange({ state, force = false } = {}) {
    this.state = state;

    const invert = state == "enterBack" || state == "leave";
    const prevStateLeaving = this.prevState == "leave" || this.prevState == "leaveBack";
    const stateLeaving = this.state == "leave" || this.state == "leaveBack";

    const targets = this.splitTargets;

    // This inversion actually isn't necessary since inverting the delays is all you actually need to do, but its kinda nice since it makes the order of operations correct in terms of the for loop.  could be useful later.
    // Although if you change it here you need to get rid of it in handleAnimationComplete as well
    const t = invert ? [...targets].reverse() : targets;

    if (this.running) return;
    // this.updateRunning(true);

    // const totalCount = this.count;
    // const completedCount = this.splitTargets.filter((target) => !target.running).length;
    // const overlapPoint = totalCount - Math.ceil(this.overlap * totalCount);
    // if(overlapPoint != completedCount) return;

    // console.log('starting at '+ completedCount);

    t.forEach((target) => {
      //   console.log("run");
      // if (!this.overlap && this.running && !force) return;
      //   if (this.running && !force) return;
      requestAnimationFrame(() => {
        run(target);
      });
    });

    const run = (target) => {
      // Initialize the props object with default properties
      const props = {
        from: {
          ...target.animation[state].from,
        },
        to: {
          ...target.animation[state].to,
        },
      };

      // Check if force is true and modify props accordingly
      if (force) {
        props.from = {
          ...target.animation[this.prevState]?.to,
        };
        props.to = {
          ...target.animation[this.state].to,
          ...(prevStateLeaving && stateLeaving ? { duration: 0, delay: 0 } : {}),
        };
      }

      // Perform the gsap animation with the calculated props
      // gsap.fromTo(target.elem, props.from, props.to);

      gsap.to(target.elem, props.to);
    };
  }

  getIsInverted(index, state) {
    const invert = state == "enterBack" || state == "leave";
    return (invert && index !== this.count - 1) || (!invert && index !== 0);
  }

  handleAnimationStart(index, state) {
    if (this.splitTargets.filter((target) => target.running).length === 1) {
      if (this.running) return;
      //   console.log("One child is running, so i started");
      this.updateRunning(true);
    }

    // const totalCount = this.count;
    // const completedCount = this.splitTargets.filter((target) => target.running).length;
    // const overlapPoint = totalCount - Math.ceil(this.overlap * totalCount);

    // if (completedCount >= overlapPoint) {
    //   if (!this.running) return;
    //   console.log('start');
    //   this.updateRunning(true);
    // }

    // if (this.splitTargets.filter((target) => target.running).length === 1) {
    //   this.updateRunning(true, index);
    // }
  }

  handleAnimationComplete(index, state) {
    // if (!this.overlap && this.splitTargets.every((target) => !target.running)) {
    //   this.updateRunning(false, index);
    // }

    // if (this.splitTargets.every((target) => !target.running)) {
    //   this.updateRunning(false, index);
    // }

    // const totalCount = this.count;
    // const completedCount = this.splitTargets.filter((target) => !target.running).length;
    // const overlapPoint = totalCount - Math.ceil(this.overlap * totalCount);

    // if (completedCount >= overlapPoint) {
    // if (!this.running) return;
    // this.updateRunning(false, index);
    // }

    const totalCount = this.splitTargets.length;
    const completedCount = this.splitTargets.filter((target) => !target.running).length;

    // Calculate the average progress across all split targets
    const totalProgress = this.splitTargets.reduce((sum, target) => sum + target.progress, 0);
    const averageProgress = totalProgress / totalCount;

    // const overlapPoint = totalCount - Math.ceil(this.overlap * totalCount);

    if (averageProgress >= 1 - this.overlap) {
      if (!this.running) return;
      //   console.log(completedCount, overlapPoint);
      this.updateRunning(false, index);
    }
  }
}

// Ensure you have GSAP and ScrollTrigger loaded before this script

// Enable setting of two anchor points to stretch the squiggle line between them
// Position them all

function screenToSVG(svg, screenX, screenY) {
  var p = svg.createSVGPoint();
  p.x = screenX;
  p.y = screenY;
  return p.matrixTransform(svg.getScreenCTM().inverse());
}

function SVGToScreen(svg, svgX, svgY) {
  var p = svg.createSVGPoint();
  p.x = svgX;
  p.y = svgY;
  return p.matrixTransform(svg.getScreenCTM());
}

function getAnchorPosition(anchor, position) {
  const rect = anchor.getBoundingClientRect();
  switch (position) {
    case "top-left":
      return { x: rect.left, y: rect.top };
    case "top-center":
      return { x: rect.left + rect.width / 2, y: rect.top };
    case "top-right":
      return { x: rect.right, y: rect.top };
    case "middle-left":
      return { x: rect.left, y: rect.top + rect.height / 2 };
    case "middle-center":
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    case "middle-right":
      return { x: rect.right, y: rect.top + rect.height / 2 };
    case "bottom-left":
      return { x: rect.left, y: rect.bottom };
    case "bottom-center":
      return { x: rect.left + rect.width / 2, y: rect.bottom };
    case "bottom-right":
      return { x: rect.right, y: rect.bottom };
    default:
      return { x: rect.left, y: rect.top };
  }
}

function getTransformDifference(svg, lineEnd, anchorPos) {
  const lineEndScreen = SVGToScreen(svg, lineEnd.x, lineEnd.y);
  return {
    x: anchorPos.x - lineEndScreen.x,
    y: anchorPos.y - lineEndScreen.y,
  };
}

function sortElementsById(elements, idIndex) {
  return elements.sort((a, b) => {
    const idA = parseInt(a.id.split("-")[idIndex]);
    const idB = parseInt(b.id.split("-")[idIndex]);
    return idA - idB;
  });
}

function updatePitchHeight() {
  const homeHero = document.querySelector("#home--hero");
  if (!homeHero) return;

  const logoSection = document.querySelector(".logo-section");
  const featuredExpedition = document.querySelector(".featured-expedition");

  if (!logoSection || !featuredExpedition) return;

  let currentElement = logoSection.nextElementSibling;
  let totalHeight = 0;

  while (currentElement && currentElement !== featuredExpedition) {
    const computedStyle = window.getComputedStyle(currentElement);
    const elementHeight = currentElement.offsetHeight + parseInt(computedStyle.marginTop) + parseInt(computedStyle.marginBottom);
    totalHeight += elementHeight;
    currentElement = currentElement.nextElementSibling;
  }

  document.body.style.setProperty("--pitch-height", `${totalHeight}px`);
}

document.addEventListener("DOMContentLoaded", function () {
  const squiggleElem = document.querySelector("#squiggle");
  const squiggleWrapper = document.querySelector(".squiggle--wrapper");

  if (!squiggleElem || !squiggleWrapper) return;

  class Path {
    constructor(path) {
      this.svg = path.parentElement;
      this.elem = path;
      this.length = path.getTotalLength();
    }
  }

  const squiggle = {
    elems: {
      origin: squiggleElem,
      wrapper: squiggleWrapper,
      lines: Array.from(squiggleElem.querySelectorAll("[id*='line-']")),
      anchors: Array.from(document.querySelectorAll("[id*='squiggle--anchor-']")),
    },
    paths: [],
  };

  const mapping = [
    {
      lineIndex: 0,
      anchorIndex: 0,
      anchorPosition: "middle-center",
      snapTo: "start",
    },
  ];

  function squiggleInit() {
    squiggle.elems.lines.forEach((line) => {
      const lineCopies = 2;

      for (let i = 0; i < lineCopies; i++) {
        const newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        const attrs = ["viewBox", "class"];
        attrs.forEach((attr) => newSvg.setAttribute(attr, squiggleElem.getAttribute(attr)));
        newSvg.classList.add("squiggle--child");
        newSvg.classList.add(`squiggle--child--${i + 1}`);

        // Clone the path and append to the new SVG
        const newPath = line.cloneNode(true);
        newSvg.appendChild(newPath);

        // Copy the defs from the original SVG to the new SVG
        const defs = squiggleElem.querySelector("defs");
        const newDefs = defs.cloneNode(true);
        newSvg.appendChild(newDefs);

        // Append the new SVG to the wrapper
        squiggleWrapper.appendChild(newSvg);
        squiggle.paths.push(new Path(newPath));
        // console.log(squiggleWrapper);
      }
    });

    // replace squiggleWrapper with its children
    squiggleWrapper.replaceWith(...squiggleWrapper.childNodes);

    squiggle.elems.origin.remove();

    // Sort paths and anchors based on their id
    squiggle.paths = sortElementsById(
      squiggle.paths.map((p) => p.elem),
      1,
    ).map((elem) => new Path(elem));
    squiggle.elems.anchors = sortElementsById(squiggle.elems.anchors, 2);

    setTimeout(updatePitchHeight, 0);

    squiggleDraw();
  }

  function squiggleDraw() {
    squiggle.paths.forEach((path) => {
      path.svg.style.transform = "";
    });

    // mapping.forEach(({ lineIndex, anchorIndex, anchorPosition, snapTo }) => {
    squiggle.paths.forEach((path, index) => {
      const { anchorIndex, anchorPosition, snapTo } = mapping[0];
      const anchor = squiggle.elems.anchors[anchorIndex];
      const line = squiggle.paths[index].elem;
      const lineLength = line.getTotalLength();
      const linePoint = snapTo === "start" ? line.getPointAtLength(0) : line.getPointAtLength(lineLength);

      const anchorPos = getAnchorPosition(anchor, anchorPosition);
      const diff = getTransformDifference(line.ownerSVGElement, linePoint, anchorPos);

      squiggle.paths[index].svg.style.transform = `translate(${diff.x}px, ${diff.y}px)`;
      // });
    });
  }

  function optimizedSquiggleDraw() {
    requestAnimationFrame(squiggleDraw);
  }

  function setupScrollAnimation() {
    gsap.registerPlugin(ScrollTrigger);

    const stroke = parseFloat(window.getComputedStyle(squiggle.paths[0].svg).getPropertyValue("--squiggle-stroke-width"));

    // console.log(squiggle.paths);

    squiggle.paths.forEach((path, index) => {
      if (index == 0) {
        gsap.fromTo(
          ".squiggle--dot",
          {
            scale: 0,
            opacity: 0,
            rotation: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: path.elem,
              start: "top 60%",
            },
          },
        );
      }

      // Animate the path, not the duplicate
      if (index == 1) {
        gsap.set(path.elem, {
          strokeDashoffset: "30px 30px"
        });
      }
      if (index == 1) {
        gsap.set(path.elem, {
          strokeDasharray: path.length,
          strokeDashoffset: path.length,
          strokeWidth: stroke,
        });

        // console.log(path.elem);

        // const pathStart = "top 45%";
        // const pathEnd = "bottom -40%";
        const pathStart = "top 35%";
        const pathEnd = "bottom -80%";
        gsap.to(path.elem, {
          strokeDashoffset: 0,
          scrollTrigger: {
            trigger: path.elem,
            start: pathStart,
            end: pathEnd,
            scrub: true,
          },
        });

        gsap.fromTo(
          path.elem,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: path.elem,
              start: pathStart,
            },
          },
        );
      }
    });
  }

  window.addEventListener("resize", optimizedSquiggleDraw);
  window.addEventListener("scroll", optimizedSquiggleDraw);
  window.addEventListener("resize", updatePitchHeight);

  squiggleInit();
  updatePitchHeight();
  setupScrollAnimation();
});

function swipeEventsInit() {
  /*!
   * swiped-events.js - v@version@
   * Pure JavaScript swipe events
   * https://github.com/john-doherty/swiped-events
   * @inspiration https://stackoverflow.com/questions/16348031/disable-scrolling-when-touch-moving-certain-element
   * @author John Doherty <www.johndoherty.info>
   * @license MIT
   */

  (function (window, document) {
    "use strict";

    // patch CustomEvent to allow constructor creation (IE/Chrome)
    if (typeof window.CustomEvent !== "function") {
      window.CustomEvent = function (event, params) {
        params = params || {
          bubbles: false,
          cancelable: false,
          detail: undefined,
        };

        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(
          event,
          params.bubbles,
          params.cancelable,
          params.detail,
        );
        return evt;
      };

      window.CustomEvent.prototype = window.Event.prototype;
    }

    document.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchmove", handleTouchMove, false);
    document.addEventListener("touchend", handleTouchEnd, false);

    var xDown = null;
    var yDown = null;
    var xDiff = null;
    var yDiff = null;
    var timeDown = null;
    var startEl = null;

    /**
     * Fires swiped event if swipe detected on touchend
     * @param {object} e - browser event object
     * @returns {void}
     */
    function handleTouchEnd(e) {
      // if the user released on a different target, cancel!
      if (startEl !== e.target) return;

      var swipeThreshold = parseInt(
        getNearestAttribute(startEl, "data-swipe-threshold", "20"),
        10,
      ); // default 20px
      var swipeTimeout = parseInt(
        getNearestAttribute(startEl, "data-swipe-timeout", "500"),
        10,
      ); // default 500ms
      var timeDiff = Date.now() - timeDown;
      var eventType = "";
      var changedTouches = e.changedTouches || e.touches || [];

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        // most significant
        if (Math.abs(xDiff) > swipeThreshold && timeDiff < swipeTimeout) {
          if (xDiff > 0) {
            eventType = "swiped-left";
          } else {
            eventType = "swiped-right";
          }
        }
      } else if (Math.abs(yDiff) > swipeThreshold && timeDiff < swipeTimeout) {
        if (yDiff > 0) {
          eventType = "swiped-up";
        } else {
          eventType = "swiped-down";
        }
      }

      if (eventType !== "") {
        var eventData = {
          dir: eventType.replace(/swiped-/, ""),
          touchType: (changedTouches[0] || {}).touchType || "direct",
          xStart: parseInt(xDown, 10),
          xEnd: parseInt((changedTouches[0] || {}).clientX || -1, 10),
          yStart: parseInt(yDown, 10),
          yEnd: parseInt((changedTouches[0] || {}).clientY || -1, 10),
        };

        // fire `swiped` event event on the element that started the swipe
        startEl.dispatchEvent(
          new CustomEvent("swiped", {
            bubbles: true,
            cancelable: true,
            detail: eventData,
          }),
        );

        // fire `swiped-dir` event on the element that started the swipe
        startEl.dispatchEvent(
          new CustomEvent(eventType, {
            bubbles: true,
            cancelable: true,
            detail: eventData,
          }),
        );
      }

      // reset values
      xDown = null;
      yDown = null;
      timeDown = null;
    }

    /**
     * Records current location on touchstart event
     * @param {object} e - browser event object
     * @returns {void}
     */
    function handleTouchStart(e) {
      // if the element has data-swipe-ignore="true" we stop listening for swipe events
      if (e.target.getAttribute("data-swipe-ignore") === "true") return;

      startEl = e.target;

      timeDown = Date.now();
      xDown = e.touches[0].clientX;
      yDown = e.touches[0].clientY;
      xDiff = 0;
      yDiff = 0;
    }

    /**
     * Records location diff in px on touchmove event
     * @param {object} e - browser event object
     * @returns {void}
     */
    function handleTouchMove(e) {
      if (!xDown || !yDown) return;

      var xUp = e.touches[0].clientX;
      var yUp = e.touches[0].clientY;

      xDiff = xDown - xUp;
      yDiff = yDown - yUp;
    }

    /**
     * Gets attribute off HTML element or nearest parent
     * @param {object} el - HTML element to retrieve attribute from
     * @param {string} attributeName - name of the attribute
     * @param {any} defaultValue - default value to return if no match found
     * @returns {any} attribute value or defaultValue
     */
    function getNearestAttribute(el, attributeName, defaultValue) {
      // walk up the dom tree looking for attributeName
      while (el && el !== document.documentElement) {
        var attributeValue = el.getAttribute(attributeName);

        if (attributeValue) {
          return attributeValue;
        }

        el = el.parentNode;
      }

      return defaultValue;
    }
  })(window, document);
}

swipeEventsInit();
class Fill {
  constructor(elem) {
    this.elem = elem;
    this.state = "loading";
    this.prevState = "none";
    this.parent = elem.parentElement;
    this.observer = null;
    this.resize = null;
    this.timeout = null;
    this.prevWidth = window.innerWidth;
    this.prevFontSize = 0;
    this.fontSizeAdjusted = false; // Moved to class level
  }

  init() {
    this.observer = new MutationObserver(this.handleMutation.bind(this));
    this.observer.observe(this.elem, {
      attributes: true,
    });
    window.addEventListener("resize", this.handleResize.bind(this));

    setTimeout(() => {
      this.handleResize();
    }, 500);
  }

  setState(str) {
    setTimeout(() => {
      this.prevState = this.state;
      this.state = str;
      this.elem.setAttribute("data-countdown-state", str);
    }, 200);
  }
  
  getState() {
    return this.elem.getAttribute("data-countdown-state");
  }

  handleMutation(records) {
    records.forEach((mutation) => {
      if (mutation.attributeName != "data-countdown-state") return;
      const state = this.elem.getAttribute("data-countdown-state");
      if (state == this.prevState) return;
      this.prevState = this.state;
      this.state = state;
      if (state == "ready") this.handleTransition();
      if (state == "transition-done") this.handleUpdate();
      // if (state == "display") this.handleDisplay();
    });
  }

  handleTransition() {
    this.setState("transition");
    setTimeout(() => {
      this.transitionDuring();
      this.setState("transition-done");
    }, 200);
  }

  transitionDuring() {
    setTimeout(() => {
      if (!this.characters) this.characters = this.elem.textContent;
      if (!this.length) this.length = Math.ceil(this.characters.length * 0.6);
      this.elem.textContent = `${"0".repeat(this.length)}`;
    }, 0);
  }

  handleUpdate() {
    this.setState("update");

    const parent = this.parent;
    const style = window.getComputedStyle(parent);
    const containerWidth = parent.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const containerHeight = parent.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);

    let fontSize = 10;
    this.fontSizeAdjusted = false; // Reset flag
    this.elem.style.fontSize = `${fontSize}px`;

    const adjustFontSize = () => {
      while (this.elem.scrollWidth <= containerWidth && this.elem.scrollHeight <= containerHeight && fontSize < 300) {
        fontSize++;
        this.elem.style.fontSize = `${fontSize}px`;
      }

      fontSize--; // Step back to the last valid size
      this.elem.style.fontSize = `${fontSize}px`;
      this.fontSizeAdjusted = true;

      // Ensure a reflow has happened before continuing
      requestAnimationFrame(() => {
        this.finalizeUpdate();
      });
    };

    adjustFontSize();
  }

  finalizeUpdate() {
    if (this.state !== "update") return;

    // Ensure the font size has been adjusted before proceeding
    if (this.fontSizeAdjusted) {
      // Revert to the original text content after the font size is finalized
      setTimeout(() => {
        this.elem.textContent = this.characters;
        this.setState("display");
      }, 100);
    }
  }

  handleResize() {
    const currentWidth = window.innerWidth;
    if (currentWidth === this.prevWidth) return;
    if (this.timeout) clearTimeout(this.timeout);

    // this.elem.classList.add("hidden");
    this.prevWidth = currentWidth;

    this.setState("transition");
    this.timeout = setTimeout(() => {
      this.transitionDuring();
      this.setState("transition-done");
    }, 500);
  }

  // handleDisplay() {
  //   this.elem.classList.remove("hidden");
  // }
}

document.addEventListener("DOMContentLoaded", function () {
  if (document.fonts) {
    document.fonts.ready.then(() => {
      initializeFill();
    });
  } else {
    initializeFill();
  }
});

function initializeFill() {
  const elements = Array.from(document.querySelectorAll("[data-text-fill-container]"));
  const fills = elements.map((elem) => new Fill(elem));
  fills.forEach((fill) => fill.init());
}

document.addEventListener("DOMContentLoaded", function () {
  const durationElements = document.querySelectorAll("[data-duration]");

  const duration = {
    start: {},
    end: {},
    target: {},
  };

  durationElements.forEach((elem) => {
    const durationType = elem.getAttribute("data-duration");
    if (durationType === "start" || durationType === "end") {
      const dateValue = new Date(elem.textContent.trim());
      duration[durationType] = {
        elem: elem,
        value: dateValue,
      };
    }
  });

  const startDate = duration.start.value;
  const endDate = duration.end.value;

  if (startDate && endDate) {
    const timeDiff = Math.abs(endDate - startDate);
    const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const dayText = dayDiff === 1 ? "1 Day" : `${dayDiff} Days`;

    duration.target = {
      elem: document.querySelector('[data-duration="target"]'),
      value: dayText,
    };

    if (duration.target.elem) {
      duration.target.elem.textContent = dayText;
    }
  }

});

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".toolbelt") === null) return;

  createObserver({
    watch: ".toolbelt--graphic",
    target: ".toolbelt",
    property: "width",
    name: "--toolbelt-graphic-width",
  });

  // Grab buttons dynamically and sort them alphabetically by their IDs
  const buttons = Array.from(
    document.querySelectorAll('[id*="toolbelt--button-"]'),
  ).sort((a, b) => a.id.localeCompare(b.id));

  // Function to check if children are present and have the same length
  const checkChildren = () => {
    const bodyPaginationDots = document.querySelectorAll(
      "#toolbelt--body-pagination .w-slider-dot",
    );
    const graphicPaginationDots = document.querySelectorAll(
      "#toolbelt--graphic-pagination .w-slider-dot",
    );

    if (
      bodyPaginationDots.length &&
      graphicPaginationDots.length &&
      bodyPaginationDots.length === graphicPaginationDots.length
    ) {
      // Default the first button to active
      buttons[0].classList.add("active");

      buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
          // Remove "active" class from all buttons
          buttons.forEach((btn) => btn.classList.remove("active"));
          // Add "active" class to the clicked button
          button.classList.add("active");

          if (bodyPaginationDots[index]) {
            bodyPaginationDots[index].click();
          }
          if (graphicPaginationDots[index]) {
            graphicPaginationDots[index].click();
          }

          // Add transition and transform styles
          button.style.transition = "0.2s";
          button.style.transform = "translateX(0%) rotate(0deg)";

          // Blur after 0.2s
          setTimeout(() => {
            button.blur();
          }, 200);
        });
      });
    } else {
      // Retry after a short delay if children are not yet available
      setTimeout(checkChildren, 100);
    }
  };

  // Initial check for children presence and length
  checkChildren();
});

// this should be updated to be a custom attribute and apply to others that have similar needs
document.addEventListener("DOMContentLoaded", () => {
  function uniqueFactorsInit() {
    const factors = Array.from(
      document.querySelectorAll(".unique-factors--item"),
    );

    factors.forEach((fac) => {
      const src = fac.querySelector("img").src;
      fac.style.setProperty("--mask-url", `url('${src}'`);
    });
  }

  uniqueFactorsInit();
});

