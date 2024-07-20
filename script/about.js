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
