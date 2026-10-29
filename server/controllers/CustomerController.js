const Customer = require('../models/CustomerModel');

// @desc    Get all customers (with search & status filter)
// @route   GET /api/customers
// @access  Private
const getCustomers = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    let query = {};

    // Filter by customer status if provided
    if (status && status !== 'All') {
      query.status = status;
    }

    // Search by name, email, company, or phone
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const customers = await Customer.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single customer by ID
// @route   GET /api/customers/:id
// @access  Private
const getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found.',
      });
    }

    return res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new customer
// @route   POST /api/customers
// @access  Private
const createCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, company, status, source, notes } = req.body;

    const newCustomer = await Customer.create({
      name,
      email,
      phone,
      company,
      status: status || 'Lead',
      source: source || 'Website',
      notes: notes || '',
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Customer added successfully!',
      customer: newCustomer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, company, status, source, notes } = req.body;

    let customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found.',
      });
    }

    customer.name = name || customer.name;
    customer.email = email || customer.email;
    customer.phone = phone || customer.phone;
    customer.company = company || customer.company;
    customer.status = status || customer.status;
    customer.source = source || customer.source;
    customer.notes = notes !== undefined ? notes : customer.notes;

    const updatedCustomer = await customer.save();

    return res.status(200).json({
      success: true,
      message: 'Customer updated successfully!',
      customer: updatedCustomer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Private
const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found.',
      });
    }

    await Customer.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Customer deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
