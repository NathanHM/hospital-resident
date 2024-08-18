/**
 * The Class Algorithm, containing methods to run either the RGS algorithm for
 * HR, to print the matching and to check the matching for stability
 */
class Algorithm {

    /** The HR instance */
    _instance;

    /**
    * Instantiates a new Algorithm object
    * 
    * @param instance the HR instance
    */
    constructor(instance) {
        this._instance = instance;
    }

    /**
     * Executes RGS algorithm for HR
     */
    run() {

        // Initialise all the doctors in a queue
        let queue = new Array(...this._instance.doctors);

        // Iterate while there are unmatched doctors who have not applied to all
        // hospitals on their lists
        while (queue.length > 0) {

            // Take the first doctor from the queue
            const doctor = queue.shift();

            // Iterate through the doctor's preference list
            for (const hospital of doctor.preferenceList) {


                // If the hospital still has room, assign the doctor to the hospital
                if (!hospital.atCapacity()) {
                    doctor.assignTo(hospital);
                    hospital.assign(doctor);
                    break;
                }

                // If the hospital is at capacity, check the hospital's preferences
                else {
                    hospital.updateWorstAssignee();
                    if (hospital.getRank(doctor) < hospital.rankOfWorstAssignee) {


                        // Remove the lowest ranked assignee, and add them back to the queue
                        hospital.getWorst().assignTo(undefined);
                        queue.push(hospital.getWorst());
                        hospital.rejectWorst();



                        // Assign the doctor to the hospital
                        hospital.assign(doctor);
                        doctor.assignTo(hospital);
                        break;
                    }
                }
            }

        }
    }


    /**
    * Prints the matching to the console
    */
    printMatching() {
        console.log('Matching:');
        let matching = 0; // Initialise matching count to 0

        // Iterate over each doctor
        for (const doctor of this._instance.doctors) {

            // Check whether the doctor was assigned or not
            if (doctor.assignment !== undefined) {
                console.log(`Doctor ${doctor.toString()} is assigned to hospital ${doctor.assignment.toString()}.`);
                matching++;
            } else {
                console.log(`Doctor ${doctor.toString()} is unmatched.`);
            }
        }
        console.log(`Matching size: ${matching}`);
    }

    /**
     * Checks the matching for stability
     */
    checkStability() {

        // Initialise the assignment lists of all the hospitals
        for (const doctor of this._instance.doctors) {
            if (doctor.assignment !== undefined) {
                doctor.assignment.assign(doctor);
            }
        }

        let stable = true;

        // Iterate through the preference list of each doctor
        for (const doctor of this._instance.doctors) {
            for (const hospital of doctor.preferenceList) {

                // If the assigned hospital has been reached, check the next doctor's list
                if (doctor.assignment === hospital) {
                    break;
                }

                hospital.updateWorstAssignee(); // Find the worst assignee for the hospital

                // If the doctor has a lower rank than the worst ranked doctor on the assignee
                // list, a blocking has been found
                if (hospital.getRank(doctor) <= hospital.rankOfWorstAssignee) {
                    console.log(`Blocking pair between doctor ${doctor.id} and hospital ${hospital.id}.`);
                    stable = false;
                }
            }
        }

        // Print if the matching is stable or not
        if (stable) {
            console.log('Matching is stable');
        } else {
            console.log('Matching is not stable');
        }
    }

    /**
     * Determines whether we have a valid matching
     * 
     * @return true if we have a valid matching, false otherwise
     */
    checkMatching() {

        // get all doctors and hospitals
        const doctors = this._instance.doctors;
        const hospitals = this._instance.hospitals;

        // reset number of assignees of each hospital to 0
        for (const hospital of hospitals) {
            hospital.resetNumAssignees();
        }

        // iterate over each doctor in turn
        for (const doctor of doctors) {

            // check if d is assigned
            if (doctor.assignment !== undefined) {

                // get hospital h that d is assigned to
                const hospital = doctor.assignment;
                if (hospital.getRank(doctor) < 0) {
                    // h finds d unacceptable, matching invalid
                    console.log(`Hospital ${hospital.id} does not find doctor ${doctor.id} acceptable!`);
                    return false;
                }

                // d is a legal assignee of h
                hospital.incrementNumAssignees();
            }
        }

        // check whether a hospital is oversubscribed
        for (const hospital of hospitals) {
            if (hospital.isOverSubscribed()) {
                console.log(`Hospital ${hospital.id} is oversubscribed!`);
                return false;
            }
        }

        // we have a valid matching
        return true;
    }

}

module.exports = Algorithm;