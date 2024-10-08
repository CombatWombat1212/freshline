function homeHeroSection() {
  const heroSection = document.querySelector("#home--hero");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: heroSection,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });

  // tl.fromTo(
  //   heroSection,
  //   {
  //     "--background-image-top-multiplier": -0.65,
  //     "--foreground-image-top-multiplier": 0.85,
  //   },
  //   {
  //     "--background-image-top-multiplier": 0.65,
  //     "--foreground-image-top-multiplier": 0.25,
  //     ease: Linear.easeNone,
  //   },
  // );


  tl.fromTo(
    heroSection,
    {
      "--background-image-top-multiplier": -1,
    },
    {
      "--background-image-top-multiplier": 1,
      ease: Linear.easeNone,
    },
  );





  // tl.fromTo(
  //   heroSection,
  //   {
  //     "--background-image-top-multiplier": -0.6,
  //     "--foreground-image-top-multiplier": 1.25,
  //   },
  //   {
  //     "--background-image-top-multiplier": 0.65,
  //     "--foreground-image-top-multiplier": 0.35,
  //     ease: Linear.easeNone,
  //   },
  // );
}

document.addEventListener("DOMContentLoaded", function () {
  homeHeroSection();

  // let count = 0;
  // const interval = setInterval(() => {
  // if (document.documentElement.classList.contains("safari")) {
  gsap.utils.toArray(".masonry-section--collection-list").forEach((elem) => {
    const parent = elem.closest(".masonry-section");
    const height = window.getComputedStyle(parent);

    gsap.fromTo(
      elem,
      {
        "--transform": -0.45,
        willChange: "transform",
      },
      {
        "--transform": 0,
        ease: "none",
        scrollTrigger: {
          trigger: parent,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });

  // clearInterval(interval);
  // }

  //   count += 2;
  //   if (count >= 30) {
  //     clearInterval(interval);
  //   }
  // }, 2000);
});
