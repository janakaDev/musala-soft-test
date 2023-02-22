import {Request, Response} from 'express';
import {addPeripheralDevice, removePeripheralDeviceFromGateway} from "../models/gateway";

/**
 Controller class for PeripheralDevice related operations
 */
export class PeripheralDeviceController {
    /**
     * Adds a new peripheral device to the gateway
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @returns {Promise<void>}
     */
    public async addPeripheralDevicetoGateWay(req: Request, res: Response): Promise<void> {
        try {
            const result = await addPeripheralDevice(
                req.body.id,
                req.body.uid,
                req.body.vendor,
                req.body.createdDate,
                req.body.status
            )
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).send('Failed to add peripheral device');
            }
        } catch (error: any) {
            if (error.message === 'Gateway not found') {
                res.status(404).send('Gateway not found');
            } else if (error.message === 'Gateway has reached the maximum number of associated devices') {
                res.status(400).send('Gateway has reached the maximum number of associated devices');
            } else {
                res.status(500).send('Internal server error');
            }
        }
    }

    /**
     * Removes a peripheral device from the gateway
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @returns {Promise<void>}
     */
    public async removePeripheralDeviceFromGateway(req: Request, res: Response): Promise<void> {
        try {
            const result = await removePeripheralDeviceFromGateway(
                req.params.gatewayId,
                req.params.pheripheralDeviceID,
            )

            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).send('Failed to remove peripheral device');
            }
        } catch (error: any) {
            if (error.message === 'Gateway not found') {
                res.status(404).send('Gateway not found');
            } else if (error.message === 'Peripheral device not found') {
                res.status(404).send('Peripheral device not found');
            } else {
                res.status(500).send('Internal server error');
            }
        }
    }
}
