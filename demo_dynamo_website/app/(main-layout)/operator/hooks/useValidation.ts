import { useState, useCallback } from 'react';
import { z } from 'zod';

export interface ValidationErrors {
  [key: string]: string | undefined;
}

export interface UseValidationProps<T> {
  schema: z.ZodSchema<T>;
  initialData?: Partial<T>;
}

export function useValidation<T>({ schema, initialData = {} }: UseValidationProps<T>) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [data, setData] = useState<Partial<T>>(initialData);

  const validateField = useCallback((field: keyof T, value: any) => {
    try {
      // Try to parse with full schema and check specific field errors
      const testData = { ...data, [field]: value };
      const result = schema.safeParse(testData);
      
      if (result.success) {
        // Clear error if validation passes
        setErrors(prev => ({
          ...prev,
          [field as string]: undefined
        }));
        return true;
      } else {
        // Find error for this specific field
        const fieldError = result.error.issues.find(issue => 
          issue.path.includes(field as string)
        );
        
        if (fieldError) {
          setErrors(prev => ({
            ...prev,
            [field as string]: fieldError.message
          }));
        }
        return false;
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        [field as string]: 'Giá trị không hợp lệ'
      }));
      return false;
    }
  }, [schema, data]);

  const validateAll = useCallback((dataToValidate: T) => {
    const result = schema.safeParse(dataToValidate);
    
    if (!result.success) {
      const newErrors: ValidationErrors = {};
      result.error.issues.forEach(issue => {
        const field = issue.path.join('.');
        if (!newErrors[field]) {
          newErrors[field] = issue.message;
        }
      });
      setErrors(newErrors);
      return { success: false, errors: newErrors };
    }
    
    setErrors({});
    return { success: true, data: result.data };
  }, [schema]);

  const updateField = useCallback((field: keyof T, value: any) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Validate field in real-time
    validateField(field, value);
  }, [validateField]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const getFieldError = useCallback((field: keyof T) => {
    return errors[field as string];
  }, [errors]);

  const hasErrors = Object.values(errors).some(error => error !== undefined);

  return {
    data,
    errors,
    hasErrors,
    validateField,
    validateAll,
    updateField,
    clearErrors,
    getFieldError,
    setData,
  };
}