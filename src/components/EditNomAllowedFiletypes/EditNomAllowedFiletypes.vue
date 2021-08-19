<template>
    <div class="q-pa-xl">
        <q-form
                class="q-gutter-md"
                ref="myForm"
        >
            <q-input
                    outlined
                    v-model="fileScan.file_extension"
                    label="Denumire extensie"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Completati extensia fisierului']"
            />

            <q-input
                    outlined
                    v-model="fileScan.file_max_size"
                    label="Dimensiune maxima megabiti (Mb)"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Completati nr.de Megabiti maxim admis']"
            />

        </q-form>
        <br />
        <div class="absolute-bottom-right q-pa-sm">
            <q-btn label="Salveaza" type="submit" color="primary" @click="onSubmit" size="sm"/>
            <q-btn label="Renunt" flat @click="frenunt"/>
        </div>
    </div>
</template>


<script lang="ts" src="./EditNomAllowedFiletypes.ts" />

<style scoped>

</style>
