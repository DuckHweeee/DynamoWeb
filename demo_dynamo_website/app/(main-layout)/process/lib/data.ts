import { ProcessingObject } from "./type";

const sampleData = {
    keHoach: {
        doiTuongGiaCong: "D? b?",
        maHang: "20250101_9927-V5",
        soNguyenCong: 1,
        thuTuNguyenCong: 1,
        diemNguyenCong: 10,
        gioPG: 180,
        khMay: 4,
        khNguoiVanHanh: "1002",
        khBatDau: "2025-08-19 11:33:00",
        khKetThuc: "2025-08-19 11:33:00",
        ngayTao: "2025-08-19",
        nguoiLapKeHoach: "Phương Anh",
    },
    danhGia: {
        nhanVienThucHien: "-",
        mayThucHien: "C-25",
        thoiDiemBatDau: "2025-08-19 11:33:00",
        thoiDiemKetThuc: "2025-08-19 11:33:00",
        hienTrang: "1",
        thucThi: "Yes",
        nguoiDanhGia: "-",
        ngayDanhGia: "-",
        tienDo: 0,
    },
    tongGio: {
        thoiPhi: "-",
        gioChay: "-",
        gioDung: "-",
        gioChayPG: "-",
        gioChayOffset: "-",
    },
};


export const processingObjectList: ProcessingObject[] = [
    {
        id: "1",
        name: "SP_Chính",
    },
    {
        id: "2",
        name: "NG_Chạy lại",
    },
    {
        id: "3",
        name: "LK-Đồ gá",
    },
    {
        id: "4",
        name: "Điện cực",
    },
    {
        id: "5",
        name: "Dự bị",
    },
]