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
