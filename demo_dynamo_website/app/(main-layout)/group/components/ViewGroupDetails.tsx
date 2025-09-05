"use client";

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
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };



    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold">{group.groupName}</h3>
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
                            {group.createdDate 
                                ? new Date(group.createdDate).toLocaleString()
                                : "N/A"
                            }
                        </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Ngày Cập Nhật</span>
                        </div>
                        <span className="text-sm text-gray-900">
                            {group.updatedDate 
                                ? new Date(group.updatedDate).toLocaleString()
                                : "N/A"
                            }
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
