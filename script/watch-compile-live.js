const fs = require("fs");
const chokidar = require("chokidar");
const path = require("path");
const ngrok = require("ngrok");

const scriptFolderPath = "./script";
const htmlFolderPath = "./html";
const styleFolderPath = "./style";
const outputFolderPath = "./output";
const ignoredFiles = [
  "watch-compile.js",
  "watch-compile-seperate.js",
  "watch-compile-live.js",
  "sync.js",
  "map.html",
  "version.json",
];

let debounceTimeout;
let ngrokUrls = { scriptUrl: "", styleUrl: "" };

// Ensure output directory exists
if (!fs.existsSync(outputFolderPath)) {
  fs.mkdirSync(outputFolderPath);
}

// Function to read script files without wrapping them in <script> tags
function getScriptFilesContent() {
  const scriptFiles = fs
    .readdirSync(scriptFolderPath)
    .filter((file) => file.endsWith(".js") && !ignoredFiles.includes(file));
  let scriptContent = "";

  scriptFiles.forEach((file) => {
    const filePath = path.join(scriptFolderPath, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    scriptContent += `${fileContent}\n`;
  });

  return scriptContent;
}

// Function to read HTML files without wrapping
function getHtmlFilesContent() {
  const htmlFiles = fs
    .readdirSync(htmlFolderPath)
    .filter((file) => file.endsWith(".html") && !ignoredFiles.includes(file));
  let htmlContent = "";

  htmlFiles.forEach((file) => {
    const filePath = path.join(htmlFolderPath, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    htmlContent += `${fileContent}\n`;
  });

  return htmlContent;
}

// Function to read CSS files without wrapping them in <style> tags
function getStyleFilesContent() {
  const styleFiles = fs
    .readdirSync(styleFolderPath)
    .filter((file) => file.endsWith(".css"));
  let styleContent = "";

  styleFiles.forEach((file) => {
    const filePath = path.join(styleFolderPath, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    styleContent += `${fileContent}\n`;
  });

  return styleContent;
}

// Function to compile all contents into their respective output files
function compileFiles() {
  const htmlContent = getHtmlFilesContent();
  const styleContent = getStyleFilesContent();
  const scriptContent = getScriptFilesContent();

  fs.writeFileSync(
    path.join(outputFolderPath, "scripts.js"),
    scriptContent,
    "utf-8",
  );
  fs.writeFileSync(
    path.join(outputFolderPath, "style.css"),
    styleContent,
    "utf-8",
  );
  fs.writeFileSync(
    path.join(outputFolderPath, "head.html"),
    htmlContent,
    "utf-8",
  );

  // Append the ngrok embed code if URLs are available
  appendNgrokLinks();

  console.log("Files compiled successfully to the output folder.");
}

// Function to append ngrok links to the head.html file
function appendNgrokLinks() {
  if (ngrokUrls.scriptUrl && ngrokUrls.styleUrl) {
    const embedCode = `
<!-- Place these lines in the head of your Webflow site -->
<script src="${ngrokUrls.scriptUrl}"></script>
<link rel="stylesheet" href="${ngrokUrls.styleUrl}">
`;

    const headHtmlPath = path.join(outputFolderPath, "head.html");
    fs.appendFileSync(headHtmlPath, embedCode, "utf-8");

    console.log("Ngrok links appended to head.html");
    console.log("Embed Code:\n", embedCode);
  }
}

// Function to handle debounced CSS file change events
function handleCssFileChange() {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(compileFiles, 200);
}

// Function to handle immediate file change events
function handleImmediateFileChange() {
  compileFiles();
}

// Initialize watchers.
const scriptWatcher = chokidar.watch(scriptFolderPath, {
  persistent: true,
  ignored: (file) => ignoredFiles.includes(file),
});

const htmlWatcher = chokidar.watch(htmlFolderPath, {
  persistent: true,
  ignored: (file) => ignoredFiles.includes(file),
});

const styleWatcher = chokidar.watch(styleFolderPath, {
  persistent: true,
});

// Add event listeners.
scriptWatcher
  .on("change", handleImmediateFileChange)
  .on("add", handleImmediateFileChange)
  .on("ready", compileFiles);
htmlWatcher
  .on("change", handleImmediateFileChange)
  .on("add", handleImmediateFileChange)
  .on("ready", compileFiles);
styleWatcher
  .on("change", handleCssFileChange)
  .on("add", handleCssFileChange)
  .on("ready", compileFiles);

console.log("Watching for changes...");

// Start a simple server to serve the output files
const express = require("express");
const app = express();

app.use(express.static(outputFolderPath));

app.listen(3000, async () => {
  const url = await ngrok.connect(3000);
  ngrokUrls.scriptUrl = `${url}/scripts.js`;
  ngrokUrls.styleUrl = `${url}/style.css`;

  // Append ngrok links to head.html after server starts
  appendNgrokLinks();

  console.log("Server is running...");
  console.log("Ngrok URL:", url);
});
