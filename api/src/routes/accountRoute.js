const express = require('express');
const router = express.Router();
const { validateData }  = require('../middleware/data-validator');
const { userChangePasswordSchema } = require('./apiSchemas/userSchema');
const accountController = require('../controllers/account');

/** 
 * POST /account/changePassword
 * User change password
 */
router.post('/changePassword', validateData(userChangePasswordSchema), accountController.changePassword);

module.exports = router;