import { Assignment } from '~/classes/Assignment';

export const useStore = defineStore('store', () => {
  const assignments = ref<Assignment[]>([]);

  /**
   * Adds an assignment.
   * @param assignment - The assignment to add.
   */
  function addAssignment(assignment: Assignment) {
    assignments.value.push(assignment);
  }

  return {
    assignments,
    addAssignment,
  };
});
