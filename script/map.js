const BREAKPOINTS = {
  XS: 0,
  SM: 478,
  MD: 767,
  LG: 991,
  XL: 1328,
};

function isBelowBreakpoint(currentBp, targetBp) {
  return Object.keys(BREAKPOINTS).indexOf(currentBp) <= Object.keys(BREAKPOINTS).indexOf(targetBp);
}

const MARKER_ICONS = {
  primary: {
    default: "https://cdn.prod.website-files.com/6673386a4f6b7ddc70a5931f/66cf9400ddd1e5db619f8cba_flag-drop_accent_non-hovered.svg",
    hovered: "https://cdn.prod.website-files.com/6673386a4f6b7ddc70a5931f/66cf9400c723430ff0769e72_flag-drop_accent_hovered.svg",
  },

  turf: {
    default: "https://cdn.prod.website-files.com/6673386a4f6b7ddc70a5931f/66cf94000391c256cbe6ec32_flag-drop_turf_non-hovered.svg",
    hovered: "https://cdn.prod.website-files.com/6673386a4f6b7ddc70a5931f/66cf9400bfd20cd313aad703_flag-drop_turf_hovered.svg",
  },
};

class MyMap {
  constructor(elem) {
    this.elem = elem;
    this.section = elem.closest(".map-section");
    this.close = Array.from(this.section.querySelectorAll(".map--close"));
    this.left = Array.from(this.section.querySelectorAll(".map--seek-button.left"));
    this.right = Array.from(this.section.querySelectorAll(".map--seek-button.right"));
    this.embed = L.map(elem).setView([20, 0], 2);
    this.theme = elem.getAttribute("data-theme") || "primary";
    this.type = elem.getAttribute("data-map") || "";
    this.link = {};
  }

  async getLink() {
    const linkElem = this.section.querySelector(".map--link");
    const linkHref = linkElem.getAttribute("href");
    const linkData = await fetch(linkHref).then((response) => response.text());

    this.link = {
      elem: linkElem,
      href: linkHref,
      data: linkData,
    };
  }

  loaded() {
    this.elem.setAttribute("data-loaded", "true");
  }

  draw() {
    if (this.theme === "primary") {
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}" + (L.Browser.retina ? "@2x.png" : ".png"), {
        maxZoom: 20,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
      }).addTo(this.embed);
    } else {
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}" + (L.Browser.retina ? "@2x.png" : ".png"), {
        maxZoom: 20,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
      }).addTo(this.embed);
    }

    // else {
    //   L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    //     maxZoom: 19,
    //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    //   }).addTo(this.embed);
    // }
  }
}

function getExpeditions(map) {
  const mapSection = map.elem.closest(".map-section");
  const dynItems = mapSection.querySelectorAll(".w-dyn-item:not(.w-dyn-item .w-dyn-item)");

  const arr = Array.from(dynItems).map((item) => {
    const obj = { elem: item };
    const attrs = Array.from(item.attributes);
    attrs.forEach((attr) => {
      if (!attr.name.startsWith("data-")) return;
      const propName = attr.name.slice(5).replace(/-./g, (x) => x[1].toUpperCase());
      obj[propName] = attr.value;
    });
    return obj;
  });

  return arr;
}

class Marker {
  constructor(map) {
    this.map = map;

    const size = [32.3, 42.5];
    const iconAnchor = [16.15, 42.5];
    const popupAnchor = [0, -42.5];

    this.icon = {
      default: L.icon({
        iconUrl: MARKER_ICONS[map.theme].default,
        iconSize: size,
        iconAnchor: iconAnchor,
        popupAnchor: popupAnchor,
      }),
      hovered: L.icon({
        iconUrl: MARKER_ICONS[map.theme].hovered,
        iconSize: size,
        iconAnchor: iconAnchor,
        popupAnchor: popupAnchor,
      }),
    };
  }
}

async function initExpeditionMap(map) {
  await map.getLink();

  if (!map.link.data) {
    return;
  }

  const marker_options = {
    startIconUrl: null,
    endIconUrl: null,
    shadowUrl: null,
    wptIconUrls: {
      "": null,
    },
  };
  const polyline_options = {
    color: "var(--color--accent)",
    opacity: 1,
    weight: 5,
  };

  function handleExpeditionMapLoad(e) {
    const bounds = e.target.getBounds();
    const zoomOutFactor = 0.5;
    const zoomLevel = map.embed.getBoundsZoom(bounds) - zoomOutFactor;

    const bufferFactor = 0.2; // Adjust this factor as needed for more buffer
    const paddedBounds = bounds.pad(bufferFactor);

    map.embed.fitBounds(paddedBounds); // Fit map to padded GPX bounds
    map.embed.setZoom(zoomLevel); // Set initial zoom level
    map.embed.setMinZoom(map.embed.getBoundsZoom(bounds) - 2); // Set minimum zoom level
    map.embed.setMaxBounds(paddedBounds); // Restrict panning to padded GPX bounds
    map.loaded();
  }

  const gpxLayer = new L.GPX(map.link.href, {
    async: true,
    marker_options,
    polyline_options,
  });

  gpxLayer.on("loaded", handleExpeditionMapLoad);
  gpxLayer.addTo(map.embed);
}

document.addEventListener("DOMContentLoaded", async (event) => {
  document.querySelectorAll("[data-map]").forEach((mapElement) => {
    const map = new MyMap(mapElement);
    const customMarker = new Marker(map);

    const allMarkers = [];
    let selectedMarker = null;

    map.draw();

    if (map.type === "expedition") {
      initExpeditionMap(map);
      // that link will be to a text file, grab it and log its contents
    } else {
      map.close.forEach((btn) => {
        btn.addEventListener("click", handleCloseButtonClick);
      });

      map.elem.addEventListener("click", handlePopupClose);

      map.left.forEach((button) => {
        button.addEventListener("click", () => seek("left"));
      });

      map.right.forEach((button) => {
        button.addEventListener("click", () => seek("right"));
      });

      addAllMarkers();

      map.loaded();
    }

    function handleSwipe(direction) {
      seek(direction);
    }

    function handleResize() {
      const windowWidth = window.innerWidth;
      const breakpoint =
        Object.keys(BREAKPOINTS).find((key) => {
          const breakpointValue = BREAKPOINTS[key];
          return windowWidth <= breakpointValue;
        }) || "XL";

      if (!isBelowBreakpoint(breakpoint, "LG")) return;

      const expeditionsArray = getExpeditions(map);
      const firstExpedition = expeditionsArray[0];
      processItemClick(firstExpedition, firstExpedition.elem, expeditionsArray);

      const container = map.section.querySelectorAll(".map--selection-wrapper");
      container.forEach((c) => {
        c.addEventListener("swiped-left", () => handleSwipe("right"));
        c.addEventListener("swiped-right", () => handleSwipe("left"));
      });
    }

    function handlePopupClose(event) {
      const isPopupClose = event.target.classList.contains("leaflet-popup-close-button");
      const isPopupCloseChild = event.target.parentElement.classList.contains("leaflet-popup-close-button");

      if (isPopupClose || isPopupCloseChild) {
        const expeditionsArray = getExpeditions(map);
        removeSelection(expeditionsArray);
        resetMapView();
      }
    }

    function handleCloseButtonClick() {
      map.embed.closePopup();
      const expeditionsArray = getExpeditions(map);

      removeSelection(expeditionsArray);
      resetMapView();
    }

    function zoomToLocation(lat, long, marker) {
      map.embed.flyTo([lat, long], 6, {
        duration: 1.75,
      });
      marker.openPopup();
    }

    function applySelection(item, expeditionsArray) {
      map.elem.closest(".map--container").classList.add("selected");

      const selectionWrapper = map.elem.closest(".map-section").querySelector(".map--selection-wrapper");
      expeditionsArray.forEach((i) => {
        if (i.elem !== item) {
          i.elem.classList.add("d-none");
        } else {
          i.elem.classList.remove("d-none");
          i.elem.classList.add("selected");
          i.elem.removeEventListener("click", handleItemClick);
        }
      });
      // selectionWrapper.classList.add("no-scroll");
      // selectionWrapper.style.setProperty("overflow", "unset!important");
      selectionWrapper.style.setProperty("overflow", "auto!important");
    }

    function removeSelection(expeditionsArray) {
      map.elem.closest(".map--container").classList.remove("selected");

      const selectionWrapper = map.elem.closest(".map-section").querySelector(".map--selection-wrapper");
      expeditionsArray.forEach((i) => {
        i.elem.classList.remove("selected");
        i.elem.classList.remove("d-none");
        setTimeout(() => {
          i.elem.addEventListener("click", handleItemClick);
        }, 0);
      });
      selectionWrapper.classList.remove("no-scroll");
    }

    function handleItemClick(event) {
      const itemElem = event.currentTarget;
      itemElem.closest(".map--container").classList.add("selected");
      if (itemElem.classList.contains("selected")) {
        return;
      }
      const expeditionsArray = getExpeditions(map);
      const item = expeditionsArray.find((i) => i.elem === itemElem);

      if (item) {
        processItemClick(item, itemElem, expeditionsArray);
      }
    }

    function processItemClick(item, itemElem, expeditionsArray) {
      const lat = parseFloat(item.lat);
      const long = parseFloat(item.long);
      const marker = allMarkers.find((m) => m.itemElem === itemElem);
      if (marker) {
        applySelection(itemElem, expeditionsArray);
        zoomToLocation(lat, long, marker.leafletMarker);
        setSelectedMarker(marker.leafletMarker);
      }
    }

    function setSelectedMarker(marker) {
      if (selectedMarker) {
        selectedMarker.setIcon(customMarker.icon.default);
        selectedMarker.closePopup();
      }
      selectedMarker = marker;
      selectedMarker.setIcon(customMarker.icon.hovered);
      selectedMarker.openPopup();
    }

    function addAllMarkers() {
      const expeditionsArray = getExpeditions(map);

      expeditionsArray.forEach((item) => {
        const lat = parseFloat(item.lat);
        const long = parseFloat(item.long);
        const country = item.country;

        if (!isNaN(lat) && !isNaN(long)) {
          const marker = L.marker([lat, long], {
            icon: customMarker.icon.default,
          })
            .addTo(map.embed)
            .bindPopup(`<b>${country}</b>`);

          allMarkers.push({ itemElem: item.elem, leafletMarker: marker });

          item.elem.addEventListener("click", handleItemClick);

          item.elem.addEventListener("mouseover", () => {
            marker.setIcon(customMarker.icon.hovered);
            marker.openPopup();
          });

          item.elem.addEventListener("mouseout", () => {
            if (selectedMarker !== marker) {
              marker.setIcon(customMarker.icon.default);
              marker.closePopup();
            }
          });

          marker.on("mouseover", () => {
            marker.setIcon(customMarker.icon.hovered);
            marker.openPopup();
          });

          marker.on("mouseout", () => {
            if (selectedMarker !== marker) {
              marker.setIcon(customMarker.icon.default);
              marker.closePopup();
            }
          });

          marker.on("click", () => {
            applySelection(item.elem, expeditionsArray);
            zoomToLocation(lat, long, marker);
            setSelectedMarker(marker);
          });
        } else {
          console.error(`Invalid coordinates for ${country}`);
        }
      });
    }

    function resetMapView() {
      map.embed.flyTo([20, 0], 2, {
        duration: 1.75,
      });
      if (selectedMarker) {
        selectedMarker.setIcon(customMarker.icon.default);
        selectedMarker.closePopup();
        selectedMarker = null;
      }
    }

    function seek(direction) {
      const expeditionsArray = getExpeditions(map);
      const selectedElem = map.elem.closest(".map-section").querySelector(".w-dyn-item.selected");
      let selectedIndex = expeditionsArray.findIndex((item) => item.elem === selectedElem);

      if (direction === "left") {
        selectedIndex = (selectedIndex - 1 + expeditionsArray.length) % expeditionsArray.length;
      } else if (direction === "right") {
        selectedIndex = (selectedIndex + 1) % expeditionsArray.length;
      }

      const target = expeditionsArray[selectedIndex];

      if (target.elem) {
        removeSelection(expeditionsArray);
        setTimeout(() => {
          processItemClick(target, target.elem, expeditionsArray);
        }, 0);
      }
    }

    window.addEventListener("resize", handleResize);
    setTimeout(handleResize, 0);
  });
});
