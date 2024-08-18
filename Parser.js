const fs = require('fs');
const Instance = require('./Instance');

/**
 * The Class Parser, to handle reading in an instance and a matching
 */
class parser {

    _instance; // The HR instance

    /**
     * Parses the instance file into an Instance object
     * @param fileName the name of the instance file
     * @return the instance
     */
    parseInstance(filename) {
        // open input file
        const data = fs.readFileSync(filename, 'utf8');
        const lines = data.trim().split('\n');

        // firstly obtain numbers of doctors and hospitals
        const numDoctors = parseInt(lines[0].trim());
        const numHospitals = parseInt(lines[1].trim());

        // create Instance object
        this._instance = new Instance(numDoctors, numHospitals);

        // read in the doctors' preference lists, line by line
        for (let i = 1; i <= numDoctors; i++) {

            // get Doctor object with id index
            const line = lines[i + 1].trim();
            const doctor = this._instance.getDoctorById(i);

            // split line into tokens delimited by a colon 
            const doctorInfo = line.split(':');
            // first token is Doctor id
            // second token should be preference list

            if (doctorInfo.length > 1) {

                // split preference list into tokens, delimited by whitespace
                const preferences = doctorInfo[1].trim().split(/\s+/);

                // iterate over tokens
                for (const preference of preferences) {
                    const hospitalId = parseInt(preference); // get hospital id
                    doctor.addPref(this._instance.getHospitalById(hospitalId)); // add corresponding Hospital object to Doctor's preference list
                }
            }
        }

        //read in the hospitals' capacities and preference lists, line by line
        for (let i = 1; i <= numHospitals; i++) {

            // get Doctor object with id index
            const line = lines[numDoctors + i + 1].trim();
            const hospital = this._instance.getHospitalById(i);

            // split line into tokens delimited by a colon 
            const hospitalInfo = line.split(':');
            // first token is hospital id
            // second token is hospital capacity
            hospital.capacity = parseInt(hospitalInfo[1].trim());

            // determine whether preference list is non-empty
            if (hospitalInfo.length > 2) {

                let preferences = hospitalInfo[2].trim(); // copy preference list into String, trimming leading / trailing whitespace
                let rank = 1; // keep track of rank, starting from 1 initially
                let inTie = false; // maintain boolean to determine whether current pref list entry is in a tie

                // iterate as long as prefs is non-emtpy
                while (preferences.length > 0) {
                    // iterate past a space
                    if (preferences.charAt(0) === ' ') {
                        preferences = preferences.slice(1);
                        // if open bracket, we are now entering a tie
                    } else if (preferences.charAt(0) === '(') {
                        inTie = true;
                        preferences = preferences.slice(1);
                        // if close bracket, we are now leaving a tie
                    } else if (preferences.charAt(0) === ')') {
                        inTie = false;
                        rank++; // increment rank for next preference list entry
                        preferences = preferences.slice(1);
                    } else {

                        // we should have an integer id representing a doctor
                        let j = 0;

                        // read characters at position j of prefs
                        while (j < preferences.length && !isNaN(parseInt(preferences.charAt(j)))) {
                            j++;
                        }

                        // all characters between 0..(j-1) inclusive are doctor id
                        const doctorString = preferences.slice(0, j);
                        const doctorId = parseInt(doctorString);

                        // add Doctor with given id and rank to Hospital preference list
                        hospital.addPref(this._instance.getDoctorById(doctorId), rank);

                        // remove Doctor id from prefs ready for parsing to continue 
                        preferences = preferences.slice(j);

                        if (!inTie) rank++; // if we are not within a tie, rank must increment
                    }
                }
            }
        }
        return this._instance;
    }

    /**
     * Parses the matching file and populates the existing
     * instance with the matching read in
     * @return true if the matching is valid, false otherwise
     */
    parseMatching(filename) {

        // open input file
        const data = fs.readFileSync(filename, 'utf8');
        const lines = data.trim().split('\n');

        // read in the matching line by line
        for (let i = 0; i < lines.length; i++) {

            const line = lines[i].trim();
            const tokens = line.split(/[(), ]+/); // split line into tokens delimited by brackets, commas and spaces

            const doctorId = parseInt(tokens[1]); // second token should be doctor id
            const hospitalId = parseInt(tokens[2]); // third token should be hospital id

            // get Doctor and Hospital objects from ids
            const doctor = this._instance.getDoctorById(doctorId);
            const hospital = this._instance.getHospitalById(hospitalId);

            // determine whether hospital finds doctor acceptable
            if (hospital.getRank(doctor) < 0) {
                // hospital finds doctor unacceptable, matching invalid
                console.log(`Hospital ${hospital.id} finds doctor ${doctor.id} unacceptable!`);
                return false;

                // determine whether doctor is already assigned
            } else if (doctor.assignment != undefined) {
                console.log(`Doctor ${doctor.id} is multiply assigned!`);
                return false;

            } else {
                doctor.assignTo(hospital);
                hospital.incrementNumAssignees();
            }
        }

        // now get all hospitals
        const hospitals = this._instance.hospitals;

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

module.exports = parser;