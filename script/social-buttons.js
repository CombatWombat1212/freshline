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
