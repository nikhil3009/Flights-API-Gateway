/** @format */

const { StatusCodes } = require('http-status-codes');
const { UserRepository } = require('../repositories');
const { Auth } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const userRepository = new UserRepository();

async function create(data) {
	try {
		const user = await userRepository.create(data);
		return user;
	} catch (error) {
		if (
			error.name == 'SequelizeValidationError' ||
			error.name == 'SequelizeUniqueConstraintError'
		) {
			let explanation = [];
			error.errors.forEach((err) => {
				explanation.push(err.message);
			});
			throw new AppError(explanation, StatusCodes.BAD_REQUEST);
		}
		throw new AppError(
			'Cannot create a new user object',
			StatusCodes.INTERNAL_SERVER_ERROR
		);
	}
}
async function signin(data) {
	try {
		const user = await userRepository.getUserByEmail(data.email);
		if (!user) {
			throw new AppError(
				'No user found for the the given email',
				StatusCodes.NOT_FOUND
			);
		}
		const passwordMatch = Auth.checkPassword(data.password, user.password);
		if (!passwordMatch) {
			throw new AppError('Invalid Password', StatusCodes.BAD_REQUEST);
		} else {
			const jwt = Auth.createToken({ id: user.id, email: user.email });
			return jwt;
		}
	} catch (error) {
		if (error instanceof AppError) throw error;
		throw new AppError(
			'something went wrong',
			StatusCodes.INTERNAL_SERVER_ERROR
		);
	}
}
async function isAuthenticated(token) {
	try {
		if (!token) {
			throw new AppError('JWT Token Missing', StatusCodes.BAD_REQUEST);
		}
		const response = Auth.verifyToken(token);
		const user = await userRepository.get(response.id);
		if (!user) {
			throw new AppError('No User Found', StatusCodes.NOT_FOUND);
		}
		return user.id;
	} catch (error) {
		if (error instanceof AppError) throw error;
		if (error.name == 'JsonWebTokenError') {
			throw new AppError('Invalid JWT Token', StatusCodes.BAD_REQUEST);
		}
		if (error.name == 'TokenExpiredError') {
			throw new AppError('JWT Token Expired', StatusCodes.BAD_REQUEST);
		}
		throw new AppError(
			'Something went wrong',
			StatusCodes.INTERNAL_SERVER_ERROR
		);
	}
}

module.exports = { create, signin, isAuthenticated };