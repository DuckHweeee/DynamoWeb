"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import { useGroups, useGroupMutations } from "../hooks/useGroup";
import { Group } from "@/lib/type";
import { toast } from "sonner";
import { CreateGroupForm } from "./CreateGroupForm";
import { EditGroupForm } from "./EditGroupForm";
import { ViewGroupDetails } from "./ViewGroupDetails";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { GroupTableSkeleton } from "./GroupTableSkeleton";

export function GroupTable() {
    const { data: groups, loading, error, refetch } = useGroups();
    const { deleteGroup } = useGroupMutations();

    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showViewDialog, setShowViewDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

    // Filter groups based on search term
    const filteredGroups = groups.filter(group =>
        group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.groupType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.groupId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateSuccess = () => {
        refetch();
        setShowCreateDialog(false);
        toast.success("Group created successfully!");
    };

    const handleEditSuccess = () => {
        refetch();
        setShowEditDialog(false);
        setSelectedGroup(null);
        toast.success("Group updated successfully!");
    };

    const handleDeleteConfirm = async () => {
        if (!selectedGroup) return;

        try {
            await deleteGroup(selectedGroup.groupId);
            refetch();
            setShowDeleteDialog(false);
            setSelectedGroup(null);
            toast.success("Group deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete group");
        }
    };

    const handleView = (group: Group) => {
        setSelectedGroup(group);
        setShowViewDialog(true);
    };

    const handleEdit = (group: Group) => {
        setSelectedGroup(group);
        setShowEditDialog(true);
    };

    const handleDelete = (group: Group) => {
        setSelectedGroup(group);
        setShowDeleteDialog(true);
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

    if (loading) {
        return <GroupTableSkeleton />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="m-2 my-1.5 px-4 py-3 bg-white rounded-[10px] shadow">
            {/* Header */}
            <div className="flex items-center justify-between py-4">
                <div className="flex justify-start">
                    <h1 className="text-2xl font-bold">Quản Lý Nhóm</h1>
                </div>
                <div className="flex items-center gap-3 justify-end">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Tìm kiếm theo tên, loại hoặc ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-64 md:w-80"
                        />
                    </div>
                    <Button
                        onClick={() => setShowCreateDialog(true)}
                        className="bg-[#004799] hover:bg-[#003b80] text-white px-6 py-2 rounded-md transition"
                    >
                        <Plus size={60} strokeWidth={5} color="white" />
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow className="text-lg font-bold">
                            <TableHead>
                                <Button className="text-lg font-bold" variant="ghost">
                                    Tên Nhóm
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button className="text-lg font-bold" variant="ghost">
                                    Loại Nhóm
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button className="text-lg font-bold" variant="ghost">
                                    Ngày Tạo
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button className="text-lg font-bold" variant="ghost">
                                    Cập Nhật
                                </Button>
                            </TableHead>
                            <TableHead className="text-right">
                                <div className="text-lg font-bold">Hành Động</div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredGroups.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    {searchTerm ? "Không tìm thấy nhóm nào khớp với tìm kiếm." : "Không có nhóm nào."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredGroups.map((group) => (
                                <TableRow key={group.groupId}>
                                    <TableCell className="pl-5 font-medium text-lg">
                                        <div>
                                            <div className="text-lg">{group.groupName}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="pl-5 font-medium text-lg">
                                        <Badge className={getGroupTypeColor(group.groupType)}>
                                            {group.groupType === "staff" ? "Nhân Viên" : "Máy Móc"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="pl-5 font-medium text-lg">
                                        <div className="text-lg">
                                            {group.createdDate ? new Date(group.createdDate).toLocaleDateString('vi-VN') : "N/A"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="pl-5 font-medium text-lg">
                                        <div className="text-lg">
                                            {group.updatedDate ? new Date(group.updatedDate).toLocaleDateString('vi-VN') : "N/A"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-5">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleView(group)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Xem Chi Tiết
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEdit(group)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Chỉnh Sửa
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(group)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Xóa
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Footer with count */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                    Hiển thị {filteredGroups.length} trên {groups.length} nhóm
                </div>
            </div>

            {/* Dialogs */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tạo Nhóm Mới</DialogTitle>
                    </DialogHeader>
                    <CreateGroupForm
                        onSuccess={handleCreateSuccess}
                        onCancel={() => setShowCreateDialog(false)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chỉnh Sửa Nhóm</DialogTitle>
                    </DialogHeader>
                    {selectedGroup && (
                        <EditGroupForm
                            group={selectedGroup}
                            onSuccess={handleEditSuccess}
                            onCancel={() => {
                                setShowEditDialog(false);
                                setSelectedGroup(null);
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chi Tiết Nhóm</DialogTitle>
                    </DialogHeader>
                    {selectedGroup && (
                        <ViewGroupDetails
                            group={selectedGroup}
                            onClose={() => {
                                setShowViewDialog(false);
                                setSelectedGroup(null);
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <DeleteConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={handleDeleteConfirm}
                groupName={selectedGroup?.groupName || ""}
            />
        </div>
    );
}
