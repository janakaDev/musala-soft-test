import Joi from 'joi';

export const gatewaySchema = Joi.object({
    serialNumber: Joi.string().required(),
    name: Joi.string().required(),
    ipv4Address: Joi.string().ip().required(),
});

