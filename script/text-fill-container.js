document.addEventListener("DOMContentLoaded", function () {
  const resizeText = () => {
    const elements = document.querySelectorAll("[data-text-fill-container]");

    elements.forEach((element) => {
      const parent = element.parentElement;
      const style = window.getComputedStyle(parent);
      const containerWidth =
        parent.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);
      const containerHeight =
        parent.clientHeight -
        parseFloat(style.paddingTop) -
        parseFloat(style.paddingBottom);

      let fontSize = 10;
      element.style.fontSize = fontSize + "px";

      while (
        element.scrollWidth <= containerWidth &&
        element.scrollHeight <= containerHeight &&
        fontSize < 300
      ) {
        fontSize++;
        element.style.fontSize = fontSize + "px";
      }

      element.style.fontSize = fontSize - 1 + "px";
    });
  };

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const handleResize = debounce(resizeText, 300);
  window.addEventListener("resize", handleResize);

  const observer = new MutationObserver(
    debounce((mutations) => {
      resizeText();
    }, 300),
  );

  document.querySelectorAll("[data-text-fill-container]").forEach((element) => {
    observer.observe(element.parentElement, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  });

  setTimeout(resizeText, 200);
});
