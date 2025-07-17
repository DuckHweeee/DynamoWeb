export type Operator = {
    stt: string
    id: string
    name: string
    phong_ban: string
    nhom: string
    cong_viec: string
}

export type Machine = {
    id: string
    name: string
    loai_may: string
    ma_may: string
}

export type DrawingCode = {
    id: string
    ma_ban_ve: string
    dnc: string
    trang_thai: string
}

export type Process = {
    id: string
    ma_ban_ve: string
    dnc: string
    tgdk: string
    snc: string
    ttnc: string
    trang_thai: string
}

export type HistoryProcess = {
    ma_ban_ve: string
    tsnc: number
    hoan_thanh: number
    chua_hoan_thanh: number
    tght: number
}

export type HistoryMachine = {
    ten_may: string
    id: string
    tgc: number
    tgd: number
    tgt: number
    tgl: number
}



