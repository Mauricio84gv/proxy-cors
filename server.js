const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // si decides usar el fetch nativo, lo quitamos

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// 🧠 Captura errores globales para evitar cierres silenciosos
process.on("uncaughtException", (err) => {
  console.error("❌ Excepción no capturada:", err);
});
process.on("unhandledRejection", (err) => {
  console.error("❌ Rechazo no manejado:", err);
});

// 🟡 Ruta para verificar funcionamiento (Render la usa)
app.get("/", (req, res) => {
  res.send("✅ Proxy funcionando en Render");
});

// 📨 Reenvía datos al Google Apps Script
const TARGET_URL = "https://script.google.com/macros/s/AKfycbzWInYPLtjrKf8Jfaey09DODsHfmpKnfG6khN5RKDoP76mSdF40j5okYSid-JIamS5v/exec";

app.post("/proxy", async (req, res) => {
  try {
    const response = await fetch(TARGET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const data = await response.text(); // Puedes usar .json() si el script responde con JSON
    res.status(200).send(data);
  } catch (err) {
    console.error("❌ Error en el proxy:", err);
    res.status(500).json({ error: "Error en el proxy", details: err.message });
  }
});

// 🔊 Mantiene el servidor activo
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor proxy corriendo en el puerto ${PORT}`);
});
