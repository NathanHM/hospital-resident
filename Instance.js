const Hospital = require("./Hospital");
const Doctor = require('./Doctor');

/**
 * The Class Instance, to represent an HR / HRT problem instance
 */
class Instance {

    _doctors; // The array of Doctor objects
    _hospitals; // The array of Hospitals objects

    /**
     * Instantiates a new instance
     * @param numDoctors the number of doctors
     * @param numHospitals the number of hospitals
     */
    constructor(numDoctors, numHospitals) {

        // record the number of doctors in a static variable
        // of class Hospital
        Hospital.numDoctors = numDoctors;

        // instantiate Doctor and Hospital arrays
        this._doctors = [];
        this._hospitals = [];

        // instantiate Doctor and Hospital objects within arrays
        for (let i = 1; i <= numDoctors; i++) {
            this._doctors[i - 1] = new Doctor(i);
        }
        for (let i = 1; i <= numHospitals; i++) {
            this._hospitals[i - 1] = new Hospital(i);
        }

    }

    get doctors() {
        return this._doctors;
    }

    get hospitals() {
        return this._hospitals;
    }

    /**
 * Gets the Doctor object with a given id, assumes id counts from 1
 * @param id the Doctor's id
 * @return the Doctor object with the given id
 */
    getDoctorById(id) {
        return this._doctors[id - 1];
    }

    /**
 * Gets the Hospital object with a given id, assumes id counts from 1
 * @param id the Hospital's id
 * @return the Hospital object with the given id
 */
    getHospitalById(id) {
        return this._hospitals[id - 1];
    }

}

module.exports = Instance;