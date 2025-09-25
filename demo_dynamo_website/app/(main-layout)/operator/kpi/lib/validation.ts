import { z } from 'zod';

// Staff KPI validation schema
export const staffKPISchema = z.object({
  staffId: z.string()
    .min(1, "Vui lòng chọn nhân viên")
    .refine(val => val.length > 0, "Vui lòng chọn nhân viên"),
  
  groupId: z.string()
    .min(1, "Vui lòng chọn nhóm")
    .refine(val => val.length > 0, "Vui lòng chọn nhóm"),
  
  year: z.number()
    .int("Năm phải là số nguyên")
    .min(2020, "Năm phải từ 2020 trở lên")
    .max(2030, "Năm không được vượt quá 2030"),
  
  month: z.number()
    .int("Tháng phải là số nguyên")
    .min(1, "Tháng phải từ 1-12")
    .max(12, "Tháng phải từ 1-12"),
  
  kpi: z.number()
    .min(0, "KPI không được âm")
    .max(100, "KPI không được vượt quá 100"),
  
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

// Type definitions
export type StaffKPIFormData = z.infer<typeof staffKPISchema>;

// Validation functions with custom error handling
export const validateStaffKPI = (data: unknown) => {
  const result = staffKPISchema.safeParse(data);
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
          case 'kpi':
            message = 'KPI không được để trống';
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

// Individual field validation functions
export const validateStaffKPIStaffId = (value: string): string | null => {
  if (!value || value.trim().length === 0) {
    return "Vui lòng chọn nhân viên";
  }
  try {
    z.string()
      .min(1, "Vui lòng chọn nhân viên")
      .parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Giá trị không hợp lệ';
    }
    return 'Giá trị không hợp lệ';
  }
};

export const validateStaffKPIGroupId = (value: string): string | null => {
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

export const validateStaffKPIYear = (value: number | null): string | null => {
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

export const validateStaffKPIMonth = (value: number | null): string | null => {
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

export const validateStaffKPIKPI = (value: number | null): string | null => {
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

export const validateStaffKPIWorkGoal = (value: number | null): string | null => {
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

export const validateStaffKPIPgTimeGoal = (value: number | null): string | null => {
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

export const validateStaffKPIMachineTimeGoal = (value: number | null): string | null => {
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

export const validateStaffKPIManufacturingPoint = (value: number | null): string | null => {
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

export const validateStaffKPIOleGoal = (value: number | null): string | null => {
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
