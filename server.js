const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" })); // Soporta imágenes en base64 grandes

const TARGET_URL = "https://script.google.com/macros/s/AKfycbzWInYPLtjrKf8Jfaey09DODsHfmpKnfG6khN5RKDoP76mSdF40j5okYSid-JIamS5v/exec"; // Reemplaza por tu URL real si cambia

app.post("/proxy", async (req, res) => {
  try {
    const response = await fetch(TARGET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const data = await response.text(); // puede ser JSON o texto plano
    res.status(200).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el proxy", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor proxy corriendo en el puerto ${PORT}`);
});
