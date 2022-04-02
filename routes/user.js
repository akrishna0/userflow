const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middlewares/user');
const {
    signup,
    login,
    logout,
    forgotPassword, 
    resetPassword,
    getLoggedInUserDetails,
    changePassword
    } = require('../controllers/user');
const { route } = require('express/lib/application');

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgotpassword').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);

router.route('/userdashboard').get(isLoggedIn, getLoggedInUserDetails);
router.route('/password/update').post(isLoggedIn, changePassword);

module.exports = router;