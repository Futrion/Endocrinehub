
/**
 * Validates whether a form has errors.
 * 
 * Purpose: Determines if a form is invalid by checking if the error object contains any items.
 * 
 * How it works:
 * - Takes an error object as input
 * - Checks if the object has any items by examining Object.keys(err).length
 * - Returns true if the object has one or more items (form is invalid)
 * - Returns false if the object is empty (form is valid)
 * 
 * @param {Object} err - An error object containing form validation errors
 * @returns {boolean} - true if form has errors (invalid), false if no errors (valid)
 */
export const isFormInvalid = err => {
    if (Object.keys(err).length > 0) { 
        return true; 
    }
    return false;
}