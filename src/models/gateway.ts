import {Schema, Document, model} from 'mongoose';
import {PeripheralDevice} from './pheripheralDevice';

export interface IGatewayModel extends Document {
    serialNumber: string;
    name: string;
    ipv4: string;
    devices: any[];
}

const GatewaySchema = new Schema(
    {
        serialNumber: {type: String, required: true, unique: true},
        name: {type: String, required: true},
        ipv4: {
            type: String,
            required: true
        },
        devices: [{type: Schema.Types.ObjectId, ref: 'PeripheralDevice'}],
    },
    {
        timestamps: true
    }
);

// remove the _id field
GatewaySchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: (doc, ret) => { delete ret._id }
})

const Gateway = model<IGatewayModel>('Gateway', GatewaySchema);

async function getGatewayById(id: string): Promise<any> {
    try {
        const gateway = await Gateway.find({serialNumber: id}).populate('devices');
        if (!gateway) {
            throw new Error(`Gateway with id ${id} not found`);
        }
        return gateway;
    } catch (e) {
        console.log(e)
    }
}

async function addPeripheralDevice(id: string, uid: string, vendor: string, dateCreated: string, status: string): Promise<any> {
    // Create a new peripheral device object
    const peripheralDevice = new PeripheralDevice({
        uid,
        vendor,
        dateCreated,
        status,
    });

    const gateway = await getGatewayById(id);
    if (!gateway) {
        throw new Error('Gateway not found');
    }
    if (gateway[0].devices.length >= 10) {
        throw new Error('Gateway has reached the maximum number of associated devices');
    }
    const newDevice = new PeripheralDevice(peripheralDevice);
    await newDevice.save();
    gateway[0].devices.push(newDevice._id);
    await gateway[0].save();
    return gateway[0];
};


async function getGatewayByIdWithDevices(gatewayId: string): Promise<any> {
    // Find the gateway by its unique identifier, populate its associated devices
    console.log(gatewayId)
    const gateway = await Gateway.find({serialNumber: gatewayId}).populate('devices');
    if (!gateway) {
        throw new Error('Gateway not found');
    }
    return gateway;
}

async function createGateway(
    serialNumber: string,
    name: string,
    ipv4Address: string
): Promise<any> {
    try {
        const gateway = new Gateway({
            serialNumber: serialNumber,
            name: name,
            ipv4: ipv4Address
        });

        await gateway.save();
        return gateway.toObject();
    } catch (error: any) {
        console.log(error)
        if (error.code === 11000) {
            throw new Error('Gateway with the same serial number already exists');
        }
        throw error;
    }
}


async function removePeripheralDeviceFromGateway(gatewayId: string, deviceId: string): Promise<any> {
    // Find the gateway by its unique identifier
    const gateway = await Gateway.find({serialNumber: gatewayId}).populate('devices');
    if (!gateway) {
        throw new Error('Gateway not found');
    }

// Find the index of the device to remove
    const index = gateway[0].devices.findIndex(device => device.id === deviceId);
    if (index < 0) {
        throw new Error('Peripheral device not found');
    }

    gateway[0].devices.splice(index, 1);
    await gateway[0].save();
    return gateway[0];
}

async function getAllGatewaysWithDevices(): Promise<any> {
    const gateways = await Gateway.find().populate('devices');

    return gateways.map(gateway => {
        const populatedGateway = gateway.toObject();
        populatedGateway.devices = populatedGateway.devices.map((device: { toObject: () => any; }) => device.toObject());
        return populatedGateway;
    });
}

export {
    Gateway,
    createGateway,
    getGatewayById,
    addPeripheralDevice,
    getGatewayByIdWithDevices,
    removePeripheralDeviceFromGateway,
    getAllGatewaysWithDevices
};

