export class Absence {
    id: number;
    employeeId: number;
    startDate: Date;
    endDate: Date;
    reason: string;

    constructor(id: number, employeeId: number, startDate: Date, endDate: Date, reason: string) {
        this.id = id;
        this.employeeId = employeeId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.reason = reason;
    }
}