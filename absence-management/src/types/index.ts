export interface Absence {
    id: string;
    employeeId: string;
    startDate: Date;
    endDate: Date;
    reason: string;
}

export interface AbsenceRequest {
    employeeId: string;
    startDate: Date;
    endDate: Date;
    reason: string;
}