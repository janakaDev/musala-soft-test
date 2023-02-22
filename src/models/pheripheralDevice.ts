import mongoose from 'mongoose';

export interface IPeripheralDevice extends mongoose.Document {
    uid: number;
    vendor: string;
    createdDate: Date;
    status: 'online' | 'offline';
}

const PeripheralDeviceSchema = new mongoose.Schema({
    uid: { type: Number, required: true, unique: true },
    vendor: { type: String, required: false },
    createdDate: { type: String, required: false },
    status: { type: String, enum: ['online', 'offline'], required: false },
});

export const PeripheralDevice = mongoose.model<IPeripheralDevice>('PeripheralDevice', PeripheralDeviceSchema);


export const findPeripheralDeviceById = async (id: string): Promise<IPeripheralDevice | null> => {
    return PeripheralDevice.findById(id).exec();
};

export const findAllPeripheralDevices = async (): Promise<IPeripheralDevice[]> => {
    return PeripheralDevice.find({}).exec();
};

export const updatePeripheralDevice = async (id: string, update: Partial<IPeripheralDevice>): Promise<IPeripheralDevice | null> => {
    return PeripheralDevice.findByIdAndUpdate(id, update, { new: true }).exec();
};


export const deletePeripheralDevice = async (id: string): Promise<void> => {
    await PeripheralDevice.findByIdAndDelete(id).exec();
};
