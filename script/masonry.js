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
    const masonrySections = Array.from(
      document.querySelectorAll(".masonry-section"),
    );
    masonrySections.forEach((section) => {
      const collectionList = section.querySelector(
        ".masonry-section--collection-list",
      );
      const height = collectionList.offsetHeight;
      section.style.setProperty("--masonry-list-height", `${height}px`);

      // Add event listeners to images within the collection list
      const images = collectionList.querySelectorAll("img");
      images.forEach((img) => {
        img.addEventListener("load", updateHeights);
      });
    });
  }

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
          container: secondary.querySelector(
            ".masonry-secondary-section--container",
          ),
          listWrapper: secondary.querySelector(
            ".masonry-secondary-section--collection-list-wrapper",
          ),
          list: secondary.querySelector(
            ".masonry-secondary-section--collection-list",
          ),
          items: Array.from(
            secondary.querySelectorAll(".masonry-secondary-section--item"),
          ),
          controls: secondary.querySelector(
            ".masonry-secondary-section--controls",
          ),
          seek: {
            left: secondary.querySelector(
              ".masonry-secondary-section--seek.left",
            ),
            right: secondary.querySelector(
              ".masonry-secondary-section--seek.right",
            ),
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
      const list = secondary.querySelectorAll(
        ".masonry-secondary-section--item",
      );
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

    const { container, listWrapper, list, items, controls, seek } =
      masonry.secondary.elems;
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
    const masonryElems = Array.from(
      document.querySelectorAll(".masonry-section"),
    );
    const secondaryElems = Array.from(
      document.querySelectorAll(".masonry-secondary-section"),
    );

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
