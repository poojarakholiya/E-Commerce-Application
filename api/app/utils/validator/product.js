'use strict';

const Joi = require('joi');

const productSchema = Joi.object({
    productName: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'any.required': 'Product name is required.',
            'string.empty': 'Product name cannot be empty.',
            'string.min': 'Product name must be at least {#limit} characters.',
            'string.max': 'Product name must be at most {#limit} characters.',
        }),
    productDesc: Joi.string()
        .min(5)
        .max(1000)
        .required()
        .messages({
            'any.required': 'Product description is required.',
            'string.empty': 'Product description cannot be empty.',
            'string.min': 'Product description must be at least {#limit} characters.',
            'string.max': 'Product description must be at most {#limit} characters.',
        }),
    productPrice: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            'any.required': 'Product price is required.',
            'number.base': 'Product price must be a number.',
            'number.positive': 'Product price must be greater than zero.',
        }),
    productCategory:  Joi.string()
        .allow('')
        .optional(),

    productQty: Joi.number()
        .integer()
        .min(0)
        .default(0)
        .messages({
            'number.base': 'Quantity must be a number.',
            'number.integer': 'Quantity must be an integer.',
            'number.min': 'Quantity cannot be negative.',
        }),
    deleted_at: Joi.boolean()
        .default(false),
});

module.exports = {
    productSchema,
};