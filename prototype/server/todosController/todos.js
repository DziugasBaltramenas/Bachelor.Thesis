/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import db from '../db/db';

class PatientController {
  getTreatmentPlan(req, res) {
    const id = parseInt(req.params.patientId, 10);

    db.map((patient) => {
      if (patient.id === id) {
        return res.status(200).send({
          treatmentPlan: patient.treatmentPlan,
        });
      }
    });

    return res.status(404).send();
  }

  getPatient(req, res) {
    const id = parseInt(req.params.patientId, 10);

    db.map((patient) => {
      if (patient.id === id) {
        return res.status(200).send({ patient });
      }
    });

    return res.status(404).send();
  }

  verifyDrugs(req, res) {
    const patientId = parseInt(req.params.patientId, 10);
    const drugId = parseInt(req.params.drugId, 10);

    db.map((patient) => {
      if (patient.id === patientId) {
        const verification = patient.drugs.some(drug => drug.id === drugId);
        return res.status(200).send({ verification });
      }
    });

    return res.status(404).send();
  }

  saveEhr(req, res) {
    const id = parseInt(req.params.patientId, 10);
    let patientInstance;
    let itemIndex;

    db.map((patient, index) => {
      if (patient.id === id) {
        patientInstance = patient;
        itemIndex = index;
      }
    });

    if (!patientInstance) {
      return res.status(404).send({
        success: 'false',
        message: 'patient not found',
      });
    }

    if (!req.body.ehrs) {
      return res.status(400).send({
        success: 'false',
        message: 'ehr is required',
      });
    }

    const patient = {
      id: patientInstance.id,
      treatmentPlan: patientInstance.treatmentPlan,
      drugs: patientInstance.drugs,
      ehrs: [
        ...patientInstance.ehrs,
        ...req.body.ehrs.map(ehr => ({
          record: ehr,
          submited: new Date(),
        })),
      ],
    };

    db.splice(itemIndex, 1, patient);

    return res.status(201).send({
      success: 'true',
      message: 'ehr added successfully',
      patient,
    });
  }
}

const patientController = new PatientController();
export default patientController;
