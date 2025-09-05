"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGroupMutations } from "../hooks/useGroup";
import { Group, UpdateGroupData } from "@/lib/type";
import { toast } from "sonner";

interface EditGroupFormProps {
    group: Group;
    onSuccess: () => void;
    onCancel: () => void;
}

export function EditGroupForm({ group, onSuccess, onCancel }: EditGroupFormProps) {
    const { updateGroup, loading } = useGroupMutations();
    const [formData, setFormData] = useState<UpdateGroupData>({
        groupName: "",
        groupType: "",
    });
    const [errors, setErrors] = useState<Partial<UpdateGroupData>>({});

    useEffect(() => {
        if (group) {
            setFormData({
                groupName: group.groupName,
                groupType: group.groupType,
            });
        }
    }, [group]);

    const validate = () => {
        const newErrors: Partial<UpdateGroupData> = {};

        if (!formData.groupName.trim()) {
            newErrors.groupName = "Group name is required";
        }

        if (!formData.groupType) {
            newErrors.groupType = "Group type is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            await updateGroup(group.groupId, formData);
            onSuccess();
        } catch (error) {
            toast.error("Failed to update group");
        }
    };

    const handleInputChange = (field: keyof UpdateGroupData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="groupName">Tên Nhóm *</Label>
                <Input
                    id="groupName"
                    value={formData.groupName}
                    onChange={(e) => handleInputChange("groupName", e.target.value)}
                    placeholder="Nhập tên nhóm"
                    className={errors.groupName ? "border-red-500" : ""}
                />
                {errors.groupName && (
                    <p className="text-sm text-red-600">{errors.groupName}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="groupType">Loại Nhóm *</Label>
                <Select
                    value={formData.groupType}
                    onValueChange={(value) => handleInputChange("groupType", value)}
                >
                    <SelectTrigger className={errors.groupType ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select group type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="staff">Nhân viên</SelectItem>
                        <SelectItem value="machine">Máy móc</SelectItem>
                    </SelectContent>
                </Select>
                {errors.groupType && (
                    <p className="text-sm text-red-600">{errors.groupType}</p>
                )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Hủy
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Đang cập nhật..." : "Cập nhật nhóm"}
                </Button>
            </div>
        </form>
    );
}
