const express = require('express');
const fs = require('fs'); // Importar módulo fs para leer archivos
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Datos en memoria
let clientes = []; // Array para almacenar clientes
let idCounter = 1; // Contador para IDs únicos

// Cargar datos desde clientes.json al iniciar el servidor
fs.readFile('./clientes.json', 'utf8', (err, data) => {
    if (err) {
        console.error("Error al leer el archivo clientes.json:", err);
    } else {
        clientes = JSON.parse(data);
        idCounter = clientes.length + 1; // Ajustar el contador de IDs
        console.log(`Se cargaron ${clientes.length} clientes desde clientes.json`);
    }
});

// Ruta para agregar un cliente
app.post('/clientes', (req, res) => {
    const { nombre, correo, comidasFavoritas, descuentoNavideno } = req.body;

    if (!nombre || !correo) {
        return res.status(400).json({ mensaje: "El nombre y correo son obligatorios." });
    }

    const nuevoCliente = {
        id: idCounter++,
        nombre,
        correo,
        comidasFavoritas: comidasFavoritas || [],
        descuentoNavideno: descuentoNavideno || { porcentaje: 0, descripcion: "" }
    };

    clientes.push(nuevoCliente);
    res.status(201).json({ mensaje: "Cliente agregado correctamente.", cliente: nuevoCliente });
});

// Ruta para obtener todos los clientes
app.get('/clientes', (req, res) => {
    res.json(clientes);
});

// Ruta para obtener un cliente por id
app.get('/clientes/:id', (req, res) => {
    const { id } = req.params;
    const cliente = clientes.find(c => c.id === parseInt(id));

    if (!cliente) {
        return res.status(404).json({ mensaje: "Cliente no encontrado." });
    }

    res.json(cliente);
});

// Ruta para agregar comidas favoritas a un cliente
app.post('/clientes/:id/comidas', (req, res) => {
    const { id } = req.params;
    const { comida } = req.body;

    const cliente = clientes.find(c => c.id === parseInt(id));
    if (!cliente) {
        return res.status(404).json({ mensaje: "Cliente no encontrado." });
    }

    cliente.comidasFavoritas.push(comida);
    res.json({ mensaje: "Comida favorita agregada.", comidasFavoritas: cliente.comidasFavoritas });
});

// Ruta para asignar descuento navideño
app.post('/clientes/:id/descuento', (req, res) => {
    const { id } = req.params;
    const { porcentaje, descripcion } = req.body;

    const cliente = clientes.find(c => c.id === parseInt(id));
    if (!cliente) {
        return res.status(404).json({ mensaje: "Cliente no encontrado." });
    }

    cliente.descuentoNavideno = { porcentaje, descripcion };
    res.json({ mensaje: "Descuento asignado.", descuentoNavideno: cliente.descuentoNavideno });
});

// Ruta para eliminar un cliente
app.delete('/clientes/:id', (req, res) => {
    const { id } = req.params;

    const clienteEncontrado = clientes.some(c => c.id === parseInt(id));
    if (!clienteEncontrado) {
        return res.status(404).json({ mensaje: "Cliente no encontrado." });
    }

    clientes = clientes.filter(c => c.id !== parseInt(id));
    res.json({ mensaje: "Cliente eliminado correctamente." });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
