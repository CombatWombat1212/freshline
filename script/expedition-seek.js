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
