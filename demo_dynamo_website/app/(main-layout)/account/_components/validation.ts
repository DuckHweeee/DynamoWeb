import { z } from "zod"

// Registration form schema
export const registerSchema = z.object({
    username: z.string()
        .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
        .max(50, "Tên đăng nhập không được vượt quá 50 ký tự")
        .regex(/^[a-zA-Z0-9_]+$/, "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"),
    email: z.string()
        .email("Email không hợp lệ")
        .max(100, "Email không được vượt quá 100 ký tự"),
    fullname: z.string()
        .min(2, "Họ và tên phải có ít nhất 2 ký tự")
        .max(100, "Họ và tên không được vượt quá 100 ký tự"),
    password: z.string()
        .min(5, "Mật khẩu phải có ít nhất 5 ký tự")
        .max(100, "Mật khẩu không được vượt quá 100 ký tự"),
    roles: z.array(z.string())
        .min(1, "Phải chọn ít nhất một vai trò")
})

// Individual field validators
export const validateUsername = (value: string): string | null => {
    if (!value.trim()) return "Tên đăng nhập là bắt buộc"
    if (value.length < 3) return "Tên đăng nhập phải có ít nhất 3 ký tự"
    if (value.length > 50) return "Tên đăng nhập không được vượt quá 50 ký tự"
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"
    return null
}

export const validateEmail = (value: string): string | null => {
    if (!value.trim()) return "Email là bắt buộc"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email không hợp lệ"
    if (value.length > 100) return "Email không được vượt quá 100 ký tự"
    return null
}

export const validateFullname = (value: string): string | null => {
    if (!value.trim()) return "Họ và tên là bắt buộc"
    if (value.length < 2) return "Họ và tên phải có ít nhất 2 ký tự"
    if (value.length > 100) return "Họ và tên không được vượt quá 100 ký tự"
    return null
}

export const validatePassword = (value: string): string | null => {
    if (!value.trim()) return "Mật khẩu là bắt buộc"
    if (value.length < 5) return "Mật khẩu phải có ít nhất 5 ký tự"
    if (value.length > 100) return "Mật khẩu không được vượt quá 100 ký tự"
    return null
}

export const validateRoles = (value: string[]): string | null => {
    if (!value || value.length === 0) return "Phải chọn ít nhất một vai trò"
    return null
}