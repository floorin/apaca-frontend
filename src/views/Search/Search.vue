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
                      @input="visibleSearchBtn=true"
                      :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
            />
        </div>
        <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 q-pa-xs">
            <q-select class="col-10" outlined v-model="searchParams.id_categ" :options="optionsCategorii" style="max-height: 7vh;;"
                      option-value="id_categ"
                      option-label="den_lang_1"
                      emit-value
                      map-options
                      @input="visibleSearchBtn=true"
                      dense
                      label="Categorie"
                      :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
            />
        </div>
        <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 q-pa-xs">
                <q-select class="col-10" outlined v-model="searchParams.id_tip_document" :options="filteredOptionTipDoc" style="max-height: 7vh;;"
                          option-value="id_tip_document"
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
        <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2 q-pa-xs">
            <q-input
                    outlined
                    v-model="searchParams.expeditor_denumire"
                    label="Expeditor"
                    outlined
                    dense
                    :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
            />
        </div>
        <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2 q-pa-xs">
            <q-input
                    outlined
                    v-model="searchParams.expeditor_cui"
                    label="Cnp / cui"
                    outlined
                    dense
                    :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
            />
        </div>
        <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 q-pa-xs">
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
        <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 q-pa-xs">
            <q-select
                    outlined
                    dense
                    v-model="searchParams.userid"
                    use-input
                    input-debounce="0"
                    label="Creat de utilizator"
                    :options="optionsUsers"
                    @filter="filterFnUsers"
                    behavior="menu"
                    option-value="userid"
                    option-label="name"
                    emit-value
                    map-options
            >
                <template v-slot:no-option>
                    <q-item>
                        <q-item-section class="text-grey">
                            No results
                        </q-item-section>
                    </q-item>
                </template>
            </q-select>
        </div>
        <div class="col-xs-12 col-sm-2 col-md-2 col-lg-2 q-pa-xs">
            <q-select
                    outlined
                    dense
                    v-model="searchParams.deponent_userid"
                    use-input
                    input-debounce="0"
                    label="Depus de utilizator"
                    :options="optionsUsers"
                    @filter="filterFnUsers"
                    behavior="menu"
                    option-value="userid"
                    option-label="name"
                    emit-value
                    map-options
            >
                <template v-slot:no-option>
                    <q-item>
                        <q-item-section class="text-grey">
                            No results
                        </q-item-section>
                    </q-item>
                </template>
            </q-select>
        </div>
    </div>
    <div class="row">
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
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6  q-pa-xs">
            <q-input
                    outlined
                    v-model="searchParams.keywords"
                    label="Cuvinte cheie"
                    type="textarea"
                    lazy-rules
                    rows="1"
                    dense
                    :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
            />
        </div>
    </div>

    <div style="display: flex;width:100%;justify-content: center;">
        <q-btn color="blue" label="Reseteaza filtrul!" v-show="visibleResetBtn" size="sm" no-caps  @click="resetSearchParams" style="min-width: 150px;" />
    </div>

    <br>
    <TableDocuments accesFrom="search" :searchParams="searchParams" :withSearchInput="false"/>

    <q-dialog v-model="viewDialogSelectDepartament" position="top">
        <q-card style="min-width: 70vw;"
                v-bind:class="{ 'partial80_height': $q.platform.is.mobile, 'partial60_height': $q.platform.is.desktop }"
        >
            <div style="display:flex;justify-content: flex-end;">
                <span class="material-icons cursor-pointer" @click="viewDialogSelectDepartament=false" style="color:#747474;font-weight: bolder;font-size: 1.5em;">close</span>
            </div>

            <q-card-section>
                <ComboDepartamente :selectDepartament="selectDepartament" :selectDivizie="selectDivizie" title="Selectati directia sau departamentul" />
            </q-card-section>
        </q-card>
    </q-dialog>
</div>
</template>


<script lang="ts" src="./Search.ts" />

<style scoped>

</style>
