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
      if (!this.length) this.length = Math.ceil(this.characters.length * 0.625);
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
