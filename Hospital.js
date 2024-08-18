/**
 * The Class Hospital, to represent a single hospital
 */
class Hospital {

    _id; //The hospital's id, counting from 1
    _preferenceList; // The hospital's preference list, in preference order
    _rankList; 	// The hospital's ranking list Given a doctor with id i,
                // rankList[i-1] gives the hospital's ranking for that doctor
    _capacity; //The hospital's capacity
    _numAssignees; //The number of doctors assigned to the hospital
    _rankOfWorstAssignee; // The rank of the hospital's worst assignee
    static numDoctors; 	// The number of doctors in the instance
    _assignees; // The set of doctors currently assigned to the hospital

    /**
     * Instantiates a new Hospital
     * 
     * @param i the Hospital's id
     */
    constructor(id) {
        this._id = id;
        this._preferenceList = []
        this._assignees = new Set;
        this._capacity = 0;
        this.resetNumAssignees();
        this._rankList = [];
        for (let i = 0; i < this._numDoctors; i++) {
            this._rankList[i] = -1;
        }
        this._rankOfWorstAssignee = -1;
    }

    get id() {
        return this._id;
    }

    get rankList() {
        return this._rankList;
    }

    get capacity() {
        return this._capacity;
    }

    get numAssignees() {
        return this._numAssignees;
    }

    get rankOfWorstAssignee() {
        return this._rankOfWorstAssignee
    }

    get preferenceList() {
        return this._preferenceList;
    }

    get assigneesList() {
        return this._assignees;
    }

    set capacity(capacity) {
        this._capacity = capacity;
    }

    /**
	 * Adds a doctor with a given rank to the end of the hospital's preference list
	 * 
	 * @param doctor the doctor to be added
	 * @param rank   the rank of the doctor
	 */
    addPref(doctor, rank) {
        this._preferenceList.push(doctor);
        this._rankList[doctor.id - 1] = rank;
        if (rank > this._rankOfWorstAssignee) {
            this._rankOfWorstAssignee = rank;
        }
    }

    /**
	 * Sets the hospital's number of assignees to 0
	 */
    resetNumAssignees() {
        this._numAssignees = 0;
    }

    /**
	 * Increments the hospital's number of assignees
	 */
    incrementNumAssignees() {
        this._numAssignees++;
    }

    /**
	 * Decrements the hospital's number of assignees
	 */
    decrementNumAssignees() {
        this._numAssignees--;
    }

    /**
	 * Determine whether hospital is at or over capacity
	 * 
	 * @return true if hospital is at capacity or oversubscribed, false otherwise
	 */
    atCapacity() {
        return (this._numAssignees >= this._capacity);
    }

    /**
	 * Determine whether hospital is oversubscribed
	 * 
	 * @return true if hospital is oversubscribed, false otherwise
	 */
    isOverSubscribed() {
        return (this._numAssignees > this._capacity);
    }

    /**
	 * Return hospital's id as String representation
	 */
    toString() {
        return String(this._id);
    }

    /**
	 * Finds the rank of the provided doctor in this hospital's preference list.
	 * Returns -1 if the doctor does not appear in the list
	 * 
	 * @param d the doctor
	 * @return the rank of the doctor in this hospital's list
	 */
    getRank(doctor) {
        return this._rankList[doctor.id - 1];
    }

    /**
	 * Add a doctor to the list of assignees
	 * 
	 * @param doctor the doctor
	 */
    assign(doctor) {
        this._assignees.add(doctor);
        this.incrementNumAssignees();
    }

    /**
	 * Reject the lowest ranked assignee
	 */
    rejectWorst() {
        let state = this._assignees.delete(this._preferenceList[this._rankOfWorstAssignee - 1]);
        this.decrementNumAssignees();
    }

    /**
	 * Take the current worst assignee in the preferences list, then decrement
	 * through the list to find the worst ranked doctor currently in the assignee
	 * set
	 */
    updateWorstAssignee() {
        for (let i = this._rankOfWorstAssignee; i > 0; i--) {
            if (this._assignees.has(this._preferenceList[i - 1])) {
                this._rankOfWorstAssignee = i;
                return;
            }
        }
    }

    /**
	 * Get the current worst assignee
	 * 
	 * @return the worst assignee doctor
	 */
    getWorst() {
        return this._preferenceList[this._rankOfWorstAssignee - 1];
    }

}

module.exports = Hospital;