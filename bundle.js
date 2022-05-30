const es = require("esbuild");
const fs = require("fs");
const zlib = require("zlib");

const files = [];

es.buildSync({
    entryPoints: ["./index.js"],
    format: "esm",
    outfile: "./index.esm.js",
    // target: "es2020",
    bundle: true,
    legalComments: "none",
    treeShaking: true,
    minify: true,
});

// log the file size of bundled file `./browser.js`
const file = __dirname + "/index.esm.js";
files.push(getGzippedSize(file));

// copy index.d.ts to index.esm.d.ts

console.table(files);

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
function humanFileSize(bytes, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + " B";
    }

    const units = si
        ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
        : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    return bytes.toFixed(dp) + " " + units[u];
}

/**
 * Get gzip size of file
 */
function getGzippedSize(file) {
    const stats = fs.statSync(file);
    const gzip = zlib.gzipSync(fs.readFileSync(file));
    const gzipSize = gzip.length;

    return {
        file: file.replace(__dirname + "/", ""),
        size: humanFileSize(stats.size),
        gzip: humanFileSize(gzipSize)
    };
}
