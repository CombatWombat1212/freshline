document.addEventListener("DOMContentLoaded", function () {
  const browserInfo = {
    browser: "",
    isChrome: false,
    isFirefox: false,
    isSafari: false,
    isOpera: false,
    isEdge: false,
    browserFound: false,
  };

  const userAgent = window.navigator.userAgent;

  if (userAgent.indexOf("Chrome") > -1) {
    browserInfo.browser = "Chrome";
    browserInfo.isChrome = true;
    browserInfo.browserFound = true;
  } else if (userAgent.indexOf("Safari") > -1) {
    browserInfo.browser = "Safari";
    browserInfo.isSafari = true;
    browserInfo.browserFound = true;
  } else if (userAgent.indexOf("Firefox") > -1) {
    browserInfo.browser = "Firefox";
    browserInfo.isFirefox = true;
    browserInfo.browserFound = true;
  } else if (userAgent.indexOf("Edge") > -1) {
    browserInfo.browser = "Edge";
    browserInfo.isEdge = true;
    browserInfo.browserFound = true;
  } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
    browserInfo.browser = "Opera";
    browserInfo.isOpera = true;
    browserInfo.browserFound = true;
  } else {
    browserInfo.browser = userAgent;
    browserInfo.browserFound = true;
  }

  if (browserInfo.browserFound) {
    document.documentElement.classList.add(`${browserInfo.browser.toLowerCase()}`);
  }

  if (browserInfo.isSafari) {
    const replaceLineSeparator = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = node.textContent.replace(/\u2028/g, " ");
      } else {
        node.childNodes.forEach((child) => replaceLineSeparator(child));
      }
    };

    replaceLineSeparator(document.body);
  }
});
