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
