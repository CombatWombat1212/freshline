document.addEventListener("DOMContentLoaded", () => {
  // Function to calculate the difference between two dates
  function calculateCountdown(targetDate) {
    const now = new Date();
    const diff = targetDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${days} • ${hours} • ${minutes} • ${seconds}`;
  }

  // Function to update the countdown for each element
  function updateCountdown(element, targetDate) {
    element.innerHTML = calculateCountdown(targetDate);
  }

  // Find all elements with the data-countdown attribute
  const countdownElements = document.querySelectorAll("[data-countdown]");

  countdownElements.forEach((element) => {
    const dateText = element.innerHTML.trim();
    const targetDate = new Date(dateText);

    if (!isNaN(targetDate.getTime())) {
      // Update the countdown immediately
      updateCountdown(element, targetDate);

      // Update the countdown every second
      setInterval(() => {
        updateCountdown(element, targetDate);
      }, 1000);
    } else {
      console.error(`Invalid date format: ${dateText}`);
    }
  });
});
