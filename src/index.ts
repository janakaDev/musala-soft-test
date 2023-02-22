import express, {Application} from 'express';
import GatewayController from './controllers/gatewayController';
import {PeripheralDeviceController} from './controllers/peripheralDeviceController';
import mongoose from "mongoose";

const app: Application = express();

mongoose.connect('mongodb://localhost:27017/gateway', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Enable JSON parsing of request body
app.use(express.json());

// Create controllers
const gatewayController = new GatewayController();
const peripheralDeviceController = new PeripheralDeviceController();

// Gateway endpoints
app.get('/api/gateways', gatewayController.getAll);
app.get('/api/gateways/:id', gatewayController.getById);
app.post('/api/gateways', gatewayController.create);

app.post('/api/peripheral-devices', peripheralDeviceController.addPeripheralDevicetoGateWay);
app.delete('/api/peripheral-devices/:gatewayId/:pheripheralDeviceID', peripheralDeviceController.removePeripheralDeviceFromGateway);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
