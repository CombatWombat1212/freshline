// animations.js

function getCSSVariable(variable) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
}

function setHoverAnimations(dot, bubble) {
  const dotNumber = dot.querySelector(".journey--dot-number");
  const bubbleChildren = bubble.children;

  const accentColor = getCSSVariable("--color--accent");
  const accentHoveredColor = getCSSVariable("--color--accent__hovered");

  let isHovered = false;

  // Set initial state
  gsap.set(bubble, {
    opacity: 0,
    y: 20,
  });

  Array.from(bubbleChildren).forEach((child) => {
    gsap.set(child, {
      opacity: 0,
      y: 20,
    });
  });

  // Idle bobbing animation with random start time
  const randomDelay = Math.random(); // Random delay between 0 and 1 second
  const bobbingAnimation = gsap
    .to(dot, {
      y: -10,
      duration: 1,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut",
      delay: randomDelay,
    })
    .pause();

  function handleMouseEnterFocus() {
    if (!isHovered) {
      isHovered = true;
      bobbingAnimation.pause(); // Pause the bobbing animation

      gsap.to(bubble, {
        duration: 0.3,
        opacity: 1,
        y: 0,
        ease: "power2.out",
      });

      Array.from(bubbleChildren).forEach((child, index) => {
        gsap.to(child, {
          duration: 0.3,
          opacity: 1,
          y: 0,
          ease: "power2.out",
          delay: 0.05 * (index + 1), // Reduced delay for more overlap
        });
      });

      gsap.to(dot, {
        duration: 0.3,
        y: 0, // Return to original position
        backgroundColor: accentHoveredColor,
        rotation: 10,
        ease: "power2.out",
      });

      gsap.to(dotNumber, {
        duration: 0.3,
        scale: 1.1,
        ease: "power2.out",
      });
    }
  }

  function handleMouseLeaveBlur() {
    if (isHovered) {
      isHovered = false;

      gsap.to(bubble, {
        duration: 0.3,
        opacity: 0,
        y: 20,
        ease: "power2.in",
      });

      Array.from(bubbleChildren).forEach((child, index) => {
        gsap.to(child, {
          duration: 0.3,
          opacity: 0,
          y: 20,
          ease: "power2.in",
          delay: 0.05 * (index + 1), // Reduced delay for more overlap
        });
      });

      gsap.to(dot, {
        duration: 0.3,
        backgroundColor: accentColor,
        rotation: 0,
        ease: "power2.in",
        onComplete: () => {
          if (!isHovered) {
            bobbingAnimation.restart(true); // Restart the bobbing animation
          }
        },
      });

      gsap.to(dotNumber, {
        duration: 0.3,
        scale: 1,
        ease: "power2.in",
      });
    }
  }

  dot.addEventListener("mouseenter", handleMouseEnterFocus);
  dot.addEventListener("focus", handleMouseEnterFocus);

  dot.addEventListener("mouseleave", handleMouseLeaveBlur);
  dot.addEventListener("blur", handleMouseLeaveBlur);

  // Start the bobbing animation initially
  bobbingAnimation.play();
}
