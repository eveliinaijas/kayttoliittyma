import { Router } from 'express';
import AbsenceController from '../controllers/absenceController';

const router = Router();
const absenceController = new AbsenceController();

export function setRoutes(app) {
    app.use('/api/absences', router);
    router.post('/', absenceController.createAbsence.bind(absenceController));
    router.get('/', absenceController.getAbsences.bind(absenceController));
    router.delete('/:id', absenceController.deleteAbsence.bind(absenceController));
}