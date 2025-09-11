class AbsenceController {
    private absences: Absence[] = [];

    createAbsence(req: AbsenceRequest, res: Response): void {
        const { employeeId, startDate, endDate, reason } = req.body;
        const newAbsence = new Absence(Date.now().toString(), employeeId, startDate, endDate, reason);
        this.absences.push(newAbsence);
        res.status(201).json(newAbsence);
    }

    getAbsences(req: Request, res: Response): void {
        res.status(200).json(this.absences);
    }

    deleteAbsence(req: Request, res: Response): void {
        const { id } = req.params;
        this.absences = this.absences.filter(absence => absence.id !== id);
        res.status(204).send();
    }
}

export default AbsenceController;