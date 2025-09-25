import { z } from 'zod';

// Staff validation schema
export const staffSchema = z.object({
  staffId: z.number()
    .int("Mã nhân viên phải là số nguyên")
    .min(1, "Mã nhân viên phải lớn hơn 0")
    .max(9999, "Mã nhân viên không được vượt quá 4 chữ số"),
  
  staffName: z.string()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(100, "Họ và tên không được vượt quá 100 ký tự")
    .trim()
    .refine(val => val.length > 0, "Họ và tên không được để trống"),
  
  shortName: z.string()
    .min(1, "Tên tắt không được để trống")
    .max(50, "Tên tắt không được vượt quá 50 ký tự")
    .trim()
    .refine(val => val.length > 0, "Tên tắt không được để trống"),
  
  staffOffice: z.string()
    .min(1, "Vui lòng chọn phòng ban")
    .refine(val => val.length > 0, "Vui lòng chọn phòng ban"),
  
  staffSection: z.string()
    .min(1, "Công việc không được để trống")
    .max(100, "Công việc không được vượt quá 100 ký tự")
    .trim()
    .refine(val => val.length > 0, "Công việc không được để trống"),
  
  groupId: z.string()
    .min(1, "Vui lòng chọn nhóm")
    .refine(val => val.length > 0, "Vui lòng chọn nhóm"),
});

// KPI validation schema
export const kpiSchema = z.object({
  kpi: z.number()
    .min(0, "KPI không được âm")
    .max(100, "KPI không được vượt quá 100"),
  
  year: z.number()
    .int("Năm phải là số nguyên")
    .min(2020, "Năm phải từ 2020 trở lên")
    .max(2030, "Năm không được vượt quá 2030"),
  
  month: z.number()
    .int("Tháng phải là số nguyên")
    .min(1, "Tháng phải từ 1-12")
    .max(12, "Tháng phải từ 1-12"),
  
  workGoal: z.number()
    .min(0, "Mục tiêu làm việc không được âm"),
  
  pgTimeGoal: z.number()
    .min(0, "Mục tiêu giờ PG không được âm"),
  
  machineTimeGoal: z.number()
    .min(0, "Mục tiêu giờ máy không được âm"),
  
  manufacturingPoint: z.number()
    .min(0, "Mục tiêu điểm gia công không được âm"),
  
  oleGoal: z.number()
    .min(0, "Mục tiêu OLE không được âm"),
});

// Combined schema for new staff
export const newStaffSchema = staffSchema.merge(kpiSchema);

// Schema for editing staff (includes status)
export const editStaffSchema = newStaffSchema.extend({
  status: z.number()
    .int("Trạng thái phải là số nguyên")
    .min(0, "Trạng thái không hợp lệ")
    .max(1, "Trạng thái không hợp lệ"),
});

// Type definitions
export type StaffFormData = z.infer<typeof staffSchema>;
export type KPIFormData = z.infer<typeof kpiSchema>;
export type NewStaffFormData = z.infer<typeof newStaffSchema>;
export type EditStaffFormData = z.infer<typeof editStaffSchema>;

// Validation functions with custom error handling
export const validateStaff = (data: unknown) => {
  return staffSchema.safeParse(data);
};

export const validateKPI = (data: unknown) => {
  return kpiSchema.safeParse(data);
};

export const validateNewStaff = (data: unknown) => {
  const result = newStaffSchema.safeParse(data);
  if (!result.success) {
    // Transform Zod errors to Vietnamese messages
    const transformedIssues = result.error.issues.map(issue => {
      const field = issue.path[0] as string;
      let message = issue.message;
      
      // Replace common Zod error messages with Vietnamese ones
      if (issue.code === 'invalid_type' && 'expected' in issue && issue.expected === 'number') {
        switch (field) {
          case 'staffId':
            message = 'Mã nhân viên không được để trống';
            break;
          case 'kpi':
            message = 'KPI không được để trống';
            break;
          case 'year':
            message = 'Năm không được để trống';
            break;
          case 'month':
            message = 'Tháng không được để trống';
            break;
          case 'workGoal':
            message = 'Mục tiêu làm việc không được để trống';
            break;
          case 'pgTimeGoal':
            message = 'Mục tiêu giờ PG không được để trống';
            break;
          case 'machineTimeGoal':
            message = 'Mục tiêu giờ máy không được để trống';
            break;
          case 'manufacturingPoint':
            message = 'Mục tiêu điểm gia công không được để trống';
            break;
          case 'oleGoal':
            message = 'Mục tiêu OLE không được để trống';
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

export const validateEditStaff = (data: unknown) => {
  const result = editStaffSchema.safeParse(data);
  if (!result.success) {
    // Transform Zod errors to Vietnamese messages
    const transformedIssues = result.error.issues.map(issue => {
      const field = issue.path[0] as string;
      let message = issue.message;
      
      // Replace common Zod error messages with Vietnamese ones
      if (issue.code === 'invalid_type' && 'expected' in issue && issue.expected === 'number') {
        switch (field) {
          case 'staffId':
            message = 'Mã nhân viên không được để trống';
            break;
          case 'kpi':
            message = 'KPI không được để trống';
            break;
          case 'year':
            message = 'Năm không được để trống';
            break;
          case 'month':
            message = 'Tháng không được để trống';
            break;
          case 'workGoal':
            message = 'Mục tiêu làm việc không được để trống';
            break;
          case 'pgTimeGoal':
            message = 'Mục tiêu giờ PG không được để trống';
            break;
          case 'machineTimeGoal':
            message = 'Mục tiêu giờ máy không được để trống';
            break;
          case 'manufacturingPoint':
            message = 'Mục tiêu điểm gia công không được để trống';
            break;
          case 'oleGoal':
            message = 'Mục tiêu OLE không được để trống';
            break;
          case 'status':
            message = 'Trạng thái không được để trống';
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
export const validateStaffId = (value: number | null): string | null => {
  if (value === null || value === undefined) {
    return "Mã nhân viên không được để trống";
  }
  try {
    z.number()
      .int("Mã nhân viên phải là số nguyên")
      .min(1, "Mã nhân viên phải lớn hơn 0")
      .max(9999, "Mã nhân viên không được vượt quá 4 chữ số")
      .parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Giá trị không hợp lệ';
    }
    return 'Giá trị không hợp lệ';
  }
};

export const validateStaffName = (value: string): string | null => {
  if (!value || value.trim().length === 0) {
    return "Họ và tên không được để trống";
  }
  try {
    z.string()
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(100, "Họ và tên không được vượt quá 100 ký tự")
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

export const validateShortName = (value: string): string | null => {
  if (!value || value.trim().length === 0) {
    return "Tên tắt không được để trống";
  }
  try {
    z.string()
      .min(1, "Tên tắt không được để trống")
      .max(50, "Tên tắt không được vượt quá 50 ký tự")
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

export const validateStaffOffice = (value: string): string | null => {
  if (!value || value.trim().length === 0) {
    return "Vui lòng chọn phòng ban";
  }
  try {
    z.string()
      .min(1, "Vui lòng chọn phòng ban")
      .parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Giá trị không hợp lệ';
    }
    return 'Giá trị không hợp lệ';
  }
};

export const validateStaffSection = (value: string): string | null => {
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

export const validateGroupId = (value: string): string | null => {
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

export const validateKPIField = (value: number | null): string | null => {
  if (value === null || value === undefined) {
    return "KPI không được để trống";
  }
  try {
    z.number()
      .min(0, "KPI không được âm")
      .max(100, "KPI không được vượt quá 100")
      .parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Giá trị không hợp lệ';
    }
    return 'Giá trị không hợp lệ';
  }
};

export const validateYear = (value: number | null): string | null => {
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

export const validateMonth = (value: number | null): string | null => {
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

export const validateWorkGoal = (value: number | null): string | null => {
  if (value === null || value === undefined) {
    return "Mục tiêu làm việc không được để trống";
  }
  try {
    z.number()
      .min(0, "Mục tiêu làm việc không được âm")
      .parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Giá trị không hợp lệ';
    }
    return 'Giá trị không hợp lệ';
  }
};

export const validatePgTimeGoal = (value: number | null): string | null => {
  if (value === null || value === undefined) {
    return "Mục tiêu giờ PG không được để trống";
  }
  try {
    z.number()
      .min(0, "Mục tiêu giờ PG không được âm")
      .parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Giá trị không hợp lệ';
    }
    return 'Giá trị không hợp lệ';
  }
};

export const validateMachineTimeGoal = (value: number | null): string | null => {
  if (value === null || value === undefined) {
    return "Mục tiêu giờ máy không được để trống";
  }
  try {
    z.number()
      .min(0, "Mục tiêu giờ máy không được âm")
      .parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Giá trị không hợp lệ';
    }
    return 'Giá trị không hợp lệ';
  }
};

export const validateManufacturingPoint = (value: number | null): string | null => {
  if (value === null || value === undefined) {
    return "Mục tiêu điểm gia công không được để trống";
  }
  try {
    z.number()
      .min(0, "Mục tiêu điểm gia công không được âm")
      .parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Giá trị không hợp lệ';
    }
    return 'Giá trị không hợp lệ';
  }
};

export const validateOleGoal = (value: number | null): string | null => {
  if (value === null || value === undefined) {
    return "Mục tiêu OLE không được để trống";
  }
  try {
    z.number()
      .min(0, "Mục tiêu OLE không được âm")
      .parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Giá trị không hợp lệ';
    }
    return 'Giá trị không hợp lệ';
  }
};

export const validateStatus = (value: number | null): string | null => {
  if (value === null || value === undefined) {
    return "Trạng thái không được để trống";
  }
  try {
    z.number()
      .int("Trạng thái phải là số nguyên")
      .min(0, "Trạng thái không hợp lệ")
      .max(1, "Trạng thái không hợp lệ")
      .parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Giá trị không hợp lệ';
    }
    return 'Giá trị không hợp lệ';
  }
};