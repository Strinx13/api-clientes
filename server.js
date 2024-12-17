    const express = require('express');
    const fs = require('fs'); // Importar módulo fs para leer archivos
    const app = express();
    const port = 3000;

    // Middleware para parsear JSON
    app.use(express.json());
    // Middleware para servir archivos estáticos desde la carpeta 'public'
    app.use(express.static('public'));


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

    // Ruta para obtener clientes con paginación
    app.get('/clientes', (req, res) => {
        const { page = 1, limit = 100 } = req.query;

        const pagina = parseInt(page);
        const limite = parseInt(limit);
        const inicio = (pagina - 1) * limite;
        const fin = pagina * limite;

        const clientesPaginados = clientes.slice(inicio, fin);

        res.json({
            total: clientes.length,
            paginaActual: pagina,
            totalPaginas: Math.ceil(clientes.length / limite),
            clientes: clientesPaginados
        });
    });
    // Ruta para obtener solo nombre y comidas favoritas con paginación
    app.get('/clientes/comidas', (req, res) => {
        const { page = 1, limit = 100 } = req.query;

        const pagina = parseInt(page);
        const limite = parseInt(limit);
        const inicio = (pagina - 1) * limite;
        const fin = pagina * limite;

        const resultadoPaginado = clientes
            .slice(inicio, fin)
            .map(cliente => ({
                id: cliente.id,
                nombre: cliente.nombre,
                comidasFavoritas: cliente.comidasFavoritas
            }));

        res.json({
            total: clientes.length,
            paginaActual: pagina,
            totalPaginas: Math.ceil(clientes.length / limite),
            clientes: resultadoPaginado
        });
    });

    // Ruta para obtener solo nombre y descuento navideño con paginación
    app.get('/clientes/descuentos', (req, res) => {
        const { page = 1, limit = 100 } = req.query;

        const pagina = parseInt(page);
        const limite = parseInt(limit);
        const inicio = (pagina - 1) * limite;
        const fin = pagina * limite;

        const resultadoPaginado = clientes
            .slice(inicio, fin)
            .map(cliente => ({
                id: cliente.id,
                nombre: cliente.nombre,
                descuentoNavideno: cliente.descuentoNavideno
            }));

        res.json({
            total: clientes.length,
            paginaActual: pagina,
            totalPaginas: Math.ceil(clientes.length / limite),
            clientes: resultadoPaginado
        });
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
    // Ruta para actualizar los datos de un cliente
app.put('/clientes/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, correo, comidasFavoritas, descuentoNavideno } = req.body;

    const cliente = clientes.find(c => c.id === parseInt(id));
    if (!cliente) {
        return res.status(404).json({ mensaje: "Cliente no encontrado." });
    }

    // Actualizar los datos solo si están presentes en el body
    if (nombre) cliente.nombre = nombre;
    if (correo) cliente.correo = correo;
    if (comidasFavoritas) cliente.comidasFavoritas = comidasFavoritas;
    if (descuentoNavideno) cliente.descuentoNavideno = descuentoNavideno;

    res.json({
        mensaje: "Cliente actualizado correctamente.",
        cliente
    });
});


    // Ruta para obtener nombre y comidas favoritas por ID
    app.get('/clientes/:id/comidas', (req, res) => {
        const { id } = req.params;
        const cliente = clientes.find(c => c.id === parseInt(id));

        if (!cliente) {
            return res.status(404).json({ mensaje: "Cliente no encontrado." });
        }

        res.json({
            id: cliente.id,
            nombre: cliente.nombre,
            comidasFavoritas: cliente.comidasFavoritas
        });
    });

    // Ruta para obtener nombre y descuento navideño por ID
    app.get('/clientes/:id/descuento', (req, res) => {
        const { id } = req.params;
        const cliente = clientes.find(c => c.id === parseInt(id));

        if (!cliente) {
            return res.status(404).json({ mensaje: "Cliente no encontrado." });
        }

        res.json({
            id: cliente.id,
            nombre: cliente.nombre,
            descuentoNavideno: cliente.descuentoNavideno
        });
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

    // Ruta para eliminar solo el descuento navideño de un cliente
    app.delete('/clientes/:id/descuento', (req, res) => {
        const { id } = req.params;

        const cliente = clientes.find(c => c.id === parseInt(id));
        if (!cliente) {
            return res.status(404).json({ mensaje: "Cliente no encontrado." });
        }

        cliente.descuentoNavideno = { porcentaje: 0, descripcion: "" };
        res.json({
            mensaje: "Descuento navideño eliminado correctamente.",
            cliente: {
                id: cliente.id,
                nombre: cliente.nombre,
                descuentoNavideno: cliente.descuentoNavideno
            }
        });
    });

    // Ruta para eliminar todas las comidas favoritas de un cliente
    app.delete('/clientes/:id/comidas', (req, res) => {
        const { id } = req.params;

        const cliente = clientes.find(c => c.id === parseInt(id));
        if (!cliente) {
            return res.status(404).json({ mensaje: "Cliente no encontrado." });
        }

        cliente.comidasFavoritas = [];
        res.json({
            mensaje: "Comidas favoritas eliminadas correctamente.",
            cliente: {
                id: cliente.id,
                nombre: cliente.nombre,
                comidasFavoritas: cliente.comidasFavoritas
            }
        });
    });

    // Iniciar el servidor
    app.listen(port, () => {
        console.log(`Servidor escuchando en http://localhost:${port}`);
    });
