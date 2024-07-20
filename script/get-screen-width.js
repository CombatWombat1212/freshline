(function () {
  let timeoutId;

  function updateDimensions() {
    const computedWidth = getComputedStyle(document.documentElement).width;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--screen-width", computedWidth);
    document.documentElement.style.setProperty(
      "--scrollbar-width",
      `${scrollbarWidth}px`,
    );
  }

  function debounceUpdate() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(updateDimensions, 0);
  }

  // Update on resize
  window.addEventListener("resize", debounceUpdate);

  // Update on mutation
  const observer = new MutationObserver(debounceUpdate);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["style"],
  });

  // Initial update
  updateDimensions();
})();
