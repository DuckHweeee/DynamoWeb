import { z } from 'zod';

// Machine KPI validation schema
export const machineKPISchema = z.object({
  machineId: z.number()
    .int("ID máy phải là số nguyên")
    .min(1, "Vui lòng chọn máy"),
  
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
  
  machineMiningTarget: z.number()
    .min(0, "Mục tiêu khai thác máy không được âm"),
  
  oee: z.number()
    .min(0, "OEE không được âm")
    .max(100, "OEE không được vượt quá 100"),
});

// Type definitions
export type MachineKPIFormData = z.infer<typeof machineKPISchema>;

// Validation functions with custom error handling
export const validateMachineKPI = (data: unknown) => {
  const result = machineKPISchema.safeParse(data);
  if (!result.success) {
    // Transform Zod errors to Vietnamese messages
    const transformedIssues = result.error.issues.map(issue => {
      const field = issue.path[0] as string;
      let message = issue.message;
      
      // Replace common Zod error messages with Vietnamese ones
      if (issue.code === 'invalid_type' && 'expected' in issue && issue.expected === 'number') {
        switch (field) {
          case 'machineId':
            message = 'Vui lòng chọn máy';
            break;
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

// Individual field validation functions
export const validateMachineKPIMachineId = (value: number | null): string | null => {
  if (value === null || value === undefined) {
    return "Vui lòng chọn máy";
  }
  try {
    z.number()
      .int("ID máy phải là số nguyên")
      .min(1, "Vui lòng chọn máy")
      .parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Giá trị không hợp lệ';
    }
    return 'Giá trị không hợp lệ';
  }
};

export const validateMachineKPIGroupId = (value: string): string | null => {
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

export const validateMachineKPIYear = (value: number | null): string | null => {
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

export const validateMachineKPIMonth = (value: number | null): string | null => {
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

export const validateMachineKPIMachineMiningTarget = (value: number | null): string | null => {
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

export const validateMachineKPIOEE = (value: number | null): string | null => {
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
