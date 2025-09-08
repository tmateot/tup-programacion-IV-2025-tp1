import express from "express";
const app = express()
app.use(express.json())

const PORT = 3000

let alumnos = []

function calcularPromedio(notas){
  let suma = 0
  for(let i=0;i<notas.length;i++){
    suma += notas[i]
  }
  return suma/notas.length
}

function nombreRepetido(nombre){
  return alumnos.some(a=>a.nombre.toLowerCase()===nombre.toLowerCase())
}

app.get("/",(req,res)=>{
  res.send("API Alumnos funcionando")
})

app.post("/alumnos",(req,res)=>{
  const { nombre, nota1, nota2, nota3 } = req.body
  if(!nombre || nota1===undefined || nota2===undefined || nota3===undefined){
    return res.status(400).json({error:"faltan datos"})
  }
  if(nombreRepetido(nombre)){
    return res.status(400).json({error:"ya existe ese alumno"})
  }
  const alumno = {nombre, notas:[nota1,nota2,nota3]}
  alumnos.push(alumno)
  res.status(201).json(alumno)
})

app.get("/alumnos",(req,res)=>{
  const lista = alumnos.map(a=>{
    const prom = calcularPromedio(a.notas)
    let estado = ""
    if(prom<6) estado="Reprobado"
    else if(prom<8) estado="Aprobado"
    else estado="Promocionado"
    return {nombre:a.nombre, notas:a.notas, promedio:prom, estado}
  })
  res.json(lista)
})

app.get("/alumnos/:nombre",(req,res)=>{
  const alu = alumnos.find(a=>a.nombre.toLowerCase()===req.params.nombre.toLowerCase())
  if(!alu) return res.status(404).json({error:"alumno no encontrado"})
  const prom = calcularPromedio(alu.notas)
  let estado = ""
  if(prom<6) estado="Reprobado"
  else if(prom<8) estado="Aprobado"
  else estado="Promocionado"
  res.json({nombre:alu.nombre, notas:alu.notas, promedio:prom, estado})
})

app.put("/alumnos/:nombre",(req,res)=>{
  const alu = alumnos.find(a=>a.nombre.toLowerCase()===req.params.nombre.toLowerCase())
  if(!alu) return res.status(404).json({error:"alumno no encontrado"})
  const { nombre:nuevo, nota1, nota2, nota3 } = req.body
  if(!nuevo || nota1===undefined || nota2===undefined || nota3===undefined){
    return res.status(400).json({error:"faltan datos"})
  }
  if(nuevo.toLowerCase()!==alu.nombre.toLowerCase() && nombreRepetido(nuevo)){
    return res.status(400).json({error:"ya existe ese alumno"})
  }
  alu.nombre = nuevo
  alu.notas = [nota1,nota2,nota3]
  res.json(alu)
})

app.delete("/alumnos/:nombre",(req,res)=>{
  const index = alumnos.findIndex(a=>a.nombre.toLowerCase()===req.params.nombre.toLowerCase())
  if(index===-1) return res.status(404).json({error:"alumno no encontrado"})
  const eliminado = alumnos.splice(index,1)
  res.json({mensaje:"alumno eliminado", eliminado})
})

app.listen(PORT,()=>{console.log("Servidor corriendo en http://localhost:"+PORT)})
