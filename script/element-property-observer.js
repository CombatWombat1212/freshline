document.addEventListener("DOMContentLoaded", () => {
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const updateElementProperty = ({
    watch,
    target,
    property = "width",
    name,
    all = false,
  }) => {
    const watchedElements = all ? document.querySelectorAll(watch) : [document.querySelector(watch)];
    if (!watchedElements.length) return;

    watchedElements.forEach((watchedElement) => {
      const computedValue = window.getComputedStyle(watchedElement)[property];
      const targetElements = all ? document.querySelectorAll(target) : [document.querySelector(target)];
      targetElements.forEach((targetElement) => {
        if (targetElement) {
          if (name) {
            targetElement.style.setProperty(name, computedValue);
          } else {
            targetElement.style[property] = computedValue;
          }
        }
      });
    });
  };

  const createObserver = ({ watch, target, property = "width", name, all = false }) => {
    const debouncedUpdateProperty = debounce(
      () => updateElementProperty({ watch, target, property, name, all }),
      100,
    );

    const observer = new MutationObserver(debouncedUpdateProperty);
    const config = { attributes: true, childList: true, subtree: true };

    const watchedElements = all ? document.querySelectorAll(watch) : [document.querySelector(watch)];
    watchedElements.forEach((watchedElement) => {
      if (watchedElement) {
        observer.observe(watchedElement, config);
      }
    });

    window.addEventListener("resize", debouncedUpdateProperty);
    debouncedUpdateProperty();
  };

  window.createObserver = createObserver;
});
