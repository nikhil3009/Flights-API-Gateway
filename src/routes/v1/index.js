/** @format */

const express = require('express');
const { AuthRequestMiddlewares } = require('../../middlewares');
const { InfoController } = require('../../controllers');
const userRoutes = require('./user-routes');
const router = express.Router();

router.get('/info', AuthRequestMiddlewares.checkAuth, InfoController.info);
router.use('/user', userRoutes);

module.exports = router;
