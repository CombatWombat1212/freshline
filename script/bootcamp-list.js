document.addEventListener("DOMContentLoaded", () => {
  if (
    !window.location.pathname.includes("/expeditions/") &&
    window.location.pathname !== "/bootcamp" &&
    window.location.pathname !== "/about"
  )
    return;

  // console.log("check");

  const section = Array.from(
    document.querySelectorAll(
      "#bootcamp--leaders, #about--founders, #expeditions-subpage--riders",
    ),
  )[0];
  const row = section.querySelector(".profile-card--row");
  const leaders = Array.from(row.querySelectorAll(".profile-card"));

  //   the value that follows .grid- on leaders classlist is the number]

  const grid = (() => {
    const gridClass = Array.from(row.classList).find((str) =>
      str.includes("grid-"),
    );
    const gridValue = gridClass ? Number(gridClass.split("-")[1]) : null;
    return gridValue || 3;
  })();

  if (grid == leaders.length) return;

  const newGrid = leaders.length;
  row.classList.remove(`grid-${grid}`);
  row.classList.add(`grid-${newGrid}`);
});
