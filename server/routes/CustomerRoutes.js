const express = require('express');
const router = express.Router();
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/CustomerController');
const { protect } = require('../middleware/Auth');
const { validateCustomer } = require('../middleware/validation');

// All CRM Customer routes are protected
router.use(protect);

// @route   GET /api/customers - Fetch all customer data
// @route   POST /api/customers - Add customer data
router.route('/')
  .get(getCustomers)
  .post(validateCustomer, createCustomer);

// @route   GET /api/customers/:id - Fetch single customer data
// @route   PUT /api/customers/:id - Update customer data
// @route   DELETE /api/customers/:id - Delete customer data
router.route('/:id')
  .get(getCustomerById)
  .put(validateCustomer, updateCustomer)
  .delete(deleteCustomer);

module.exports = router;
