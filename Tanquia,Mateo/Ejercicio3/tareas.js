import express from "express";
const app = express()
app.use(express.json())

const PORT = 3000

let tareas = []

function tareaExistente(nombre) {
    return tareas.some(t => t.nombre.toLowerCase() === nombre.toLowerCase())
}

app.post("/tareas", (req,res)=>{
    const { nombre, completada } = req.body
    if(!nombre || typeof completada !== "boolean") return res.status(400).json({error:"Datos invalidos"})
    if(tareaExistente(nombre)) return res.status(400).json({error:"Tarea ya existe"})
    const tarea = { nombre, completada }
    tareas.push(tarea)
    res.status(201).json(tarea)
})

app.get("/tareas", (req,res)=>{
    const { estado } = req.query
    if(estado === "completada") return res.json(tareas.filter(t=>t.completada))
    if(estado === "sincompletar") return res.json(tareas.filter(t=>!t.completada))
    res.json(tareas)
})

app.get("/tareas/:nombre",(req,res)=>{
    const nombre = req.params.nombre
    const t = tareas.find(t=>t.nombre.toLowerCase()===nombre.toLowerCase())
    if(!t) return res.status(404).json({error:"Tarea no encontrada"})
    res.json(t)
})

app.put("/tareas/:nombre",(req,res)=>{
    const nombre = req.params.nombre
    const t = tareas.find(t=>t.nombre.toLowerCase()===nombre.toLowerCase())
    if(!t) return res.status(404).json({error:"Tarea no encontrada"})
    const { nuevoNombre, completada } = req.body
    if(nuevoNombre && tareaExistente(nuevoNombre) && nuevoNombre.toLowerCase()!==t.nombre.toLowerCase()) return res.status(400).json({error:"Tarea ya existe"})
    if(nuevoNombre) t.nombre = nuevoNombre
    if(typeof completada === "boolean") t.completada = completada
    res.json(t)
})

app.delete("/tareas/:nombre",(req,res)=>{
    const nombre = req.params.nombre
    const index = tareas.findIndex(t=>t.nombre.toLowerCase()===nombre.toLowerCase())
    if(index===-1) return res.status(404).json({error:"Tarea no encontrada"})
    const eliminado = tareas.splice(index,1)
    res.json({mensaje:"Tarea eliminada", eliminado})
})

app.listen(PORT,()=>console.log(`Servidor corriendo en http://localhost:${PORT}`))
