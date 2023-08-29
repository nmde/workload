<script setup lang="ts">
import { select } from 'd3';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { Assignment } from '../classes/Assignment';
import { Calendar } from '../classes/Calendar';
import { useStore } from '../stores/store';

const store = useStore();
const { addAssignment } = store;
const { assignments } = storeToRefs(store);

const svg = ref<SVGElement | null>(null);
const year = ref(0);
const month = ref(0);
const dayDialog = ref(false);
const selectedDay = ref<Date>(new Date());
const startDate = ref<Date>(new Date());
const endDate = ref<Date>(new Date());
const assignmentTitle = ref('');
const assignmentWeight = ref('');
const assignmentError = ref(false);

const calendar = new Calendar();

calendar.on('dayClicked', (date) => {
  selectedDay.value = date;
  dayDialog.value = true;
  startDate.value = date;
  endDate.value = new Date();
});

onMounted(() => {
  const today = new Date();
  year.value = today.getFullYear();
  month.value = today.getMonth();
  calendar.render(
    select<SVGElement, null>('#svg'),
    assignments.value,
    year.value,
    month.value,
  );
});

</script>

<template>
  <div id="controls">
    <v-btn icon flat @click="() => {
      month -= 1;
      if (month < 0) {
        month = 11;
        year -= 1;
      }
      calendar.render(
        select<SVGElement, null>('#svg'),
        assignments,
        year,
        month,
      );
    }">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <h1 id="title">{{ Calendar.months[month] }} {{ year }}</h1>
    <v-btn icon flat @click="() => {
      month += 1;
      if (month > 11) {
        month = 0;
        year += 1;
      }
      calendar.render(
        select<SVGElement, null>('#svg'),
        assignments,
        year,
        month,
      );
    }">
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
        <v-text-field label="Assignment Title" v-model="assignmentTitle"></v-text-field>
        <v-text-field label="Assignment Weight" type="number" v-model="assignmentWeight"></v-text-field>
        <div id="date-pickers">
          <div class="date-picker">
            <h4>Start Date</h4>
            <v-date-picker show-adjacent-months hide-actions v-model="startDate"></v-date-picker>
          </div>
          <div class="date-picker">
            <h4>End Date</h4>
            <v-date-picker show-adjacent-months hide-actions v-model="endDate"></v-date-picker>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" variant="tonal" block :error="assignmentError" @click="() => {
            if (assignmentTitle.length === 0 || assignmentWeight.length === 0) {
              assignmentError = true;
            } else {
              addAssignment(
                new Assignment(
                  assignmentTitle,
                  startDate,
                  endDate,
                  Number(assignmentWeight),
                ),
              );
            }
          }
          ">Add Assignment</v-btn>
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
</style>
