"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { 
    validateUsername, 
    validateEmail, 
    validateFullname, 
    validatePassword, 
    validateRoles,
    registerSchema 
} from "./validation"

const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL

interface RegisterFormProps {
    onSuccess: () => void
    onCancel: () => void
}

interface RegisterData {
    username: string
    email: string
    fullname: string
    password: string
    roles: string[]
}

const availableRoles = [
    { id: "ROLE_ADMIN", name: "Quản lý" },
    { id: "ROLE_USER", name: "Người vận hành" },
]

export default function RegisterForm({ onSuccess, onCancel }: RegisterFormProps) {
    const [formData, setFormData] = useState<RegisterData>({
        username: "",
        email: "",
        fullname: "",
        password: "",
        roles: []
    })
    
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        const usernameError = validateUsername(formData.username)
        if (usernameError) newErrors.username = usernameError

        const emailError = validateEmail(formData.email)
        if (emailError) newErrors.email = emailError

        const fullnameError = validateFullname(formData.fullname)
        if (fullnameError) newErrors.fullname = fullnameError

        const passwordError = validatePassword(formData.password)
        if (passwordError) newErrors.password = passwordError

        const rolesError = validateRoles(formData.roles)
        if (rolesError) newErrors.roles = rolesError

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (field: keyof RegisterData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        
        // Real-time validation
        let fieldError = ""
        switch (field) {
            case 'username':
                fieldError = validateUsername(value) || ""
                break
            case 'email':
                fieldError = validateEmail(value) || ""
                break
            case 'fullname':
                fieldError = validateFullname(value) || ""
                break
            case 'password':
                fieldError = validatePassword(value) || ""
                break
        }
        
        setErrors(prev => ({
            ...prev,
            [field]: fieldError
        }))
    }

    const handleRoleChange = (roleId: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            roles: checked 
                ? [...prev.roles, roleId]
                : prev.roles.filter(role => role !== roleId)
        }))
        // Clear role error
        if (errors.roles) {
            setErrors(prev => ({ ...prev, roles: "" }))
        }
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error("Vui lòng kiểm tra và sửa các lỗi trong biểu mẫu")
            return
        }

        // Final schema validation
        try {
            registerSchema.parse(formData)
        } catch (error) {
            toast.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.")
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch(`${urlLink}/api/admin/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            toast.success("Đăng ký người dùng thành công!")
            onSuccess()
        } catch (error) {
            console.error('Error registering user:', error)
            toast.error(error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đăng ký')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="grid gap-6 w-full max-w-md mx-auto">
            {/* Username */}
            <div className="grid gap-2">
                <Label htmlFor="username" className="text-lg font-medium">
                    Tên đăng nhập <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="username"
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className={`text-lg ${errors.username ? 'border-red-500' : ''}`}
                />
                {errors.username && (
                    <span className="text-red-500 text-sm">{errors.username}</span>
                )}
            </div>

            {/* Email */}
            <div className="grid gap-2">
                <Label htmlFor="email" className="text-lg font-medium">
                    Email <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Nhập địa chỉ email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`text-lg ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                    <span className="text-red-500 text-sm">{errors.email}</span>
                )}
            </div>

            {/* Full Name */}
            <div className="grid gap-2">
                <Label htmlFor="fullname" className="text-lg font-medium">
                    Họ và tên <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="fullname"
                    type="text"
                    placeholder="Nhập họ và tên"
                    value={formData.fullname}
                    onChange={(e) => handleInputChange('fullname', e.target.value)}
                    className={`text-lg ${errors.fullname ? 'border-red-500' : ''}`}
                />
                {errors.fullname && (
                    <span className="text-red-500 text-sm">{errors.fullname}</span>
                )}
            </div>

            {/* Password */}
            <div className="grid gap-2">
                <Label htmlFor="password" className="text-lg font-medium">
                    Mật khẩu <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`text-lg pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                        )}
                    </Button>
                </div>
                {errors.password && (
                    <span className="text-red-500 text-sm">{errors.password}</span>
                )}
            </div>

            {/* Roles */}
            <div className="grid gap-2">
                <Label className="text-lg font-medium">
                    Vai trò <span className="text-red-500">*</span>
                </Label>
                <div className="grid gap-3">
                    {availableRoles.map((role) => (
                        <div key={role.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={role.id}
                                checked={formData.roles.includes(role.id)}
                                onCheckedChange={(checked) => handleRoleChange(role.id, checked as boolean)}
                            />
                            <Label htmlFor={role.id} className="text-sm font-normal cursor-pointer">
                                {role.name}
                            </Label>
                        </div>
                    ))}
                </div>
                {errors.roles && (
                    <span className="text-red-500 text-sm">{errors.roles}</span>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-4">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="text-lg py-6 px-8"
                >
                    Hủy
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="text-lg bg-[#074695] hover:bg-[#0754B4] py-6 px-8"
                >
                    {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
                </Button>
            </div>
        </div>
    )
}