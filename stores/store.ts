import { Assignment } from '~/classes/Assignment';
import { Category } from '~/classes/Category';

export const useStore = defineStore('store', () => {
  const assignments = ref<Assignment[]>([]);
  const categories = ref<Category[]>([]);

  /**
   * Adds an assignment.
   * @param assignment - The assignment to add.
   */
  function addAssignment(assignment: Assignment) {
    assignments.value.push(assignment);
  }

  /**
   * Adds a category.
   * @param name - The category name.
   * @param color - The category color.
   */
  function addCategory(name: string, color: string) {
    categories.value.push({
      name,
      color,
    });
  }

  return {
    assignments,
    categories,
    addAssignment,
    addCategory,
  };
});
