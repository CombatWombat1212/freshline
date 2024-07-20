// this should be updated to be a custom attribute and apply to others that have similar needs
document.addEventListener("DOMContentLoaded", () => {
  function uniqueFactorsInit() {
    const factors = Array.from(
      document.querySelectorAll(".unique-factors--item"),
    );

    factors.forEach((fac) => {
      const src = fac.querySelector("img").src;
      fac.style.setProperty("--mask-url", `url('${src}'`);
    });
  }

  uniqueFactorsInit();
});
