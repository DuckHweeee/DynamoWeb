"use client";

import { useState } from "react";
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
import { useGroupMutations } from "../../../../hooks/useGroup";
import { CreateGroupData } from "@/lib/type";
import { toast } from "sonner";

interface CreateGroupFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export function CreateGroupForm({ onSuccess, onCancel }: CreateGroupFormProps) {
    const { createGroup, loading } = useGroupMutations();
    const [formData, setFormData] = useState<CreateGroupData>({
        groupName: "",
        groupType: "",
    });
    const [errors, setErrors] = useState<Partial<CreateGroupData>>({});

    const validate = () => {
        const newErrors: Partial<CreateGroupData> = {};

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
            await createGroup(formData);
            onSuccess();
        } catch (error) {
            toast.error("Failed to create group");
        }
    };

    const handleInputChange = (field: keyof CreateGroupData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="groupName">Group Name *</Label>
                <Input
                    id="groupName"
                    value={formData.groupName}
                    onChange={(e) => handleInputChange("groupName", e.target.value)}
                    placeholder="Enter group name"
                    className={errors.groupName ? "border-red-500" : ""}
                />
                {errors.groupName && (
                    <p className="text-sm text-red-600">{errors.groupName}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="groupType">Group Type *</Label>
                <Select
                    value={formData.groupType}
                    onValueChange={(value) => handleInputChange("groupType", value)}
                >
                    <SelectTrigger className={errors.groupType ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select group type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="machine">Machine</SelectItem>
                    </SelectContent>
                </Select>
                {errors.groupType && (
                    <p className="text-sm text-red-600">{errors.groupType}</p>
                )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Group"}
                </Button>
            </div>
        </form>
    );
}
