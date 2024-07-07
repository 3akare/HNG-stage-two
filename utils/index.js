const validateRegistration = (firstName, lastName, email, password) => {
  const errors = [];

  if (!firstName) {
    errors.push({
      field: "firstName",
      message: "First name is required",
    });
  }

  if (!lastName) {
    errors.push({
      field: "lastName",
      message: "Last name is required",
    });
  }

  if (!email) {
    errors.push({
      field: "email",
      message: "Email is required",
    });
  }

  if (!password) {
    errors.push({
      field: "password",
      message: "Password is required",
    });
  }

  return errors;
};

const validateLogin = (email, password) => {
  const errors = [];

  if (!email) {
    errors.push({
      field: "email",
      message: "Email is required",
    });
  }

  if (!password) {
    errors.push({
      field: "password",
      message: "Password is required",
    });
  }

  return errors;
};

module.exports = { validateRegistration, validateLogin };
