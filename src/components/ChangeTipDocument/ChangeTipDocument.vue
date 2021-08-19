<template>
<div class="q-pa-md" style="min-width: 500px;">
    <span class="text__title--medium">Modificare tip document</span>
    <br />
    <br />
    <div class="row">
        <span class="col-2 form__label">Categorie</span>
        <q-select class="col-10" outlined v-model="id_categ" :options="optionsCategorii" style="max-height: 7vh;;"
                  @input="resetTipDoc"
                  option-value="id_categ"
                  option-label="den_lang_1"
                  emit-value
                  map-options
                  lazy-rules
                  dense
                  :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                  :rules="[ val => val && val > 0 || 'Alegeti categoria documentului!']"
        />
    </div>

    <div class="row">
        <span class="col-2 form__label">Tip</span>
        <q-select class="col-10" outlined v-model="id_tip_doc" :options="filteredOptionTipDoc" style="max-height: 7vh;;"
                  option-value="id_tip_doc"
                  option-label="den_lang_1"
                  emit-value
                  map-options
                  lazy-rules
                  dense
                  :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                  :rules="[ val => val && val > 0 || 'Alegeti tipul documentului!']"
        />
    </div>
    <br />
    <div class="absolute-bottom-right q-pa-sm">
        <q-btn label="Renunt" flat @click="frenuntModificareTipDoc"/>
        <q-btn label="Salveaza" color="primary" @click="modificaTipDocument" size="sm"/>
    </div>
</div>
</template>

<script lang="ts" src="./ChangeTipDocument.ts" />

<style scoped>

</style>
