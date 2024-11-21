const express = require('express');
const authController = require('../controllers/authcontroller');
const itemController = require('../controllers/itemController');
const validateObj = require('../utils/validation');
const {itemValidationCreate , itemValidationUpdate} = require("../utils/validation")

const router = express.Router( { mergeParams: true });

router.get('/', itemController.getAllItems);
router.get('/:id', validateObj.validateParam(['id']),authController.amIloggedIn, itemController.getItem);

router.use(authController.protect);

router.route('/:id')
    .all(validateObj.validateParam(['id'])) 
    .patch(itemValidationUpdate, itemController.updateItem)
    .delete(itemController.deleteItem);

router.route('/')
    .delete(authController.restrictTo('admin'), itemController.deleteAllItems)
    .post(itemValidationCreate, itemController.createItem);
  
module.exports = router;