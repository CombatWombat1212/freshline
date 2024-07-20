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
