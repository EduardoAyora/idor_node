const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// Identificadores complejos

const invoices = [
    { id: 2501, uuid: uuidv4(), data: 'Datos de factura 1' },
    { id: 2502, uuid: uuidv4(), data: 'Datos de factura 2' },
    { id: 2503, uuid: uuidv4(), data: 'Datos de factura 3' },
    { id: 2504, uuid: uuidv4(), data: 'Datos de factura 4' },
];

console.log(invoices);

app.get('/facturas/:id', (req, res) => {
    const invoiceId = req.params.id;
    const invoice = invoices.find((inv) => inv.id == invoiceId);

    if (!invoice) {
        return res.status(404).send('Factura no encontrada');
    }

    res.json(JSON.stringify(invoice));
});

app.get('/facturas-uuid/:uuid', (req, res) => {
    const invoiceUuid = req.params.uuid;
    const invoice = invoices.find((inv) => inv.uuid === invoiceUuid);

    if (!invoice) {
        return res.status(404).send('Factura no encontrada');
    }

    res.json(JSON.stringify(invoice));
});

// Control de accesos

const objects = [
    { token: 'tokensecreto0', data: 'Datos del Usuario 1' },
    { token: 'tokensecreto1', data: 'Datos del Usuario 2' },
];

// Ruta para modificar un objeto (vulnerable)
app.put('/datos/:index', (req, res) => {
    const index = req.params.index;
    const newData = req.body.data;

    const object = objects[index];
    if (!object) {
        return res.status(404).send('Objeto no encontrado');
    }

    object.data = newData;

    res.send('Objeto modificado correctamente');
});

// {
//     "data": "nuevo",
//     "token": "tokensecreto1"
// }
app.put('/datos-seguros/:index', (req, res) => {
    const token = req.body.token;
    const newData = req.body.data;
    const index = req.params.index;

    // Verificar si el objeto pertenece al usuario que hace la solicitud
    const object = objects.find((obj, objIndex) => obj.token == token && index == objIndex);

    if (!object) {
        return res.status(403).send('Acceso no autorizado para modificar este objeto');
    }

    object.data = newData;

    res.send('Objeto modificado correctamente');
});

// Operaciones en el sistema

app.get('/calcular-precio', (req, res) => {
    const cantidad = parseInt(req.query.cantidad) || 0;
    const precio = parseFloat(req.query.precio) || 0;

    const total = cantidad * precio;
    res.send(`El precio total es: $${total.toFixed(2)}`);
});

app.get('/calcular-precio-backend', (req, res) => {
    const precioEnBaseDatos = 15;
    const cantidad = parseInt(req.query.cantidad) || 0;

    const total = cantidad * precioEnBaseDatos;
    res.send(`El precio total es: $${total.toFixed(2)}`);
});


const PORT = 7001;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/facturas/2500`);
    console.log(`http://localhost:${PORT}/facturas-uuid/uuid`);
    console.log(`http://localhost:${PORT}/datos/0`);
    console.log(`http://localhost:${PORT}/datos-seguros/0`);
    console.log(`http://localhost:${PORT}/calcular-precio?cantidad=3&precio=15`);
    console.log(`http://localhost:${PORT}/calcular-precio-backend?cantidad=3`);
});