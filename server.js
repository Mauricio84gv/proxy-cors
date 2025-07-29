const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");
const app = express();

// Middleware
app.use(cors());
const upload = multer();

// Ruta de verificación
app.get("/", (req, res) => {
  res.send("✅ Proxy funcionando en Render con archivos reales");
});

// Proxy con manejo de archivos
app.post("/proxy", upload.fields([
  { name: "partPhoto" },
  { name: "serialPhoto" }
]), async (req, res) => {
  try {
    const form = new FormData();

    // Campos de texto
    for (let key in req.body) {
      form.append(key, req.body[key]);
    }

    // Archivos si existen
    if (req.files.partPhoto && req.files.partPhoto[0]) {
      form.append("partPhoto", req.files.partPhoto[0].buffer, {
        filename: req.files.partPhoto[0].originalname
      });
    }

    if (req.files.serialPhoto && req.files.serialPhoto[0]) {
      form.append("serialPhoto", req.files.serialPhoto[0].buffer, {
        filename: req.files.serialPhoto[0].originalname
      });
    }

    // Enviar al Apps Script
    const response = await fetch("https://script.google.com/macros/s/AKfycbzWInYPLtjrKf8Jfaey09DODsHfmpKnfG6khN5RKDoP76mSdF40j5okYSid-JIamS5v/exec", {
      method: "POST",
      body: form
    });

    const data = await response.text();
    res.status(200).send(data);
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Proxy error", details: err.message });
  }
});

// Escuchar puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
