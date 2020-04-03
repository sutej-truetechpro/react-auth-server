"use strict";

const Validator = require('./validator');

module.exports = class RegisterValidator extends Validator {
  /**
   * Rules
   */
  rules = {
    firstName: 'required|string',
    lastName: 'required|string',
    email: 'required|email',
    password: 'required',
    phone: 'required',
    userType: 'integer'
  };
}
