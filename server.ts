import express from "express";
import { createServer as createViteServer } from "vite";
import app from "./src/app.js";

const PORT = 3000;

async function startDevServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode: tích hợp Vite HMR middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode (khi chạy server.ts trực tiếp ở môi trường có dist/)
    const path = await import("path");
    const distPath = path.default.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.default.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[VietKey Shop] Máy chủ hoạt động tại cổng ${PORT}`);
  });
}

startDevServer();
