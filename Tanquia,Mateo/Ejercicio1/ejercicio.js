import express from "express";
const app = express();

app.use(express.json());

const PORT = 3000;

let calculos = [];

function validarLados(largo, ancho) {
  if (typeof largo !== "number" || typeof ancho !== "number") return false;
  if (largo <= 0 || ancho <= 0) return false;
  return true;
}

app.get("/",(req,res)=>{
  res.send("Hola Mundo")
}
)

app.post("/rectangulos", (req, res) => {
  const { largo, ancho } = req.body;
  if (!validarLados(largo, ancho)) {
    return res.status(400).json({ error: "Valores inválidos" });
  }
  const perimetro = 2 * (largo + ancho);
  const superficie = largo * ancho;
  const calculo = { largo, ancho, perimetro, superficie };
  calculos.push(calculo);
  res.status(201).json(calculo);
});

app.get("/rectangulos", (req, res) => {
  const resultado = calculos.map(c => ({
    ...c,
    tipo: c.largo === c.ancho ? "Cuadrado" : "Rectángulo"
  }));
  res.json(resultado);
});

app.get("/rectangulos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (id < 0 || id >= calculos.length) {
    return res.status(404).json({ error: "Cálculo no encontrado" });
  }
  const c = calculos[id];
  res.json({ ...c, tipo: c.largo === c.ancho ? "Cuadrado" : "Rectángulo" });
});

app.put("/rectangulos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (id < 0 || id >= calculos.length) {
    return res.status(404).json({ error: "Cálculo no encontrado" });
  }
  const { largo, ancho } = req.body;
  if (!validarLados(largo, ancho)) {
    return res.status(400).json({ error: "Valores inválidos" });
  }
  calculos[id].largo = largo;
  calculos[id].ancho = ancho;
  calculos[id].perimetro = 2 * (largo + ancho);
  calculos[id].superficie = largo * ancho;
  res.json(calculos[id]);
});

app.delete("/rectangulos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (id < 0 || id >= calculos.length) {
    return res.status(404).json({ error: "Cálculo no encontrado" });
  }
  const eliminado = calculos.splice(id, 1);
  res.json({ mensaje: "Cálculo eliminado", eliminado });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
