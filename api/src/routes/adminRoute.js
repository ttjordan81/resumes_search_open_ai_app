const adminController = require('../controllers/admin');
const { validateData } = require('../middleware/data-validator');
const isAdminRole = require('../middleware/is-admin-role');
const { userCreateSchema, userUpdateSchema, userDeleteSchema } = require('./apiSchemas/userSchema');
const express = require('express');

const router = express.Router();

router.post('/create', isAdminRole, validateData(userCreateSchema), adminController.createUser);

router.post('/update', isAdminRole, validateData(userUpdateSchema), adminController.updateUser);

router.delete('/delete', isAdminRole, validateData(userDeleteSchema), adminController.deleteUser);

module.exports = router;