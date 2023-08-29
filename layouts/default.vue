<template>
  <v-app>
    <v-toolbar color="primary">
      <v-toolbar-title id="title">Workload</v-toolbar-title>
    </v-toolbar>
    <v-main>
      <slot></slot>
    </v-main>
  </v-app>
</template>

<style scoped>
#title {
  font-family: 'Greek Diner Inline TT';
}
</style>
