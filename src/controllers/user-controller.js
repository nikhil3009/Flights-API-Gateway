/** @format */

const { response } = require('express');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const { StatusCodes } = require('http-status-codes');
const { UserService } = require('../services');
async function signup(req, res) {
	try {
		const user = await UserService.create({
			email: req.body.email,
			password: req.body.password,
		});
		SuccessResponse.data = user;
		return res.status(StatusCodes.CREATED).json(SuccessResponse);
	} catch (error) {
		ErrorResponse.error = error.message || 'An error occurred';
		const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
		return res.status(statusCode).json(ErrorResponse);
	}
}
async function signin(req, res) {
	try {
		const user = await UserService.signin({
			email: req.body.email,
			password: req.body.password,
		});
		SuccessResponse.data = user;
		return res.status(StatusCodes.CREATED).json(SuccessResponse);
	} catch (error) {
		ErrorResponse.error = error.message || 'An error occurred';
		const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
		return res.status(statusCode).json(ErrorResponse);
	}
}
async function addRoleToUser(req, res) {
	try {
		const user = await UserService.addRoleToUser({
			role: req.body.role,
			id: req.body.id,
		});
		SuccessResponse.data = user;
		return res.status(StatusCodes.CREATED).json(SuccessResponse);
	} catch (error) {
		ErrorResponse.error = error.message || 'An error occurred';
		const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
		return res.status(statusCode).json(ErrorResponse);
	}
}

module.exports = {
	signup,
	signin,
	addRoleToUser,
};
