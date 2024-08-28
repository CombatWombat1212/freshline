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
