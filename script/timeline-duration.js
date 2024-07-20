document.addEventListener("DOMContentLoaded", function () {
  const durationElements = document.querySelectorAll("[data-duration]");

  const duration = {
    start: {},
    end: {},
    target: {},
  };

  durationElements.forEach((elem) => {
    const durationType = elem.getAttribute("data-duration");
    if (durationType === "start" || durationType === "end") {
      const dateValue = new Date(elem.textContent.trim());
      duration[durationType] = {
        elem: elem,
        value: dateValue,
      };
    }
  });

  const startDate = duration.start.value;
  const endDate = duration.end.value;

  if (startDate && endDate) {
    const timeDiff = Math.abs(endDate - startDate);
    const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const dayText = dayDiff === 1 ? "1 Day" : `${dayDiff} Days`;

    duration.target = {
      elem: document.querySelector('[data-duration="target"]'),
      value: dayText,
    };

    if (duration.target.elem) {
      duration.target.elem.textContent = dayText;
    }
  }

});
