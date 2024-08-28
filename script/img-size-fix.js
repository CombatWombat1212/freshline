class Img {
  constructor(elem) {
    this.elem = elem;
    this.src = elem.getAttribute("src");
    this.width = 0;
    this.height = 0;
    this.key = `img-size-${this.src}`;
    this.storedSize = this.getStoredSize();
  }

  init() {
    if (this.storedSize) {
      this.setSize(this.storedSize.width, this.storedSize.height);
    }

    if (this.elem.complete) this.handleLoad({ target: this.elem });
    else this.elem.addEventListener("load", this.handleLoad.bind(this));
  }

  getStoredSize() {
    const stored = localStorage.getItem(this.key);
    return stored ? JSON.parse(stored) : null;
  }

  setSize(width, height) {
    if (!width || !height) return;
    this.elem.setAttribute("width", width);
    this.elem.setAttribute("height", height);
  }

  saveSize(width, height) {
    const size = { width, height, timestamp: Date.now() };
    localStorage.setItem(this.key, JSON.stringify(size));
  }

  handleLoad(e) {
    const img = e.target || this.elem;
    const width = img.naturalWidth;
    const height = img.naturalHeight;

    const widthAttr = img.getAttribute("width");
    const heightAttr = img.getAttribute("height");

    if (widthAttr && widthAttr !== "0" && widthAttr !== "auto" && heightAttr && heightAttr !== "0" && heightAttr !== "auto") {
      return;
    }

    if (!this.storedSize) {
      this.saveSize(width, height);
      return;
    }

    const { width: storedWidth, height: storedHeight } = this.storedSize;
    if (width !== storedWidth || height !== storedHeight) {
      this.saveSize(width, height);
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const imgElems = document.querySelectorAll("img");
  const imgs = Array.from(imgElems).map((elem) => new Img(elem));
  imgs.forEach((img) => img.init());
});
