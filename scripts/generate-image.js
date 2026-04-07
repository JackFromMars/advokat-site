// Helper script to call gemini_imagen MCP server directly
const { spawn } = require("child_process");
const path = require("path");

const GEMINI_SERVER = "D:/gemini-imagen-mcp/mcp-server.js";
const API_KEY = process.env.GEMINI_API_KEY || "";

function generateImage(prompt, outputPath, aspectRatio = "16:9") {
  return new Promise((resolve, reject) => {
    const proc = spawn(process.execPath, [GEMINI_SERVER], {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, GEMINI_API_KEY: API_KEY },
    });

    let out = "";
    proc.stdout.on("data", (d) => (out += d.toString()));
    proc.stderr.on("data", (d) => process.stderr.write(d));

    const send = (obj) => {
      const s = JSON.stringify(obj);
      proc.stdin.write("Content-Length: " + Buffer.byteLength(s) + "\r\n\r\n" + s);
    };

    send({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "gen", version: "1.0" } } });

    setTimeout(() => {
      send({ jsonrpc: "2.0", method: "notifications/initialized", params: {} });
      send({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "generate_image", arguments: { prompt, output_path: outputPath, aspect_ratio: aspectRatio } } });
    }, 300);

    // Wait for response (up to 60s)
    const timeout = setTimeout(() => { proc.kill(); reject(new Error("Timeout")); }, 60000);

    const check = setInterval(() => {
      const parts = out.split("Content-Length:");
      for (const p of parts.slice(1)) {
        const json = p.substring(p.indexOf("{"));
        try {
          const obj = JSON.parse(json);
          if (obj.id === 2) {
            clearInterval(check);
            clearTimeout(timeout);
            proc.kill();
            resolve(obj.result);
          }
        } catch {}
      }
    }, 500);
  });
}

// CLI usage: node generate-image.js "prompt" "output_path" "aspect_ratio"
const [,, prompt, outputPath, aspect] = process.argv;
if (!prompt || !outputPath) {
  console.error("Usage: node generate-image.js <prompt> <output_path> [aspect_ratio]");
  process.exit(1);
}

generateImage(prompt, path.resolve(outputPath), aspect || "16:9")
  .then((r) => { console.log("OK:", JSON.stringify(r.content?.[0]?.text || "done").slice(0, 200)); })
  .catch((e) => { console.error("FAIL:", e.message); process.exit(1); });
