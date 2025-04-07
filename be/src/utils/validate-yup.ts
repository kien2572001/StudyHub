import * as yup from "yup";

type ValidationResult<T> =
  | { valid: true; data: T }
  | { valid: false; errors: string[] };

export function validateSchema<T>(
  schema: yup.Schema<T>,
  obj: unknown,
): ValidationResult<T> {
  try {
    // Validate synchronously. The option { abortEarly: false } collects all errors.
    const validatedData: T = schema.validateSync(obj, { abortEarly: false });
    return { valid: true, data: validatedData };
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      // Return all error messages collected during validation.
      return { valid: false, errors: err.errors };
    }
    // If it's not a validation error, rethrow it.
    throw err;
  }
}
