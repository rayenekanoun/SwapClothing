const express = require('express');
const authController = require('../controllers/authcontroller');
const itemController = require('../controllers/itemController');

const router = express.Router();

router.use(authController.protect);

router.post('/createItem', itemController.createItem); //done





router.use(authController.restrictTo('admin'));
router.route('/')
    .get(itemController.getAllItems)
    .delete(itemController.deleteAllItem);
router.route('/:id')
    .get(itemController.getItem)
    .patch(itemController.updateItem)
    .delete(itemController.deleteItem);

module.exports = router;
