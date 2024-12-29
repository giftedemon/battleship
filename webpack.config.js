const path = require("path");

module.exports = {
    entry: "./src/script.js", // Your main file
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"), // Output directory
    },
    mode: "development", // Change to "production" for minified output
};
