<template>
    <div style="margin-top: 10px;">
        <div class="row">
            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 q-pa-xs">
                <q-select outlined v-model="searchParams.id_registru" :options="optionsRegistre" style="max-height: 7vh;;"
                          option-value="id_registru"
                          option-label="den_registru_lang_1"
                          emit-value
                          map-options
                          dense
                          label="Registru"
                          :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                />
            </div>
            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 q-pa-xs">
                <q-select class="col-10" outlined v-model="searchParams.id_categ" :options="optionsCategorii" style="max-height: 7vh;;"
                          option-value="id_categ"
                          option-label="den_lang_1"
                          emit-value
                          map-options
                          dense
                          label="Categorie"
                          :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                />
            </div>
            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 q-pa-xs">
                <q-select class="col-10" outlined v-model="searchParams.id_tip_document" :options="filteredOptionTipDoc" style="max-height: 7vh;;"
                          option-value="id_tip_doc"
                          option-label="den_lang_1"
                          emit-value
                          map-options
                          dense
                          label="Tip document"
                          :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                />
            </div>
            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 q-pa-xs">
                <q-select class="col-10" outlined v-model="searchParams.id_tip_inregistrare" :options="optionsTipInregistare" style="max-height: 7vh;;"
                          option-value="value"
                          option-label="label"
                          emit-value
                          map-options
                          dense
                          label="Tip inregistrare"
                          :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                />
            </div>
        </div>
        <div class="row">
            <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3 q-pa-xs">
                <q-input
                        outlined
                        v-model="denRepartizatLa"
                        label="Repartizat la"
                        outlined
                        dense
                        readonly
                        @click="viewDialogSelectDepartament=true"
                        :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                />
            </div>
            <span class="col-xs-12 col-sm-2 col-md-2 col-lg-2 q-pa-xs text__label--medium" style="text-align: center;">Perioada</span>
            <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2 q-pa-xs">
                <div style="max-width: 200px">
                    <q-input outlined v-model="searchParams.data_start" dense mask="##.##.####"
                             label="De la"
                             :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                    >
                        <q-popup-proxy ref="qDateProxyStart" transition-show="scale" transition-hide="scale">
                            <q-date v-model="searchParams.data_start" mask="DD.MM.YYYY"  @input="() => $refs.qDateProxyStart.hide()" :locale="myLocale" />
                        </q-popup-proxy>
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer"></q-icon>
                        </template>
                    </q-input>
                </div>
            </div>
            <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2 q-pa-xs">
                <div style="max-width: 200px">
                    <q-input outlined v-model="searchParams.data_end" dense mask="##.##.####"
                             label="pana la"
                             :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                    >
                        <q-popup-proxy ref="qDateProxyEnd" transition-show="scale" transition-hide="scale">
                            <q-date v-model="searchParams.data_end" mask="DD.MM.YYYY"  @input="() => $refs.qDateProxyEnd.hide()" :locale="myLocale" />
                        </q-popup-proxy>
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer"></q-icon>
                        </template>
                    </q-input>
                </div>
            </div>
        </div>

    <div style="display: flex;width:100%;justify-content: center;width:100%;">
        <div style="display: flex;justify-content: flex-start;min-width:400px;">
            <q-btn color="black" label="Descarca XLS!" v-show="visibleGetXlsBtn" size="sm" no-caps  :disable="ajaxSearchingDocs" :loading="ajaxSearchingDocs" @click="getXls" style="min-width: 170px;margin:2px;">
                <template v-slot:loading>
                    <q-spinner-gears class="on-right" />
                    Pregatire raport...
                </template>
            </q-btn>
            <q-btn color="black" label="Descarca PDF!" v-show="visibleGetXlsBtn" size="sm" no-caps  :disable="ajaxSearchingDocs" :loading="ajaxSearchingDocs" @click="getPdf" style="min-width: 170px;margin:2px;">
                <template v-slot:loading>
                    <q-spinner-gears class="on-right" />
                    Pregatire raport...
                </template>
            </q-btn>
            <q-btn color="blue" label="Reseteaza filtrul!" v-show="visibleResetBtn" size="sm" no-caps  @click="resetSearchParams" style="min-width: 150px;margin:2px;" />
        </div>
    </div>

        <br>
        <TableDocuments accesFrom="toateRepartizatele" :searchParams="searchParams" :withSearchInput="false" @MyDocuments="onEventFromMyDocuments" />

        <q-dialog v-model="viewDialogSelectDepartament" position="top">
            <q-card style="min-width: 70vw;"
                    v-bind:class="{ 'partial80_height': $q.platform.is.mobile, 'partial60_height': $q.platform.is.desktop }"
            >
                <div style="display:flex;justify-content: flex-end;">
                    <span class="material-icons cursor-pointer" @click="viewDialogSelectDepartament=false" style="color:#747474;font-weight: bolder;font-size: 1.5em;">close</span>
                </div>

                <q-card-section>
                    <ComboDepartamente :selectDepartament="selectDepartament" :selectDivizie="selectDivizie"  title="Selectati directia sau departamentul" />
                </q-card-section>
            </q-card>
        </q-dialog>
    </div>
</template>


<script lang="ts" src="./ToateRepartizate.ts" />

<style scoped>

</style>
