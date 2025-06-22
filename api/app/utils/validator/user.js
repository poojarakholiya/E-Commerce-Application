'use strict';

const Joi = require('joi');

const userSignupSchema = Joi.object({
    firstName: Joi.string()
        .required()
        .min(3)
        .max(50)
        .messages({
            'any.required': 'firstName name is required.',
            'string.empty': 'firstName name cannot be empty.',
            'string.min': 'firstName name must be at least {#limit} characters long.',
            'string.max': 'firstName name must be at most {#limit} characters long.',
        }),
    lastName: Joi.string()
        .required()
        .min(3)
        .max(50)
        .messages({
            'any.required': 'lastName name is required.',
            'string.min': 'lastName name must be at least {#limit} characters long.',
            'string.max': 'lastName name must be at most {#limit} characters long.',
        }),
    // userName: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'any.required': 'email is required.',
            'string.email': 'Invalid email format.',
            'string.empty': 'Email cannot be empty.',
        }),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,50}$'))
        .required()
        .messages({
            'any.required': 'password is required.',
            'string.empty': 'password cannot be empty.',
            'string.pattern.base': 'Password must contain at least one digit and one special character.',
        }),
    confirmPassword: Joi.ref('password'),
    role: Joi.string().valid('user','admin')
    .required()
    .messages({
        'any.required': 'role is required.',
        'any.only': 'Invalid role value. Must be one of :admin,user.'
    })
});

const userSignInSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'any.required': 'email is required.',
            'string.email': 'Invalid email format.',
            'string.empty': 'Email cannot be empty.',
        }),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,50}$'))
        .required(),
});

module.exports = {
    userSignupSchema,
    userSignInSchema,
};