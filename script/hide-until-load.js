document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.querySelectorAll("[data-hide-until-load]").forEach((element) => {
      element.setAttribute("data-hide-until-load", "true");
    });
  }, 200);
});
