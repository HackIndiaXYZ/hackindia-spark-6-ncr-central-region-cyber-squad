const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { spawn, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const upload = multer({ dest: 'uploads/' });

// Ensure app.png exists
if (!fs.existsSync("app.png")) {
    fs.writeFileSync("app.png", Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==", "base64"));
}

// Compile Java once on startup
try { execSync("javac src/CryptoUtil.java src/CreateSPDF.java"); }
catch (e) { console.error("Java compile error:", e); }

app.post("/api/create-spdf", upload.single("pdfFile"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "PDF file required" });

    const expiry = req.body.expiry || "2030-12-31T23:59:59";
    const maxOpen = req.body.maxOpen || "10";
    const maxPrint = req.body.maxPrint || "5";
    const password = req.body.password || "1234";

    try {
        // Copy uploaded PDF to sample.pdf for Java to read
        fs.copyFileSync(req.file.path, "sample.pdf");

        const javaProcess = spawn("java", ["-cp", "src", "CreateSPDF"]);

        let spdfPath = "";
        let javaErr = "";
        javaProcess.stdout.on("data", data => {
            spdfPath += data.toString().trim();
        });
        javaProcess.stderr.on("data", data => {
            javaErr += data.toString();
            console.error("Java ERR:", data.toString());
        });

        javaProcess.stdin.write(`${expiry}\n${maxOpen}\n${maxPrint}\n${password}\n`);
        javaProcess.stdin.end();

        javaProcess.on("close", code => {
            // Cleanup temp file
            try { fs.unlinkSync("sample.pdf"); } catch (e) { }

            if (code === 0 && spdfPath && fs.existsSync(spdfPath)) {
                res.set({
                    'Content-Disposition': `attachment; filename="secure-document.spdf"`,
                    'Content-Type': 'application/octet-stream'
                });
                fs.createReadStream(spdfPath).pipe(res);
            } else {
                console.error("SPDF Failed. Code:", code, "Path:", spdfPath, "Err:", javaErr);
                res.status(500).json({ 
                    error: "SPDF creation failed", 
                    details: javaErr || "No output from Java process",
                    pathAttempted: spdfPath 
                });
            }
        });

    } catch (e) {
        console.error("Route exception:", e);
        res.status(500).json({ error: "Server caught exception", msg: e.message });
    }
});

// Keep process alive
setInterval(() => { }, 1000 * 60 * 60);

app.listen(3001, () => console.log("Server running on port 3001"));