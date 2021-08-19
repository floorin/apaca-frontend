<template>
    <div class="q-pa-xl">
        <q-form
                class="q-gutter-md"
                ref="myForm"
        >
            <q-input
                    outlined
                    type="number"
                    v-model="registru.an_permis_pt_inreg"
                    label="Anul"
                    lazy-rules
                    :rules="[
                              val =>val && val.length > 0 || 'Completati anul',
                              val => 1*val > 2019 && 1*val < 2030 || 'Completati un an valid'
                            ]"
            />

            <q-input
                    outlined
                    type="number"
                    v-model="registru.nr_de_start"
                    label="Numar de start"
                    lazy-rules
                    :rules="[
                              val => val && val.length > 0 || 'Completati numarul de start',
                              val => val && 1*val > 0 && 1*val < 9999999999|| 'Completati un numar de start valid'
                            ]"
            />

            <q-input
                    outlined
                    v-model="registru.den_registru_lang_1"
                    label="Denumire romana"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Completati denumirea in limba romana']"
            />
<!--
            <q-input
                    outlined
                    v-model="registru.den_registru_lang_2"
                    label="Denumire maghiara"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Completati denumirea in limba maghiara']"
            />
-->
        </q-form>
        <br />
        <div class="absolute-bottom-right q-pa-sm">
            <q-btn label="Salveaza" type="submit" color="primary" @click="onSubmit" size="sm" />
            <q-btn label="Renunt" flat @click="frenunt"/>
        </div>
    </div>
</template>


<script lang="ts" src="./EditNomRegistru.ts" />

<style scoped>

</style>
