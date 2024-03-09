const express = require('express');
const authController = require('../controllers/auth');
const { validateData } = require('../middleware/data-validator');
const { userLoginSchema, userEmailVerificationSchema, userCreateSchema, 
    userForgotPasswordSchema, userResetPasswordSchema } = require('./apiSchemas/userSchema');
const router = express.Router();

router.post('/login', validateData(userLoginSchema), authController.login);

/** 
 * POST /auth/signup
 * User self-service account signup
 */
router.post('/signup', validateData(userCreateSchema), authController.accountSignUp);

/** 
 *  GET /auth/emailVerification/:emailVerificationToken
 *  This endpoint gets called when user clicks on the link in the new account signup email to verify their email address.
 */
router.get('/verifyEmail/:emailVerificationToken', validateData(userEmailVerificationSchema), authController.verifyEmail);

/**
 * GET /auth/forgotPassword/:email
 */
router.get('/forgotPassword/:email', validateData(userForgotPasswordSchema), authController.forgotPassword);


/**
 * POST /auth/resetPassword
 * Allows user to reset their password
 */
router.post('/resetPassword', validateData(userResetPasswordSchema), authController.resetPassword);

module.exports = router;