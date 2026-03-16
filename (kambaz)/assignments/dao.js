import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  function findAssignmentsForCourse(courseId) {
    return db.assignments.filter((assignment) => assignment.course === courseId);
  }

  function findAssignmentById(assignmentId) {
    return db.assignments.find((assignment) => assignment._id === assignmentId);
  }

  function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    db.assignments = [...db.assignments, newAssignment];
    return newAssignment;
  }

  function updateAssignment(assignmentId, assignmentUpdates) {
    db.assignments = db.assignments.map((assignment) =>
      assignment._id === assignmentId
        ? { ...assignment, ...assignmentUpdates }
        : assignment
    );
    return findAssignmentById(assignmentId);
  }

  function deleteAssignment(assignmentId) {
    db.assignments = db.assignments.filter(
      (assignment) => assignment._id !== assignmentId
    );
  }

  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}