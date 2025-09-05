"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Group } from "@/lib/type";
import { CalendarDays, Users, Settings, Copy } from "lucide-react";
import { toast } from "sonner";

interface ViewGroupDetailsProps {
    group: Group;
    onClose: () => void;
}

export function ViewGroupDetails({ group, onClose }: ViewGroupDetailsProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const getGroupTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case "staff":
                return "bg-blue-100 text-blue-800";
            case "machine":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatDateTime = (dateString: string | null | undefined) => {
        if (!dateString || !isMounted) return "N/A";
        try {
            return new Date(dateString).toLocaleString('vi-VN');
        } catch {
            return "N/A";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold">{group.groupName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge className={getGroupTypeColor(group.groupType)}>
                            {group.groupType}
                        </Badge>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Basic Information */}
            <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Thông tin chi tiết</h4>
                
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Loại Nhóm</span>
                        </div>
                        <Badge className={getGroupTypeColor(group.groupType)}>
                            {group.groupType}
                        </Badge>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Timestamps */}
            <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Thời gian</h4>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Ngày Tạo</span>
                        </div>
                        <span className="text-sm text-gray-900">
                            {formatDateTime(group.createdDate)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Ngày Cập Nhật</span>
                        </div>
                        <span className="text-sm text-gray-900">
                            {formatDateTime(group.updatedDate)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-4">
                <Button onClick={onClose}>
                    Close
                </Button>
            </div>
        </div>
    );
}
