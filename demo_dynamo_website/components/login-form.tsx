"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { validateLoginField } from "./login-form-validation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { login, isLoading } = useAuth();

  const handleEmailChange = (value: string) => {
    setEmail(value);
    const error = validateLoginField.email(value);
    setEmailError(error);
    if (error) setError("");
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const error = validateLoginField.password(value);
    setPasswordError(error);
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    const emailValidation = validateLoginField.email(email);
    const passwordValidation = validateLoginField.password(password);
    
    setEmailError(emailValidation);
    setPasswordError(passwordValidation);

    if (emailValidation || passwordValidation) {
      return;
    }

    const success = await login(email, password);
    
    if (!success) {
      setError("Email hoặc mật khẩu không đúng");
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.");
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Đăng nhập tài khoản của bạn</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Nhập thông tin đăng nhập của bạn bên dưới
        </p>
      </div>
      
      <div className="grid gap-6">
        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}
        
        <div className="grid gap-3">
          <Label htmlFor="email">Tên đăng nhập</Label>
          <Input 
            id="email" 
            type="text" 
            placeholder="Nhập tên đăng nhập"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            className={emailError ? "border-red-500" : ""}
            required 
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>
        
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Mật khẩu</Label>
          </div>
          <Input 
            id="password" 
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            className={passwordError ? "border-red-500" : ""}
            required 
          />
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || emailError !== "" || passwordError !== "" || !email || !password}
        >
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </div>
    </form>
  );
}
