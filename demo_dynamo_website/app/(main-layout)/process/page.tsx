"use client";

import PlannedProcessTable from "./plannedProcess/page";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { ClipboardList, PencilLine } from "lucide-react";

export default function Home() {
  const pathname = usePathname();
  const isPlannedProcess = pathname === "/process";
  const isUnPlannedProcess = pathname === "/process/unplannedProcess";
  return (
    <>
      <div className="flex items-center justify-center p-3">
        <div className="flex gap-x-3">
          {/* <Link href={"/process"}>
            <Button
              className={`cursor-pointer hover:bg-blue-200 text-xl font-semibold !py-6 px-4 rounded-sm border-1 bg-white text-blue-950
                                    ${
                                      isPlannedProcess
                                        ? "border-2 border-blue-950"
                                        : ""
                                    }`}
            >
              <ClipboardList className={`!w-[20px] !h-[20px] text-blue-950`} />
              Kế hoạch chi tiết
            </Button>
          </Link>
          <Link href={"/process/unplannedProcess"}>
            <Button
              className={`cursor-pointer hover:bg-blue-200 text-xl font-semibold !py-6 px-4 rounded-sm border-1 bg-white text-blue-950
                                    ${
                                      isUnPlannedProcess
                                        ? "border-2 border-blue-950"
                                        : ""
                                    }`}
            >
              <PencilLine className={`!w-[20px] !h-[20px] text-blue-950`} /> Gia
              công chi tiết
            </Button>
          </Link> */}
        </div>
      </div>
      <PlannedProcessTable />
    </>
  );
}
