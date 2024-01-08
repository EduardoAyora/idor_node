const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

const invoices = [
    { id: 2500, uuid: uuidv4(), data: 'Datos de factura 1' },
    { id: 2501, uuid: uuidv4(), data: 'Datos de factura 2' },
    { id: 2502, uuid: uuidv4(), data: 'Datos de factura 3' },
    { id: 2503, uuid: uuidv4(), data: 'Datos de factura 4' },
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

const PORT = 7001;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/facturas/2500`);
    console.log(`http://localhost:${PORT}/facturas-uuid/uuid`);
});