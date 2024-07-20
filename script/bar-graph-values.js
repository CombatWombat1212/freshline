document.addEventListener("DOMContentLoaded", function () {
  class Graph {
    constructor(element) {
      this.parent = element;
      this.data = this.getData();
    }

    getData() {
      const names = Array.from(this.parent.querySelectorAll(".terrain--name"));
      const values = Array.from(
        this.parent.querySelectorAll(".terrain--value"),
      );
      const allData = names.map((name, index) => new Data(name, values[index]));
      return allData;
    }

    postData() {
      this.data.forEach((data, index) => {
        const cssVar = `--graph-value-${index}`;
        this.parent.style.setProperty(cssVar, `${data.value}%`);
      });
    }
  }

  class Data {
    constructor(name, value) {
      this.name = name.textContent;
      this.value = Number(value.textContent);
      this.elems = {
        name: name,
        value: value,
      };
    }
  }

  function graphsInit() {
    const graphElements = Array.from(document.querySelectorAll("[data-graph]"));
    const graphs = graphElements.map((element) => new Graph(element));
    graphs.forEach((graph) => graph.postData());
  }

  graphsInit();
});
