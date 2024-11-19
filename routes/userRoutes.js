const express = require('express');
const authController = require('../controllers/authcontroller');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/refresh', authController.refresh);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

 router.use(authController.protect);
  router.post('/logout', authController.logout);
  router.patch('/updateMyPassword', authController.updatePassword); 
  router.get('/me',userController.getMe,userController.getUser); 
  router.patch('/updateMe', userController.updateMe);
  router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/')
   .get(userController.getAllUsers)

router
   .route('/:id')
   .all(authController.valideId)
   .get(userController.getUser)
   .patch(userController.updateUser)
   .delete(userController.deleteUser);

module.exports = router;
