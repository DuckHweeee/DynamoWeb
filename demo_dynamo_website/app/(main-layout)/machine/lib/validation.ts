import { z } from 'zod';

// Machine validation schema
export const machineSchema = z.object({
  machineName: z.string()
    .min(2, "Tên máy phải có ít nhất 2 ký tự")
    .max(100, "Tên máy không được vượt quá 100 ký tự")
    .trim()
    .refine(val => val.length > 0, "Tên máy không được để trống"),
  
  machineType: z.string()
    .min(1, "Loại máy không được để trống")
    .max(100, "Loại máy không được vượt quá 100 ký tự")
    .trim()
    .refine(val => val.length > 0, "Loại máy không được để trống"),
  
  machineWork: z.string()
    .min(1, "Công việc không được để trống")
    .max(100, "Công việc không được vượt quá 100 ký tự")
    .trim()
    .refine(val => val.length > 0, "Công việc không được để trống"),
  
  machineOffice: z.string()
    .min(1, "Vui lòng chọn phòng quản lý")
    .refine(val => val.length > 0, "Vui lòng chọn phòng quản lý"),
  
  groupId: z.string()
    .min(1, "Vui lòng chọn nhóm")
    .refine(val => val.length > 0, "Vui lòng chọn nhóm"),
});

// Machine KPI validation schema
export const machineKpiSchema = z.object({
  year: z.number()
    .int("Năm phải là số nguyên")
    .min(2020, "Năm phải từ 2020 trở lên")
    .max(2030, "Năm không được vượt quá 2030"),
  
  month: z.number()
    .int("Tháng phải là số nguyên")
    .min(1, "Tháng phải từ 1-12")
    .max(12, "Tháng phải từ 1-12"),
  
  machineMiningTarget: z.number()
    .min(0, "Mục tiêu khai thác máy không được âm"),
  
  oee: z.number()
    .min(0, "OEE không được âm")
    .max(100, "OEE không được vượt quá 100"),
});

// Combined schema for new machine
export const newMachineSchema = machineSchema.merge(machineKpiSchema);

// Schema for editing machine (same as new machine for now)
export const editMachineSchema = newMachineSchema;

// Type definitions
export type MachineFormData = z.infer<typeof machineSchema>;
export type MachineKPIFormData = z.infer<typeof machineKpiSchema>;
export type NewMachineFormData = z.infer<typeof newMachineSchema>;
export type EditMachineFormData = z.infer<typeof editMachineSchema>;

// Validation functions with custom error handling
export const validateMachine = (data: unknown) => {
  return machineSchema.safeParse(data);
};

export const validateMachineKPI = (data: unknown) => {
  return machineKpiSchema.safeParse(data);
};

export const validateNewMachine = (data: unknown) => {
  const result = newMachineSchema.safeParse(data);
  if (!result.success) {
    // Transform Zod errors to Vietnamese messages
    const transformedIssues = result.error.issues.map(issue => {
      const field = issue.path[0] as string;
      let message = issue.message;
      
      // Replace common Zod error messages with Vietnamese ones
      if (issue.code === 'invalid_type' && 'expected' in issue && issue.expected === 'number') {
        switch (field) {
          case 'year':
            message = 'Năm không được để trống';
            break;
          case 'month':
            message = 'Tháng không được để trống';
            break;
          case 'machineMiningTarget':
            message = 'Mục tiêu khai thác máy không được để trống';
            break;
          case 'oee':
            message = 'OEE không được để trống';
            break;
        }
      }
      
      return { ...issue, message };
    });
    
    return {
      success: false,
      error: { ...result.error, issues: transformedIssues }
    };
  }
  
  return result;
};

export const validateEditMachine = (data: unknown) => {
  const result = editMachineSchema.safeParse(data);
  if (!result.success) {
    // Transform Zod errors to Vietnamese messages
    const transformedIssues = result.error.issues.map(issue => {
      const field = issue.path[0] as string;
      let message = issue.message;
      
      // Replace common Zod error messages with Vietnamese ones
      if (issue.code === 'invalid_type' && 'expected' in issue && issue.expected === 'number') {
        switch (field) {
          case 'year':
            message = 'Năm không được để trống';
            break;
          case 'month':
            message = 'Tháng không được để trống';
            break;
          case 'machineMiningTarget':
            message = 'Mục tiêu khai thác máy không được để trống';
            break;
          case 'oee':
            message = 'OEE không được để trống';
            break;
        }
      }
      
      return { ...issue, message };
    });
    
    return {
      success: false,
      error: { ...result.error, issues: transformedIssues }
    };
  }
  
  return result;
};

// Helper function to format validation errors
export const formatValidationErrors = (errors: z.ZodIssue[]): string => {
  return errors.map(err => {
    const field = err.path.join('.');
    return `${field ? field + ': ' : ''}${err.message}`;
  }).join(', ');
};

// Individual field validation functions
export const validateMachineName = (value: string): string | null => {
  if (!value || value.trim().length === 0) {
    return "Tên máy không được để trống";
  }
  try {
    z.string()
      .min(2, "Tên máy phải có ít nhất 2 ký tự")
      .max(100, "Tên máy không được vượt quá 100 ký tự")
      .trim()
      .parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Giá trị không hợp lệ';
    }
    return 'Giá trị không hợp lệ';
  }
};

export const validateMachineType = (value: string): string | null => {
  if (!value || value.trim().length === 0) {
    return "Loại máy không được để trống";
  }
  try {
    z.string()
      .min(1, "Loại máy không được để trống")
      .max(100, "Loại máy không được vượt quá 100 ký tự")
      .trim()
      .parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Giá trị không hợp lệ';
    }
    return 'Giá trị không hợp lệ';
  }
};

export const validateMachineWork = (value: string): string | null => {
  if (!value || value.trim().length === 0) {
    return "Công việc không được để trống";
  }
  try {
    z.string()
      .min(1, "Công việc không được để trống")
      .max(100, "Công việc không được vượt quá 100 ký tự")
      .trim()
      .parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Giá trị không hợp lệ';
    }
    return 'Giá trị không hợp lệ';
  }
};

export const validateMachineOffice = (value: string): string | null => {
  if (!value || value.trim().length === 0) {
    return "Vui lòng chọn phòng quản lý";
  }
  try {
    z.string()
      .min(1, "Vui lòng chọn phòng quản lý")
      .parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Giá trị không hợp lệ';
    }
    return 'Giá trị không hợp lệ';
  }
};

export const validateMachineGroupId = (value: string): string | null => {
  if (!value || value.trim().length === 0) {
    return "Vui lòng chọn nhóm";
  }
  try {
    z.string()
      .min(1, "Vui lòng chọn nhóm")
      .parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Giá trị không hợp lệ';
    }
    return 'Giá trị không hợp lệ';
  }
};

export const validateMachineYear = (value: number | null): string | null => {
  if (value === null || value === undefined) {
    return "Năm không được để trống";
  }
  try {
    z.number()
      .int("Năm phải là số nguyên")
      .min(2020, "Năm phải từ 2020 trở lên")
      .max(2030, "Năm không được vượt quá 2030")
      .parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Giá trị không hợp lệ';
    }
    return 'Giá trị không hợp lệ';
  }
};

export const validateMachineMonth = (value: number | null): string | null => {
  if (value === null || value === undefined) {
    return "Tháng không được để trống";
  }
  try {
    z.number()
      .int("Tháng phải là số nguyên")
      .min(1, "Tháng phải từ 1-12")
      .max(12, "Tháng phải từ 1-12")
      .parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Giá trị không hợp lệ';
    }
    return 'Giá trị không hợp lệ';
  }
};

export const validateMachineMiningTarget = (value: number | null): string | null => {
  if (value === null || value === undefined) {
    return "Mục tiêu khai thác máy không được để trống";
  }
  try {
    z.number()
      .min(0, "Mục tiêu khai thác máy không được âm")
      .parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Giá trị không hợp lệ';
    }
    return 'Giá trị không hợp lệ';
  }
};

export const validateMachineOEE = (value: number | null): string | null => {
  if (value === null || value === undefined) {
    return "OEE không được để trống";
  }
  try {
    z.number()
      .min(0, "OEE không được âm")
      .max(100, "OEE không được vượt quá 100")
      .parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Giá trị không hợp lệ';
    }
    return 'Giá trị không hợp lệ';
  }
};