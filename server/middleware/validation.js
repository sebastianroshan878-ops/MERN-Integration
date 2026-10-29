// Regular expression for basic email validation
const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

// Middleware to validate user registration input
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Name is required.');
  }

  if (!email || !emailRegex.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

// Middleware to validate user login input
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !emailRegex.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!password || password.trim() === '') {
    errors.push('Password is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

// Middleware to validate CRM customer input
const validateCustomer = (req, res, next) => {
  const { name, email, phone, company } = req.body;
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Customer name is required.');
  }

  if (!email || !emailRegex.test(email.trim())) {
    errors.push('A valid customer email is required.');
  }

  if (!phone || phone.trim() === '') {
    errors.push('Phone number is required.');
  }

  if (!company || company.trim() === '') {
    errors.push('Company name is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateCustomer,
};
