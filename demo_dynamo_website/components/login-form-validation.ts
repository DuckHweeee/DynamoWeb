import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  password: z
    .string()
    .min(1, "Mật khẩu không được để trống")
    .min(3, "Mật khẩu phải có ít nhất 3 ký tự"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const validateLoginField = {
  email: (value: string) => {
    if (!value) return "Email không được để trống";
    // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    //   return "Email không hợp lệ";
    // }
    return "";
  },
  
  password: (value: string) => {
    if (!value) return "Mật khẩu không được để trống";
    if (value.length < 3) return "Mật khẩu phải có ít nhất 3 ký tự";
    return "";
  },
};