const router = require('express').Router();
const { dashboard, userList, categoriesList, productsList, carriersList, ordersList } = require('../controllers/admin.controller');

router.get('/dashboard', dashboard);
router.get('/users', userList)
router.get('/categories', categoriesList)
router.get('/products', productsList)
router.get('/carriers', carriersList)
router.get('/orders', ordersList)

module.exports = router;