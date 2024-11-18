const express = require('express');
const authController = require('../controllers/authController');
const itemController = require('../controllers/itemController');

const router = express.Router();


router.get('/', itemController.getAllItems);
router.get('/:id', authController.valideId, itemController.getItem);

router.use(authController.protect);

router.route('/:id')
    .all(authController.valideId) 
    .patch(itemController.updateItem)
    .delete(itemController.deleteItem);

router.route('/')
    .delete(authController.restrictTo('admin'), itemController.deleteAllItems)
    .post(itemController.createItem);
  
module.exports = router;