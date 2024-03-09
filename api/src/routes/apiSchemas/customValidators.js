/**
 * Custom validator to check if new and old passwords are different
 * @param {*} value 
 * @param {*} helpers 
 * @returns 
 */
exports.passwordsMustBeDifferent = (value, helpers) => {
    const oldPassword = helpers.state.ancestors[0].oldPassword
  
    if (value === oldPassword) {
        return helpers.message('New password must be different from the old one');
    }
  
    return value;
};