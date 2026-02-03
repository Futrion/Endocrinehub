

/**
 * Finds input validation errors for a specific field.
 * 
 * This function searches through an errors object and extracts all errors
 * related to a given input field name. It filters error keys that contain
 * the specified name and returns an object with the matching error message.
 * 
 * @param {Object} errors - An object containing error messages keyed by field names
 * @param {string} name - The name of the input field to search for errors
 * @returns {Object} An object containing the error property with the error message,
 *                   or an empty object if no matching errors are found
 */
export function findInputError(errors, name) {
    const filtered = Object.keys(errors)
        .filter(key => key.includes(name))
        .reduce((cur, key) => {
            return Object.assign(cur, { error: errors[key] })
        }, {})
    return filtered;
}