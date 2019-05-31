import express from 'express';
import PatientController from '../todosController/todos';

const router = express.Router();

router.get('/api/treatment/:patientId', PatientController.getTreatmentPlan);
router.get('/api/patient/:patientId', PatientController.getPatient);
router.post('/api/ehr/:patientId', PatientController.saveEhr);
router.get('/api/drugs/:patientId/:drugId', PatientController.verifyDrugs);

export default router;
