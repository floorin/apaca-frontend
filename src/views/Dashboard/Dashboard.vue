<template>
<div class="q-pa-md">
    <q-tabs
            v-model="taburi"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
    >
        <q-tab name="documente_repartizate"align="top">
            <div style="display: flex;">
            <span style="margin-right: 2px;">Documente repartizate mie</span>
            <q-badge color="blue" transparent style="position: relative;top:-5px;">{{nrOfMyDocuments}}</q-badge>
            </div>
        </q-tab>
        <q-tab name="documente_fara_atasament"align="top">
            <div style="display: flex;">
                <span style="margin-right: 2px;">Documente nefinalizate</span>
                <q-badge color="orange" transparent style="position: relative;top:-5px;">{{nrOfPendingToRegister}}</q-badge>
            </div>
        </q-tab>
    </q-tabs>
    <q-tab-panels v-model="taburi"
                  animated
                  transition-prev="fade"
                  transition-next="fade"
    >
        <q-tab-panel name="documente_repartizate">
            <MyDocuments @MyDocuments="onEventFromMyDocuments" />
        </q-tab-panel>

        <q-tab-panel name="documente_fara_atasament">
            <WorkDocumentePendingRegistering @MyDocuments="onEventFromMyDocuments" />
        </q-tab-panel>
    </q-tab-panels>
</div>
</template>


<script lang="ts" src="./Dashboard.ts" />

<style scoped>

</style>
