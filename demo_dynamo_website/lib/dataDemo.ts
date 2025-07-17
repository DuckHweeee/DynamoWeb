import { DrawingCode, HistoryMachine, HistoryProcess, Machine, Operator, Process } from "./type";

export const mockOperators: Operator[] = [
    {
        stt: "1",
        id: "OP001",
        name: "Phuc",
        phong_ban: "D1",
        nhom: "Sản xuất",
        cong_viec: "Gia Công Tinh"
    },
    {
        stt: "2",
        id: "OA002",
        name: "Phuc Bui",
        phong_ban: "D2",
        nhom: "Quản lý",
        cong_viec: "Gia Công Tinh"
    },
    {
        stt: "3",
        id: "OP003",
        name: "Phuc 26",
        phong_ban: "D1",
        nhom: "Sản xuất",
        cong_viec: "Gia Công Tinh"
    },
    {
        stt: "4",
        id: "OP004",
        name: "Hoang Phuc",
        phong_ban: "D3",
        nhom: "Sản xuất",
        cong_viec: "Gia Công Thô"
    },
    {
        stt: "6",
        id: "OP006",
        name: "Hoang Phuc",
        phong_ban: "D3",
        nhom: "Sản xuất",
        cong_viec: "Gia Công Thô"
    },
    {
        stt: "7",
        id: "OP007",
        name: "Hoang Phuc",
        phong_ban: "D3",
        nhom: "Sản xuất",
        cong_viec: "Gia Công Thô"
    },
    {
        stt: "8",
        id: "OP008",
        name: "Hoang Phuc",
        phong_ban: "D3",
        nhom: "Sản xuất",
        cong_viec: "Gia Công Thô"
    },
    {
        stt: "9",
        id: "OP009",
        name: "Hoang Phuc",
        phong_ban: "D3",
        nhom: "Sản xuất",
        cong_viec: "Gia Công Thô"
    },
    {
        stt: "9",
        id: "OP009",
        name: "Hoang Phuc",
        phong_ban: "D3",
        nhom: "Sản xuất",
        cong_viec: "Gia Công Thô"
    },
    {
        stt: "10",
        id: "OP0010",
        name: "Hoang Phuc",
        phong_ban: "D3",
        nhom: "Sản xuất",
        cong_viec: "Gia Công Thô"
    },
    {
        stt: "11",
        id: "OP0011",
        name: "Hoang Phuc",
        phong_ban: "D3",
        nhom: "Sản xuất",
        cong_viec: "Gia Công Thô"
    },
    {
        stt: "12",
        id: "OP0012",
        name: "Hoang Phuc",
        phong_ban: "D3",
        nhom: "Sản xuất",
        cong_viec: "Gia Công Thô"
    },
    {
        stt: "13",
        id: "OP0013",
        name: "Hoang Phuc",
        phong_ban: "D3",
        nhom: "Sản xuất",
        cong_viec: "Gia Công Thô"
    },
    {
        stt: "14",
        id: "OP0014",
        name: "Hoang Phuc",
        phong_ban: "D3",
        nhom: "Sản xuất",
        cong_viec: "Gia Công Thô"
    },
    {
        stt: "15",
        id: "OP0015",
        name: "Hoang Phuc",
        phong_ban: "D3",
        nhom: "Sản xuất",
        cong_viec: "Gia Công Thô"
    },
    {
        stt: "16",
        id: "OP0016",
        name: "Hoang Phuc",
        phong_ban: "D3",
        nhom: "Sản xuất",
        cong_viec: "Gia Công Thô"
    },
    {
        stt: "5",
        id: "OP005",
        name: "Phuc Hoang",
        phong_ban: "D2",
        nhom: "Sản Quản Lý",
        cong_viec: "Gia Công Thô"
    }
]

export const mockMachines: Machine[] = [
    { id: "1", name: "Máy CNC 01", loai_may: "CNC", ma_may: "CNC-001" },
    { id: "2", name: "Máy Cắt Laser", loai_may: "Laser", ma_may: "LAS-002" },
    { id: "3", name: "Máy Tiện 01", loai_may: "Tiện", ma_may: "TIEN-003" },
    { id: "4", name: "Máy Phay 01", loai_may: "Phay", ma_may: "PHAY-004" },
    { id: "5", name: "Máy Dập Thủy Lực", loai_may: "Dập", ma_may: "DAP-005" },
    { id: "6", name: "Máy Khoan 01", loai_may: "Khoan", ma_may: "KHOAN-006" },
    { id: "7", name: "Máy Cắt Plasma", loai_may: "Plasma", ma_may: "PLAS-007" },
    { id: "8", name: "Máy CNC 02", loai_may: "CNC", ma_may: "CNC-008" },
    { id: "9", name: "Máy Hàn MIG", loai_may: "Hàn", ma_may: "HAN-009" },
    { id: "10", name: "Máy Mài 01", loai_may: "Mài", ma_may: "MAI-010" },
    { id: "11", name: "Máy Phay 02", loai_may: "Phay", ma_may: "PHAY-011" },
    { id: "12", name: "Máy Tiện 02", loai_may: "Tiện", ma_may: "TIEN-012" },
    { id: "13", name: "Máy Đột CNC", loai_may: "Đột", ma_may: "DOT-013" },
    { id: "14", name: "Máy Cắt Gỗ", loai_may: "Cắt", ma_may: "CUT-014" },
    { id: "15", name: "Máy Hàn TIG", loai_may: "Hàn", ma_may: "HAN-015" },
]

export const mockDrawingCodes: DrawingCode[] = [
    {
        id: "DC001",
        ma_ban_ve: "MBV-001",
        dnc: "DNC-001",
        trang_thai: "Chưa hoàn thành",
    },
    {
        id: "DC003",
        ma_ban_ve: "MBV-003",
        dnc: "DNC-003",
        trang_thai: "Chưa hoàn thành",
    },
    {
        id: "DC002",
        ma_ban_ve: "MBV-002",
        dnc: "DNC-002",
        trang_thai: "Hoàn thành",
    },

    {
        id: "DC004",
        ma_ban_ve: "MBV-004",
        dnc: "DNC-004",
        trang_thai: "Hoàn thành",
    },
    {
        id: "DC005",
        ma_ban_ve: "MBV-005",
        dnc: "DNC-005",
        trang_thai: "Chưa hoàn thành",
    },
    {
        id: "DC006",
        ma_ban_ve: "MBV-006",
        dnc: "DNC-006",
        trang_thai: "Hoàn thành",
    },
    {
        id: "DC007",
        ma_ban_ve: "MBV-007",
        dnc: "DNC-007",
        trang_thai: "Chưa hoàn thành",
    },
    {
        id: "DC008",
        ma_ban_ve: "MBV-008",
        dnc: "DNC-008",
        trang_thai: "Hoàn thành",
    },
    {
        id: "DC009",
        ma_ban_ve: "MBV-009",
        dnc: "DNC-009",
        trang_thai: "Chưa hoàn thành",
    },
    {
        id: "DC010",
        ma_ban_ve: "MBV-010",
        dnc: "DNC-010",
        trang_thai: "Hoàn thành",
    },
    {
        id: "DC011",
        ma_ban_ve: "MBV-011",
        dnc: "DNC-011",
        trang_thai: "Chưa hoàn thành",
    },
    {
        id: "DC012",
        ma_ban_ve: "MBV-012",
        dnc: "DNC-012",
        trang_thai: "Hoàn thành",
    },
    {
        id: "DC013",
        ma_ban_ve: "MBV-013",
        dnc: "DNC-013",
        trang_thai: "Hoàn thành",
    },
    {
        id: "DC014",
        ma_ban_ve: "MBV-014",
        dnc: "DNC-014",
        trang_thai: "Chưa hoàn thành",
    },
    {
        id: "DC015",
        ma_ban_ve: "MBV-015",
        dnc: "DNC-015",
        trang_thai: "Hoàn thành",
    },
]

export const mockProcesses: Process[] = [
    { id: "1", ma_ban_ve: "MBV001", dnc: "100", tgdk: "15500", snc: "3", ttnc: "2", trang_thai: "Chưa hoàn thành" },
    { id: "2", ma_ban_ve: "MBV002", dnc: "101", tgdk: "18080", snc: "5", ttnc: "5", trang_thai: "Hoàn thành" },
    { id: "3", ma_ban_ve: "MBV003", dnc: "102", tgdk: "12090", snc: "4", ttnc: "3", trang_thai: "Chưa hoàn thành" },
    { id: "4", ma_ban_ve: "MBV004", dnc: "103", tgdk: "20070", snc: "6", ttnc: "6", trang_thai: "Hoàn thành" },
    { id: "5", ma_ban_ve: "MBV005", dnc: "104", tgdk: "16060", snc: "3", ttnc: "2", trang_thai: "Chưa hoàn thành" },
    { id: "6", ma_ban_ve: "MBV006", dnc: "105", tgdk: "19050", snc: "5", ttnc: "5", trang_thai: "Hoàn thành" },
    { id: "7", ma_ban_ve: "MBV007", dnc: "106", tgdk: "14600", snc: "2", ttnc: "1", trang_thai: "Chưa hoàn thành" },
    { id: "8", ma_ban_ve: "MBV008", dnc: "107", tgdk: "21700", snc: "4", ttnc: "4", trang_thai: "Hoàn thành" },
    { id: "9", ma_ban_ve: "MBV009", dnc: "108", tgdk: "17200", snc: "3", ttnc: "2", trang_thai: "Chưa hoàn thành" },
    { id: "10", ma_ban_ve: "MBV010", dnc: "109", tgdk: "29000", snc: "5", ttnc: "5", trang_thai: "Hoàn thành" },
    { id: "11", ma_ban_ve: "MBV011", dnc: "110", tgdk: "15600", snc: "4", ttnc: "3", trang_thai: "Chưa hoàn thành" },
    { id: "12", ma_ban_ve: "MBV012", dnc: "111", tgdk: "18400", snc: "6", ttnc: "6", trang_thai: "Hoàn thành" },
    { id: "13", ma_ban_ve: "MBV013", dnc: "112", tgdk: "13200", snc: "2", ttnc: "1", trang_thai: "Chưa hoàn thành" },
    { id: "14", ma_ban_ve: "MBV014", dnc: "113", tgdk: "28200", snc: "5", ttnc: "5", trang_thai: "Hoàn thành" },
    { id: "15", ma_ban_ve: "MBV015", dnc: "114", tgdk: "16600", snc: "3", ttnc: "2", trang_thai: "Chưa hoàn thành" },
]

export const mockHistoryProcesses: HistoryProcess[] = [
    {
        ma_ban_ve: "MBV-001",
        tsnc: 20,
        hoan_thanh: 15,
        chua_hoan_thanh: 5,
        tght: 7200, // 2 giờ
    },
    {
        ma_ban_ve: "MBV-002",
        tsnc: 18,
        hoan_thanh: 10,
        chua_hoan_thanh: 8,
        tght: 6300,
    },
    {
        ma_ban_ve: "MBV-003",
        tsnc: 25,
        hoan_thanh: 25,
        chua_hoan_thanh: 0,
        tght: 5400,
    },
    {
        ma_ban_ve: "MBV-004",
        tsnc: 30,
        hoan_thanh: 20,
        chua_hoan_thanh: 10,
        tght: 8800,
    },
    {
        ma_ban_ve: "MBV-005",
        tsnc: 12,
        hoan_thanh: 6,
        chua_hoan_thanh: 6,
        tght: 4500,
    },
    {
        ma_ban_ve: "MBV-006",
        tsnc: 10,
        hoan_thanh: 3,
        chua_hoan_thanh: 7,
        tght: 3600,
    },
    {
        ma_ban_ve: "MBV-007",
        tsnc: 40,
        hoan_thanh: 40,
        chua_hoan_thanh: 0,
        tght: 10800,
    },
    {
        ma_ban_ve: "MBV-008",
        tsnc: 22,
        hoan_thanh: 18,
        chua_hoan_thanh: 4,
        tght: 7200,
    },
    {
        ma_ban_ve: "MBV-009",
        tsnc: 16,
        hoan_thanh: 11,
        chua_hoan_thanh: 5,
        tght: 4000,
    },
    {
        ma_ban_ve: "MBV-010",
        tsnc: 35,
        hoan_thanh: 30,
        chua_hoan_thanh: 5,
        tght: 9400,
    },
    {
        ma_ban_ve: "MBV-011",
        tsnc: 8,
        hoan_thanh: 4,
        chua_hoan_thanh: 4,
        tght: 3200,
    },
    {
        ma_ban_ve: "MBV-012",
        tsnc: 27,
        hoan_thanh: 25,
        chua_hoan_thanh: 2,
        tght: 6900,
    },
    {
        ma_ban_ve: "MBV-013",
        tsnc: 14,
        hoan_thanh: 7,
        chua_hoan_thanh: 7,
        tght: 3100,
    },
    {
        ma_ban_ve: "MBV-014",
        tsnc: 19,
        hoan_thanh: 15,
        chua_hoan_thanh: 4,
        tght: 5800,
    },
    {
        ma_ban_ve: "MBV-015",
        tsnc: 11,
        hoan_thanh: 10,
        chua_hoan_thanh: 1,
        tght: 2600,
    },
]

export const mockHistoryMachines: HistoryMachine[] = [
    { ten_may: "DC 1", id: "123", tgc: 34600, tgd: 62700, tgt: 63300, tgl: 33400 },
    { ten_may: "DC 2", id: "123", tgc: 57400, tgd: 32400, tgt: 89600, tgl: 44400 },
    { ten_may: "DC 3", id: "123", tgc: 25400, tgd: 15900, tgt: 46400, tgl: 22200 },
    { ten_may: "DC 4", id: "123", tgc: 76000, tgd: 34800, tgt: 10800, tgl: 66600 },
    { ten_may: "DC 5", id: "123", tgc: 72200, tgd: 33000, tgt: 10200, tgl: 55500 },
    { ten_may: "DC 6", id: "123", tgc: 38300, tgd: 27600, tgt: 64000, tgl: 33300 },
    { ten_may: "DC 7", id: "123", tgc: 42200, tgd: 8800, tgt: 84000, tgl: 44400 },
    { ten_may: "DC 8", id: "123", tgc: 34000, tgd: 33600, tgt: 66600, tgl: 22250 },
    { ten_may: "Máy I", id: "123", tgc: 27700, tgd: 21300, tgt: 55000, tgl: 18880 },
    { ten_may: "Máy J", id: "123", tgc: 42000, tgd: 24900, tgt: 67900, tgl: 32220 },
    { ten_may: "Máy K", id: "123", tgc: 38800, tgd: 23600, tgt: 69400, tgl: 22210 },
    { ten_may: "Máy L", id: "123", tgc: 44500, tgd: 36100, tgt: 76600, tgl: 28820 },
    { ten_may: "Máy M", id: "123", tgc: 55200, tgd: 36400, tgt: 38600, tgl: 29950 },
    { ten_may: "Máy N", id: "123", tgc: 29900, tgd: 28800, tgt: 54700, tgl: 35500 },
    { ten_may: "Máy O", id: "123", tgc: 32100, tgd: 39200, tgt: 77000, tgl: 77100 },
]


