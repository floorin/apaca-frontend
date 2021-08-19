<template>
    <div class="q-pa-sm">
        <WorkOnDocument v-if="userid!='0'" :appid="appid" withFinalizeButton="no" :key="vueKeyToForceRefresh"/>
    </div>
</template>

<script lang="ts" src="./ViewDocument.ts" />

<style scoped>

</style>

