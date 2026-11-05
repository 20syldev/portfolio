import { spawn } from "child_process";
import * as fs from "fs";
import * as http from "http";
import type { AddressInfo } from "net";
import * as os from "os";
import * as path from "path";

const outDir = path.join(process.cwd(), "out");
const target = path.resolve(process.argv[2] ?? path.join(outDir, "CV.pdf"));
const browser = process.env.BROWSER_BIN ?? "google-chrome";

// Fixed path, so the browser reuses its profile between runs
const profileDir = path.join(os.tmpdir(), "portfolio-cv-browser");

// Postal address printed on the PDF only: the published page leaves it out
const city = "78550 Houdan";

const types: Record<string, string> = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript",
    ".css": "text/css",
    ".woff2": "font/woff2",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
    ".json": "application/json",
    ".txt": "text/plain; charset=utf-8",
};

/**
 * Fills the element marked data-pdf="city" with the postal address and strips the scripts.
 * Without scripts React never hydrates the page back to the published HTML, so the print
 * stylesheet alone lays out the sheet.
 *
 * @param html - Exported HTML of the CV page
 * @returns The HTML with the city filled in and the scripts removed
 */
function personalise(html: string): string {
    const located = html.replace(
        /<span data-pdf="city" hidden="">\s*<\/span>/,
        `<span data-pdf="city">${city}</span>`
    );

    if (located === html) {
        throw new Error('Error: the data-pdf="city" marker of out/cv/index.html was not found');
    }
    return located.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
}

/**
 * Serves the static export on a free local port, with the personalised CV page.
 *
 * @returns The listening server
 */
function serve(): Promise<http.Server> {
    const server = http.createServer((req, res) => {
        const pathname = decodeURIComponent(new URL(req.url ?? "/", "http://localhost").pathname);
        const file = path.join(outDir, pathname, pathname.endsWith("/") ? "index.html" : "");

        if (!file.startsWith(outDir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
            res.writeHead(404).end();
            return;
        }

        const body = fs.readFileSync(file);
        res.writeHead(200, {
            "Content-Type": types[path.extname(file)] ?? "application/octet-stream",
        });
        res.end(pathname === "/cv/" ? personalise(body.toString("utf-8")) : body);
    });

    return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

/**
 * Prints a page to a PDF file with a headless browser.
 *
 * @param url - Address of the page served locally by serve()
 * @param file - Path the browser writes the PDF to
 * @returns Promise that resolves when the browser exits with 0, whether or not it wrote the file
 */
function print(url: string, file: string): Promise<void> {
    const args = [
        "--headless",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        "--no-pdf-header-footer",
        "--virtual-time-budget=5000",
        `--user-data-dir=${profileDir}`,
        `--print-to-pdf=${file}`,
        ...(process.env.CI ? ["--no-sandbox"] : []),
        url,
    ];

    return new Promise((resolve, reject) => {
        const child = spawn(browser, args, { stdio: ["ignore", "ignore", "pipe"] });
        let stderr = "";
        child.stderr.on("data", (chunk) => (stderr += chunk));
        child.on("error", (error) =>
            reject(new Error(`Error: cannot start ${browser}: ${error.message}`))
        );
        child.on("exit", (code) =>
            code === 0
                ? resolve()
                : reject(new Error(`Error: ${browser} exited with ${code}\n${stderr}`))
        );
    });
}

/**
 * Prints the /cv/ page of the static export to a one-page A4 PDF with a headless browser.
 * Usage: npm run cv [-- <out.pdf>] after npm run build, writes out/CV.pdf by default.
 *
 * @returns Promise that resolves when the PDF is written
 */
async function main(): Promise<void> {
    if (!fs.existsSync(path.join(outDir, "cv", "index.html"))) {
        throw new Error("Error: out/cv/index.html is missing, run npm run build first");
    }

    // Printed aside first, so the target is only replaced by a checked PDF
    const draft = path.join(os.tmpdir(), `portfolio-cv-${process.pid}.pdf`);
    const server = await serve();
    const { port } = server.address() as AddressInfo;

    try {
        await print(`http://127.0.0.1:${port}/cv/`, draft);
    } finally {
        server.close();
    }

    // On some flags the browser exits with 0 without writing anything, so the file is checked
    if (!fs.existsSync(draft)) {
        throw new Error(`Error: ${browser} exited without writing the PDF`);
    }

    const pdf = fs.readFileSync(draft).toString("latin1");
    const pages = pdf.match(/\/Type\s*\/Page(?!s)/g)?.length ?? 0;
    if (pages !== 1) {
        fs.rmSync(draft);
        throw new Error(`Error: the CV has ${pages} pages instead of 1`);
    }

    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(draft, target);
    fs.rmSync(draft);
    console.log(`Generated ${target} (${Math.round(fs.statSync(target).size / 1024)} KB)`);
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});