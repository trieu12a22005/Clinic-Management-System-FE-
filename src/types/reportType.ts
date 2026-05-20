// BM1 - Danh Sách Khám Bệnh
export interface BM1Item {
    stt: number;
    fullName: string;
    gender: string;
    birthYear: number;
    address: string;
}

export interface BM1Response {
    title: string;
    date: string;
    maxPatientsLimit: number;
    totalPatients: number;
    data: BM1Item[];
}

// BM3 - Danh Sách Bệnh Nhân
export interface BM3Item {
    stt: number;
    fullName: string;
    date: string;
    diseaseType: string;
    symptoms: string;
}

export interface BM3Response {
    title: string;
    date: string;
    totalPatients: number;
    data: BM3Item[];
}
