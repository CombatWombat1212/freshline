const fetch = require("node-fetch");

const url = "https://api.webflow.com/v2/assets/6685d1f30846d5bd48ae4d22";
const options = {
  method: "PATCH",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    authorization:
      "Bearer 11113273ce706394afc789158d91e7e90be2e35b9d999bd7ca61b8fd34e0d6bf",
  },
  body: JSON.stringify({
    displayName: "style.txt",
    file: {
      data: Buffer.from("test").toString("base64"),
      mimeType: "text/plain"
    }
  }),
};

fetch(url, options)
  .then((res) => res.json())
  .then((json) => console.log(json))
  .catch((err) => console.error("error:" + err));
