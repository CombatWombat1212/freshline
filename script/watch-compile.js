const fs = require("fs");
const chokidar = require("chokidar");

const scriptFolderPath = "./script";
const htmlFolderPath = "./html";
const styleFolderPath = "./style";
const outputFilePath = "./output.html";
const ignoredFiles = [
  "watch-compile.js",
  "watch-compile-seperate.js",
  "watch-compile-live.js",
  "sync.js",
  "map.html",
  "version.json",
];

let debounceTimeout;

// Function to read script files and wrap them in <script> tags
function getScriptFilesContent() {
  const scriptFiles = fs
    .readdirSync(scriptFolderPath)
    .filter((file) => file.endsWith(".js") && !ignoredFiles.includes(file));
  let scriptContent = "";

  scriptFiles.forEach((file) => {
    const filePath = `${scriptFolderPath}/${file}`;
    const fileContent = fs.readFileSync(filePath, "utf-8");
    scriptContent += `<script>\n${fileContent}\n</script>\n`;
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
    const filePath = `${htmlFolderPath}/${file}`;
    const fileContent = fs.readFileSync(filePath, "utf-8");
    htmlContent += `${fileContent}\n`;
  });

  return htmlContent;
}

// Function to read CSS files and wrap them in <style> tags
function getStyleFilesContent() {
  const styleFiles = fs
    .readdirSync(styleFolderPath)
    .filter((file) => file.endsWith(".css"));
  let styleContent = "";

  styleFiles.forEach((file) => {
    const filePath = `${styleFolderPath}/${file}`;
    const fileContent = fs.readFileSync(filePath, "utf-8");
    styleContent += `<style>\n${fileContent}\n</style>\n`;
  });

  return styleContent;
}

// Function to compile all contents into the output file
function compileFiles() {
  const htmlContent = getHtmlFilesContent();
  const styleContent = getStyleFilesContent();
  const scriptContent = getScriptFilesContent();

  const outputContent = `${htmlContent}\n${styleContent}\n${scriptContent}`;

  fs.writeFileSync(outputFilePath, outputContent, "utf-8");
  console.log("Files compiled successfully to output.html");
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
