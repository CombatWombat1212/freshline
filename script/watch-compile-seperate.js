const fs = require("fs");
const chokidar = require("chokidar");
const path = require("path");

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
    path.join(outputFolderPath, "scripts.txt"),
    scriptContent,
    "utf-8",
  );
  fs.writeFileSync(
    path.join(outputFolderPath, "style.txt"),
    styleContent,
    "utf-8",
  );
  fs.writeFileSync(
    path.join(outputFolderPath, "index.html"),
    htmlContent,
    "utf-8",
  );

  console.log("Files compiled successfully to the output folder.");
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
