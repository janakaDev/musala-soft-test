import {Request, Response} from 'express';
import {getAllGatewaysWithDevices, createGateway, getGatewayByIdWithDevices, getGatewayById} from "../models/gateway";
import {gatewaySchema} from "../validations/requestValidations";

/**
 * Controller for Gateway model operations.
 */
export default class GatewayController {

    /**
     * Get all gateways with their peripheral devices.
     * @param req - Express request object
     * @param res - Express response object
     * @returns void
     */
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const gateways = getAllGatewaysWithDevices();
            res.status(200).json(gateways);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    /**
     * Get a single gateway by ID with its peripheral devices.
     * @param req - Express request object with the gateway ID as a parameter
     * @param res - Express response object
     * @returns void
     */
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const data = req.params;
            const gateway = await getGatewayByIdWithDevices(data.id);
            if (gateway) {
                res.status(200).json(gateway);
            } else {
                res.status(404).send('Gateway not found');
            }
        } catch (error) {
            res.status(500).send(error);
        }
    }

    /**
     * Create a new gateway.
     * @param req - Express request object with the gateway details in the body
     * @param res - Express response object
     * @returns void
     */
    async create(req: Request, res: Response): Promise<any> {
        try {
            const data = req.body;
            const {error} = gatewaySchema.validate(req.body);
            if (error) {
                res.status(400).send(error.details[0].message);
            }
            // Check if gateway with same serialNumber already exists
            const existingGateway = await getGatewayById(data.serialNumber);
            if (existingGateway[0]) {
                return res.status(400).json({ error: 'Gateway with same serialNumber already exists' });
            }

            const gateway = createGateway(data.serialNumber, data.name, data.ipv4Address);
            res.status(201).json(gateway);
        } catch (error: any) {
            res.status(500).send('Internal server error');
        }
    }
}
