<script setup lang="ts">
import { select } from 'd3';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { Assignment } from '../classes/Assignment';
import { Calendar } from '../classes/Calendar';
import { useStore } from '../stores/store';

const store = useStore();
const { addAssignment, addCategory, loadAssignments, loadCategories } = store;
const { assignments, categories } = storeToRefs(store);

const svg = ref<SVGElement | null>(null);
const year = ref(0);
const month = ref(0);
const dayDialog = ref(false);
const selectedDay = ref<Date>(new Date());
const startDate = ref<Date>(new Date());
const endDate = ref<Date>(new Date());
const selectedAssignment = ref<Assignment>(
  new Assignment({
    title: '',
    startDate: '',
    endDate: '',
    category: '',
    weight: 0,
  }),
);
const assignmentTitleError = ref(false);
const assignmentWeightError = ref(false);
const assignmentCategoryError = ref(false);
const assignmentDateError = ref(false);
const categoryDialog = ref(false);
const categoryName = ref('');
const categoryNameError = ref(false);
const categoryColor = ref('');
const categoryColorError = ref(false);

const calendar = new Calendar();

calendar.on('dayClicked', (date) => {
  selectedDay.value = date;
  dayDialog.value = true;
  startDate.value = date;
  endDate.value = new Date();
  selectedAssignment.value = new Assignment({
    title: '',
    startDate: '',
    endDate: '',
    category: '',
    weight: 0,
  });
  assignmentTitleError.value = false;
  assignmentWeightError.value = false;
  assignmentCategoryError.value = false;
  assignmentDateError.value = false;
});

calendar.on('assignmentClicked', (assignment) => {
  dayDialog.value = true;
  selectedAssignment.value = assignment;
  startDate.value = assignment.startDate;
  endDate.value = assignment.endDate;
  assignmentTitleError.value = false;
  assignmentWeightError.value = false;
  assignmentCategoryError.value = false;
  assignmentDateError.value = false;
});

function reRender() {
  calendar.render(
    select<SVGElement, null>('#svg'),
    assignments.value,
    categories.value,
    year.value,
    month.value,
  );
}

onMounted(async () => {
  await loadAssignments();
  await loadCategories();
  const today = new Date();
  year.value = today.getFullYear();
  month.value = today.getMonth();
  reRender();
});
</script>

<template>
  <v-btn
    icon
    @click="
      () => {
        categoryDialog = true;
        categoryName = '';
        categoryColor = '';
        categoryNameError = false;
        categoryColorError = false;
      }
    "
  >
    <v-icon>mdi-plus</v-icon>
  </v-btn>
  <div id="controls">
    <v-btn
      icon
      flat
      @click="
        () => {
          month -= 1;
          if (month < 0) {
            month = 11;
            year -= 1;
          }
          reRender();
        }
      "
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <h1 id="title">{{ Calendar.months[month] }} {{ year }}</h1>
    <v-btn
      icon
      flat
      @click="
        () => {
          month += 1;
          if (month > 11) {
            month = 0;
            year += 1;
          }
          reRender();
        }
      "
    >
      <v-icon>mdi-arrow-right</v-icon>
    </v-btn>
  </div>
  <svg id="svg"></svg>
  <v-dialog v-model="dayDialog">
    <v-card>
      <v-card-title>
        <h3>Add Assignment</h3>
      </v-card-title>
      <v-card-text>
        <v-text-field
          label="Assignment Title"
          :error="assignmentTitleError"
          v-model="selectedAssignment.data.title"
        ></v-text-field>
        <v-text-field
          label="Assignment Weight"
          :error="assignmentWeightError"
          type="number"
          v-model="selectedAssignment.data.weight"
        ></v-text-field>
        <v-select
          :items="categories"
          item-title="data.name"
          item-value="data.name"
          :error="assignmentCategoryError"
          v-model="selectedAssignment.data.category"
        ></v-select>
        <div id="date-pickers">
          <div class="date-picker">
            <h2>Start Date</h2>
            <p v-if="assignmentDateError" class="error">
              Start date cannot be after end date!
            </p>
            <v-date-picker
              show-adjacent-months
              hide-actions
              v-model="startDate"
            ></v-date-picker>
          </div>
          <div class="date-picker">
            <h2>End Date</h2>
            <v-date-picker
              show-adjacent-months
              hide-actions
              v-model="endDate"
            ></v-date-picker>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          variant="tonal"
          block
          @click="
            () => {
              selectedAssignment.data.weight = Number(
                selectedAssignment.data.weight,
              );
              selectedAssignment.data.startDate = startDate.toISOString();
              selectedAssignment.data.endDate = endDate.toISOString();
              assignmentTitleError = selectedAssignment.data.title.length === 0;
              assignmentWeightError =
                isNaN(selectedAssignment.data.weight) ||
                selectedAssignment.data.weight > 1 ||
                selectedAssignment.data.weight < 0;
              assignmentCategoryError =
                selectedAssignment.data.category.length === 0;
              assignmentDateError = startDate > endDate;
              if (
                !assignmentTitleError &&
                !assignmentWeightError &&
                !assignmentCategoryError &&
                !assignmentDateError
              ) {
                addAssignment(selectedAssignment);
                dayDialog = false;
                reRender();
              }
            }
          "
          >Add Assignment</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="categoryDialog">
    <v-card>
      <v-card-title>Add Category</v-card-title>
      <v-card-text>
        <v-text-field
          label="Category Name"
          :error="categoryNameError"
          v-model="categoryName"
        ></v-text-field>
        <v-text-field
          label="Category Color"
          :error="categoryColorError"
          v-model="categoryColor"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          block
          @click="
            () => {
              categoryNameError = categoryName.length === 0;
              categoryColorError = categoryColor.length === 0;
              if (!categoryNameError && !categoryColorError) {
                addCategory(categoryName, categoryColor);
                categoryDialog = false;
              }
            }
          "
          >Create Category</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.date-picker {
  text-align: center;
}

#date-pickers {
  display: flex;
}

#controls {
  display: flex;
  justify-content: center;
}

#svg {
  height: 100%;
  width: 100%;
}

#title {
  text-align: center;
  min-width: 246px;
}

.error {
  color: red;
}
</style>
