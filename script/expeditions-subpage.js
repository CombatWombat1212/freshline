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
