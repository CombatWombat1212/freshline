document.addEventListener("DOMContentLoaded", () => {
  let runs = 0;
  // Function to calculate the difference between two dates
  function calculateCountdown(targetDate) {
    const now = new Date();
    const diff = targetDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Add leading zeros if the value is less than 10
    const paddedHours = hours.toString().padStart(2, "0");
    const paddedMinutes = minutes.toString().padStart(2, "0");
    const paddedSeconds = seconds.toString().padStart(2, "0");

    return `${days} • ${paddedHours} • ${paddedMinutes} • ${paddedSeconds}`;
  }

  // Function to update the countdown for each element
  function updateCountdown(element, targetDate) {
    const state = element.getAttribute("data-countdown-state");
    element.innerHTML = calculateCountdown(targetDate);
    if (runs == 0) {
      setTimeout(() => {
        element.setAttribute("data-countdown-state", "ready");
      }, 1000);
    }
    runs++;
  }

  // Find all elements with the data-countdown attribute
  const countdownElements = document.querySelectorAll("[data-countdown]");

  countdownElements.forEach((element) => {
    const dateText = element.innerHTML.trim();
    const targetDate = new Date(dateText);

    if (!isNaN(targetDate.getTime())) {
      updateCountdown(element, targetDate);
      setInterval(() => {
        updateCountdown(element, targetDate);
      }, 1000);
    } else {
      console.error(`Invalid date format: ${dateText}`);
    }
  });
});
