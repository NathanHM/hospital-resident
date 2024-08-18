/**
 * The Class Doctor, to represent a single doctor
 */
class Doctor {

    _id; // The doctor's id, counting from 1 
    _preferenceList; 	// The doctor's preference list, in preference order
    _assignment; 	// The doctor's assigned hospital, or null if unassigned

    /**
     * Instantiates a new Doctor
     * @param i the Doctor's id
     */
    constructor(id) {
        this._id = id;
        this._preferenceList = [];
        this._assignment = undefined;
    }

    get id() {
        return this._id;
    }

    get preferenceList() {
        return this._preferenceList;
    }

    get assignment() {
        return this._assignment;
    }

    /**
     * Adds a hospital to the end of the doctor's preference list
     * @param hospital the hospital to be added
     */
    addPref(hospital) {
        this._preferenceList.push(hospital);
    }

    /**
    * Assigns the doctor to the given hospital
    * @param hospital the hospital
    */
    assignTo(hospital) {
        this._assignment = hospital;
    }

    /**
    * Assigns the doctor to the given hospital
    * @param hospital the hospital
    */
    toString() {
        return String(this._id)
    }
}

module.exports = Doctor;