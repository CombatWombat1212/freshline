document.addEventListener("DOMContentLoaded", () => {
  createObserver({
    watch: ".testimonial--user-wrapper",
    target: ".testimonial",
    property: "height",
    name: "--testimonial-user-wrapper-height",
    all:true,
  });
});
