<script setup lang="ts">
import { select } from 'd3';
import { onMounted, ref } from 'vue';
import { Assignment } from '../classes/Assignment';
import { Calendar } from '../classes/Calendar';

const svg = ref<SVGElement | null>(null);
const year = ref(0);
const month = ref(0);

const assignments: Assignment[] = [
  new Assignment(new Date(2023, 7, 24), new Date(2023, 9, 11), 1),
];

const calendar = new Calendar();

onMounted(() => {
  const today = new Date();
  year.value = today.getFullYear();
  month.value = today.getMonth();
  calendar.render(
    select<SVGElement, null>('#svg'),
    assignments,
    year.value,
    month.value,
  );
});

function prevMonth() {
  month.value -= 1;
  if (month.value < 0) {
    month.value = 11;
    year.value -= 1;
  }
  calendar.render(
    select<SVGElement, null>('#svg'),
    assignments,
    year.value,
    month.value,
  );
}

function nextMonth() {
  month.value += 1;
  if (month.value > 11) {
    month.value = 0;
    year.value += 1;
  }
  calendar.render(
    select<SVGElement, null>('#svg'),
    assignments,
    year.value,
    month.value,
  );
}
</script>

<template>
  <div id="controls">
    <v-btn icon flat @click="prevMonth">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <h1 id="title">{{ Calendar.months[month] }} {{ year }}</h1>
    <v-btn icon flat @click="nextMonth">
      <v-icon>mdi-arrow-right</v-icon>
    </v-btn>
  </div>
  <svg id="svg"></svg>
</template>

<style scoped>
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
