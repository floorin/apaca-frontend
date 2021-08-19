<template>
    <div class="q-pa-xl">
        <q-form
                class="q-gutter-md"
                ref="myForm"
        >
            <q-input
                    outlined
                    v-model="categorie.den_lang_1"
                    label="Denumire categorie"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Completati denumirea in limba romana']"
            />

            <!--
            <q-input
                    outlined
                    v-model="categorie.den_lang_2"
                    label="Denumire maghiara"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Completati denumirea in limba maghiara']"
            />
            -->
        </q-form>
        <br />
        <div class="absolute-bottom-right q-pa-sm">
            <q-btn label="Salveaza" type="submit" color="primary" @click="onSubmit" size="sm"/>
            <q-btn label="Renunt" flat @click="frenunt"/>
        </div>
    </div>
</template>


<script lang="ts" src="./EditNomCateg.ts" />

<style scoped>

</style>
