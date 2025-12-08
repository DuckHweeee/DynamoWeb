"use client";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/ui/shadcn-io/kanban";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProcessData, StaffDto } from "@/lib/type";



// Define columns based on processStatus
const processColumns = [
  { id: "status-1", name: "Chờ Xử Lý", color: "#f6ee0aff", status: 1 }, // Waiting
  { id: "status-2", name: "Đang Thực Hiện", color: "#0119f0ff", status: 2 }, // In Progress
  { id: "status-3", name: "Hoàn Thành", color: "#10B981", status: 3 }, // Completed
];

// Helper function to get column ID based on process status
const getColumnByStatus = (status: number) => {
  const column = processColumns.find((col) => col.status === status);
  return column ? column.id : "status-1"; // Default to waiting if status not found
};

// Helper function to get staff names
const getStaffNames = (staffDtos: StaffDto[] | null): string => {
  if (!staffDtos || staffDtos.length === 0) return "Chưa phân công";
  return staffDtos.map((staff) => staff.staffName || "N/A").join(", ");
};
const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("vi-VN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

// Fetch process data from API
const fetchProcessData = async (): Promise<ProcessData[]> => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/api/drawing-code-process/all"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [data]; // Handle both array and single object responses
  } catch (error) {
    console.error("Error fetching process data:", error);
    return []; // Return empty array on error
  }
};

const KanbanPage = () => {
  const [columns] = useState(processColumns);
  const [processData, setProcessData] = useState<ProcessData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProcessData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchProcessData();
        setProcessData(data);
      } catch (err) {
        setError("Không thể tải dữ liệu quy trình. Vui lòng thử lại.");
        console.error("Error loading process data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProcessData();
  }, []);

  // Transform process data for kanban
  const transformedData = processData.map((process) => ({
    id: process.processId,
    name: `${process.orderDetailDto?.orderCode || "N/A"} - Bước ${process.stepNumber
      }`,
    column: getColumnByStatus(process.processStatus),
    processData: process,
  }));

  const handleDataChange = (newData: any[]) => {
  };

  if (isLoading) {
    return (
      <div className="m-2 my-1.5 px-4 py-3 bg-white rounded-[10px] shadow">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">
            Đang tải dữ liệu quy trình...
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="m-2 my-1.5 px-4 py-3 bg-white rounded-[10px] shadow">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">{error}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="m-2 my-1.5 p-4 bg-white rounded-[10px] shadow">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Bảng Kanban Quy Trình
        </h1>
        <p className="text-muted-foreground">
          Quản lý và theo dõi tiến độ các quy trình sản xuất
        </p>
      </div>
      <div className="w-full h-[calc(100vh-200px)] overflow-x-auto">
        <div className="flex gap-6 min-w-max h-full">
        <KanbanProvider
          columns={columns}
          data={transformedData}
          onDataChange={handleDataChange}
        >
          {(column: any) => (
            <div key={column.id} className="min-w-[350px] flex flex-col h-[calc(100vh-250px)]">
              <KanbanBoard id={column.id}>
                <KanbanHeader>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg border-b">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: column.color as string }}
                      />
                      <span className="font-medium text-foreground">
                        {column.name}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground bg-white px-2 py-1 rounded-md border">
                      {
                        transformedData.filter(
                          (item: any) => item.column === column.id
                        ).length
                      }
                    </div>
                  </div>  
                 </KanbanHeader>
                 <div className="flex-1 overflow-hidden">
                   <KanbanCards id={column.id}>
                  {(item: (typeof transformedData)[number]) => {
                    const process = item.processData;
                    const staffNames = getStaffNames(process.staffDtos);
                    return (
                      <KanbanCard
                        column={item.column}
                        id={item.id}
                        key={item.id}
                        name={item.name}
                      >
                        <div className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                          {/* Header with Order Code and Step */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex flex-col gap-1 flex-1">
                              <h4 className="font-medium text-base text-foreground leading-tight">
                                {process.orderDetailDto?.orderCode || "N/A"}
                              </h4>
                              <span className="text-base text-muted-foreground">
                                TT Nguyên công: {process.stepNumber} - TT Sản phẩm:{" "}
                                {process.partNumber}
                              </span>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-base font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                {process.processType}
                              </span>
                            </div>
                          </div>

                          {/* Machine Info */}
                          <div className="mb-3 p-2 bg-gray-50 rounded-md">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                              <span className="text-base font-medium text-gray-700">
                                Máy:{" "}
                                {process.machineDto?.machineName ||
                                  "Chưa phân máy"}
                              </span>
                            </div>
                            {/* <div className="text-xs text-muted-foreground mt-1">
                              Nhóm: {process.machineDto?.groupName || "N/A"} |
                              Loại: {process.machineDto?.machineType || "N/A"}
                            </div> */}
                          </div>

                          {/* Staff Assignment */}
                          <div className="mb-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5 shrink-0">
                                <AvatarFallback className="text-base bg-primary/10 text-primary border">
                                  {staffNames.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-base text-muted-foreground">
                                {staffNames}
                              </span>
                            </div>
                          </div>

                          {/* Time Information */}
                          <div className="flex items-center justify-between text-base text-muted-foreground border-t border-gray-100 pt-2">
                            <div className="flex flex-col gap-1">
                              <span>
                                Bắt đầu:{" "}
                                {process.startTime
                                  ? dateFormatter.format(
                                    new Date(process.startTime)
                                  )
                                  : "Chưa bắt đầu"}
                              </span>
                              {process.endTime && (
                                <span>
                                  Kết thúc:{" "}
                                  {dateFormatter.format(
                                    new Date(process.endTime)
                                  )}
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-base font-medium">
                                PG Time: {process.pgTime} mins
                              </div>
                            </div>
                          </div>

                          {/* Process Status Indicator */}
                          <div className="mt-3 pt-2 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-base">
                                <div
                                  className={`h-2 w-2 rounded-full ${process.processStatus === 1
                                      ? "bg-gray-500"
                                      : process.processStatus === 2
                                        ? "bg-blue-500"
                                        : "bg-green-500"
                                    }`}
                                ></div>
                                <span className="text-muted-foreground">
                                  {process.processStatus === 1
                                    ? "Chờ xử lý"
                                    : process.processStatus === 2
                                      ? "Đang thực hiện"
                                      : "Hoàn thành"}
                                </span>
                              </div>
                             
                            </div>
                          </div>
                        </div>
                      </KanbanCard>
                    );
                   }}
                   </KanbanCards>
                 </div>
              </KanbanBoard>
            </div>
          )}
        </KanbanProvider>
        </div>
      </div>
    </div>
  );
};
export default KanbanPage;
