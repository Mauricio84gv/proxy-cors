const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("✅ Render está ejecutando correctamente este servidor.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ Servidor escuchando en puerto", PORT);
});
