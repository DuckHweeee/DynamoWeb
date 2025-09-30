"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateEditAdminField, EditAdminFormData } from "./editAdminValidation";
import { Admin } from "@/lib/type";
import { toast } from "sonner";

const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;

interface EditAdminFormProps {
  admin: Admin;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditAdminForm({ admin, onSuccess, onCancel }: EditAdminFormProps) {
  const [formData, setFormData] = useState<EditAdminFormData>({
    email: admin.email,
    password: "",
    fullname: admin.fullname,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    fullname: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Real-time validation handlers
  const handleEmailChange = (value: string) => {
    setFormData(prev => ({ ...prev, email: value }));
    setErrors(prev => ({ ...prev, email: validateEditAdminField.email(value) }));
  };

  const handlePasswordChange = (value: string) => {
    setFormData(prev => ({ ...prev, password: value }));
    setErrors(prev => ({ ...prev, password: validateEditAdminField.password(value) }));
  };

  const handleFullnameChange = (value: string) => {
    setFormData(prev => ({ ...prev, fullname: value }));
    setErrors(prev => ({ ...prev, fullname: validateEditAdminField.fullname(value) }));
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      !errors.email &&
      !errors.password &&
      !errors.fullname &&
      formData.email &&
      formData.password &&
      formData.fullname
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submission
    const emailError = validateEditAdminField.email(formData.email);
    const passwordError = validateEditAdminField.password(formData.password);
    const fullnameError = validateEditAdminField.fullname(formData.fullname);

    setErrors({
      email: emailError,
      password: passwordError,
      fullname: fullnameError,
    });

    if (emailError || passwordError || fullnameError) {
      toast.error("Vui lòng kiểm tra lại thông tin nhập vào");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${urlLink}/api/admin/${admin.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullname: formData.fullname,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }

      toast.success(`Cập nhật thông tin ${admin.fullname} thành công!`);
      onSuccess();
    } catch (error) {
      console.error('Error updating admin:', error);
      toast.error(`Lỗi khi cập nhật thông tin: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {/* Email Field */}
      <div className="grid gap-2">
        <Label htmlFor="edit-email" className="text-sm font-medium">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="edit-email"
          type="email"
          placeholder="Nhập email"
          value={formData.email}
          onChange={(e) => handleEmailChange(e.target.value)}
          className={errors.email ? "border-red-500 focus:border-red-500" : ""}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="grid gap-2">
        <Label htmlFor="edit-password" className="text-sm font-medium">
          Mật khẩu <span className="text-red-500">*</span>
        </Label>
        <Input
          id="edit-password"
          type="password"
          placeholder="Nhập mật khẩu mới"
          value={formData.password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          className={errors.password ? "border-red-500 focus:border-red-500" : ""}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {/* Fullname Field */}
      <div className="grid gap-2">
        <Label htmlFor="edit-fullname" className="text-sm font-medium">
          Họ và tên <span className="text-red-500">*</span>
        </Label>
        <Input
          id="edit-fullname"
          type="text"
          placeholder="Nhập họ và tên"
          value={formData.fullname}
          onChange={(e) => handleFullnameChange(e.target.value)}
          className={errors.fullname ? "border-red-500 focus:border-red-500" : ""}
          disabled={isLoading}
        />
        {errors.fullname && (
          <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>
        )}
      </div>

      {/* Username Display (Read-only) */}
      <div className="grid gap-2">
        <Label className="text-sm font-medium text-gray-600">
          Tên đăng nhập
        </Label>
        <Input
          type="text"
          value={admin.username}
          className="bg-gray-50 cursor-not-allowed"
          disabled
          readOnly
        />
        <p className="text-xs text-gray-500">Tên đăng nhập không thể thay đổi</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          disabled={!isFormValid() || isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </form>
  );
}