/**
 * Task status values, used as board column IDs and stored in Firebase.
 * @readonly
 * @enum {string}
 */
export const STATUS = {
  TRIAGE: "triage",
  TO_DO: "toDo",
  IN_PROGRESS: "inProgress",
  AWAIT: "await",
  DONE: "done",
};

window.STATUS = STATUS;
