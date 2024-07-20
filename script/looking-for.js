document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector(".looking-for") === null) return;

  const target = document.querySelector(".looking-for");
  const parentElement = target.parentElement;

  const logPercentageDistance = () => {
    let distanceToBottom =
      target.offsetTop / (parentElement.offsetHeight - target.offsetHeight);

    const scrollTargets = document.querySelectorAll(".looking-for--scroll");
    const totalTargets = scrollTargets.length;
    let activeIndex = -1;

    scrollTargets.forEach((el, index) => {
      el.dataset.index = index;
      el.style.setProperty("--index", index);

      const sliceStart = index / totalTargets;
      const sliceEnd = (index + 1) / totalTargets;

      if (
        distanceToBottom >= sliceStart &&
        (distanceToBottom < sliceEnd ||
          (distanceToBottom === 1 && index === totalTargets - 1))
      ) {
        el.classList.add("active");
        activeIndex = index;
      } else {
        el.classList.remove("active");
      }
    });

    if (activeIndex !== -1) {
      scrollTargets.forEach((el, index) => {
        const distanceFromActive = index - activeIndex;
        el.dataset.distanceFromActive = distanceFromActive;
        el.style.setProperty("--distance-from-active", distanceFromActive);
      });
    }
  };

  window.addEventListener("scroll", logPercentageDistance);
  logPercentageDistance();
});
