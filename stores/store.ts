import { TauriDatabase } from '~/classes/TauriDatabase';
import { Assignment } from '~/classes/Assignment';
import { Category } from '~/classes/Category';

export const useStore = defineStore('store', () => {
  const assignments = ref<Assignment[]>([]);
  const categories = ref<Category[]>([]);
  const database = new TauriDatabase('sqlite:workload.db');

  /**
   * Adds an assignment.
   * @param assignment - The assignment to add.
   */
  function addAssignment(assignment: Assignment) {
    assignments.value.push(assignment);
    database.insert(assignment);
  }

  /**
   * Adds a category.
   * @param name - The category name.
   * @param color - The category color.
   */
  function addCategory(name: string, color: string) {
    const c = new Category({ name, color });
    categories.value.push(c);
    database.insert(c);
  }

  /**
   * Loads assignments from the database.
   */
  async function loadAssignments() {
    assignments.value = await database.selectAll(Assignment);
  }

  /**
   * Loads categories from the database.
   */
  async function loadCategories() {
    categories.value = await database.selectAll(Category);
  }

  return {
    assignments,
    categories,
    addAssignment,
    addCategory,
    loadAssignments,
    loadCategories,
  };
});
