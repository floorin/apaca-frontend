<template>
<div class="q-pa-md" style="width: 100%;">
    <q-form
            @submit="onSubmit"
            @reset="onReset"
            class="q-gutter-md"
    >
    <div v-if="$q.platform.is.desktop" class="padding_form_document" style="margin-top:2vh;">
    <div class="row">
        <span class="col-2 form__label">Registru</span>
        <q-select class="col-10" outlined v-model="docApp.id_registru" :options="optionsRegistre" style="max-height: 7vh;;"
                  option-value="id_registru"
                  option-label="den_registru_lang_1"
                  emit-value
                  map-options
                  lazy-rules
                  dense
                  :content-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                  :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                  :rules="[ val => val && val > 0 || 'Alegeti registrul!']"
        />
    </div>

    <div class="row">
        <span class="col-2 form__label">Categorie document</span>
        <q-select class="col-10" outlined v-model="docApp.id_categ" :options="optionsCategorii" style="max-height: 7vh;;"
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
        <span class="col-2 form__label">Tip document</span>
        <q-select class="col-10" outlined v-model="docApp.id_tip_document" :options="filteredOptionTipDoc" style="max-height: 7vh;;"
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

    <div class="row">
        <span class="col-2 form__label">Categorie solicitant</span>
        <q-select class="col-10" outlined v-model="docApp.categorie_solicitant" :options="optionsTipSolicitant" style="max-height: 7vh;;"
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  lazy-rules
                  dense
                  :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                  :rules="[ val => val && val.length > 0 || 'Alegeti categoria din care face parte solicitantul!']"
        />
    </div>

    <div class="row">
        <span class="col-2 form__label">Nume prenume</span>
        <q-input
                class="col-10"
                outlined
                style="max-height: 7vh;;"
                v-model="docApp.nume_denumire"
                lazy-rules
                dense
                debounce="500"
                @keydown.enter.prevent="focusOnCui"
                no-parent-event
                ref="refNumePrenume"
                @input="inputNumePrenume"
                :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                :rules="[ val => val && val.length > 0 || 'Completati numele / denumirea solicitantului']"
        >
            <q-popup-proxy ref="refOptionsNumePrenume" no-parent-event @show="putFocusBackToNumePrenume">
                <q-banner>
                   <div v-for="option in optionsSolicitanti" class="cursor-pointer options_solicitanti" @click="selectSolicitantFromOption(option)">
                       {{option.nume_denumire}}<br>
                       <span class="text__label--thin">cui:{{option.cui}}</span>
                   </div>
                    <div v-if="optionsSolicitanti.length==0 && !auTrecut2SecundeDeLaUltimulSearch" style="min-width: 30vw; color:#c5cae9;font-size:0.7em;">nu exista optiuni</div>
                </q-banner>
            </q-popup-proxy>
        </q-input>
    </div>

    <div class="row">
        <span class="col-2 form__label">CNP / CUI</span>
        <q-input
                class="col-10"
                outlined
                style="max-height: 7vh;"
                v-model="docApp.cui"
                @keydown.enter.prevent="focusOnEmail"
                ref="refCui"
                lazy-rules
                dense
                :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                :rules="[ val => !val || val.length <=13  || 'Maxim 13 caractere']"
        />
    </div>

    <div class="row">
            <span class="col-2 form__label">Email solicitant</span>
            <q-input
                    class="col-10"
                    outlined
                    type="email"
                    style="max-height: 7vh;"
                    v-model="docApp.email_solicitant"
                    @keydown.enter.prevent="focusOnTitlu"
                    ref="refEmailSolicitant"
                    lazy-rules
                    dense
                    :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                    :rules="[ val => !val || (val.length <=50 && ValidateEmail(val)) || 'Introduceti adresa de mail valida']"
            />
        </div>

    <div class="row">
        <span class="col-2 form__label">Titlu</span>
        <q-input
                class="col-10"
                outlined
                style="max-height: 7vh;"
                v-model="docApp.titlu"
                ref="refTitlu"
                @keydown.enter.prevent="focusOnDescriere"
                counter
                maxlength="100"
                lazy-rules
                dense
                :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                :rules="[ val => val && val.length > 0 || 'Completati titlul!']"
        />
    </div>

    <div class="row">
        <span class="col-2 form__label">Descriere</span>
            <q-input
                class="col-10"
                outlined
                style="max-height: 12vh;"
                v-model="docApp.descriere"
                type="textarea"
                ref="refDescriere"
                lazy-rules
                counter
                maxlength="800"
                rows="3"
                dense
                :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                :rules="[ val => val && val.length > 0 || 'Completati descrierea!']"
        />
    </div>

    <div class="row" style="margin-bottom: 20px;">
        <span class="col-2 form__label">Document</span>
        <div class="row col-10">
            <div class="col-12 col-md-8">
                <q-input
                        outlined
                        v-model="docApp.nr_inreg"
                        label="Numar"
                        lazy-rules
                        dense
                        :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                />
            </div>
            <div class="col-12 col-md-4">
                <div style="min-width: 200px;max-width: 200px;">
                <q-input outlined v-model="docApp.data_inreg" dense mask="##.##.####"
                             label="Data"
                             :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                    >
                        <q-popup-proxy ref="qDateProxy0" transition-show="scale" transition-hide="scale">
                            <q-date v-model="docApp.data_inreg" mask="DD.MM.YYYY"  @input="() => $refs.qDateProxy0.hide()" :locale="myLocale" />
                        </q-popup-proxy>
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer"></q-icon>
                        </template>
                    </q-input>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <span class="col-2 form__label">Numar file</span>
        <q-input
                class="col-10"
                outlined
                dense
                type="number"
                v-model="docApp.nr_file"
                lazy-rules
                size="sm"
                style="max-width: 100px;max-height: 7vh;"
        />
    </div>

        <div class="row">
            <span class="col-2 form__label">Departament</span>
            <q-input
                    class="col-10"
                    outlined
                    style="max-height: 7vh;;"
                    v-model="docApp.den_org_init"
                    lazy-rules
                    dense
                    readonly
                    no-parent-event
                    ref="refOrgRepartizare"
                    @click="inputOrgRepartizare"
                    :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
            >
            </q-input>
        </div>

        <div class="row">
            <div class="col-2">
                <q-toggle v-model="existaReferinta" label="Exista referinta" class="q-mb-md" />
            </div>
            <div class="col-10">
            <div class="row" v-show="existaReferinta">
                <div class="col">
                    <q-select outlined v-model="docApp.ref_id_registru" :options="optionsRegistre" label="Registru referinta"
                              option-value="id_registru"
                              option-label="den_registru_lang_1"
                              emit-value
                              map-options
                              lazy-rules
                              dense
                              :content-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder', maxHeight: '6vh' }"
                              :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                    />
                </div>
                <div class="col">
                    <q-input
                            outlined
                            v-model="docApp.ref_nr_doc"
                            label="Numar document referinta"
                            lazy-rules
                            dense
                            :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                    />
                </div>
                <div class="col">
                    <div style="max-width: 200px">
                    <q-input outlined v-model="docApp.ref_data_doc" dense mask="##.##.####"
                             label="Data document referinta"
                             :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                    >
                        <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
                            <q-date v-model="docApp.ref_data_doc" mask="DD.MM.YYYY"  @input="() => $refs.qDateProxy1.hide()" :locale="myLocale" />
                        </q-popup-proxy>
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer"></q-icon>
                        </template>
                    </q-input>
                    </div>
                </div>
            </div>
            </div>
        </div>
        </div>
        <div v-else>
            <q-select outlined v-model="docApp.id_registru" :options="optionsRegistre" label="Registru"
                      option-value="id_registru"
                      option-label="den_registru_lang_1"
                      emit-value
                      map-options
                      lazy-rules
                      dense
                      :content-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                      :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                      :rules="[ val => val && val > 0 || 'Alegeti registrul!']"
            />

            <q-select outlined v-model="docApp.id_categ" :options="optionsCategorii" label="Categorie document"
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
            <q-select outlined v-model="docApp.id_tip_document" :options="filteredOptionTipDoc" label="Tip document"
                      option-value="id_tip_doc"
                      option-label="den_lang_1"
                      emit-value
                      map-options
                      lazy-rules
                      dense
                      :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                      :rules="[ val => val && val > 0 || 'Alegeti tipul documentului!']"
            />
            <q-select outlined v-model="docApp.categorie_solicitant" :options="optionsTipSolicitant" label="Categorie solicitant"
                      option-value="value"
                      option-label="label"
                      emit-value
                      map-options
                      lazy-rules
                      dense
                      :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                      :rules="[ val => val && val.length > 0 || 'Alegeti categoria din care face parte solicitantul!']"
            />
            <q-input
                    outlined
                    v-model="docApp.nume_denumire"
                    label="Nume prenume / denumire solicitant"
                    lazy-rules
                    dense
                    debounce="500"
                    no-parent-event
                    ref="refNumePrenume"
                    @input="inputNumePrenume"
                    :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                    :rules="[ val => val && val.length > 0 || 'Completati numele / denumirea solicitantului']"
            >
                <q-popup-proxy ref="refOptionsNumePrenume" no-parent-event @show="putFocusBackToNumePrenume">
                    <q-banner>
                        <div v-for="option in optionsSolicitanti" class="cursor-pointer options_solicitanti" @click="selectSolicitantFromOption(option)">
                            {{option.nume_denumire}}<br>
                            <span class="text__label--thin">cui:{{option.cui}}</span>
                        </div>
                        <div v-if="optionsSolicitanti.length==0 && !auTrecut2SecundeDeLaUltimulSearch" style="min-width: 30vw; color:#c5cae9;font-size:0.7em;">nu exista optiuni</div>
                    </q-banner>
                </q-popup-proxy>
            </q-input>

            <q-input
                    outlined
                    v-model="docApp.cui"
                    label="CNP / CUI"
                    lazy-rules
                    dense
                    :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                    :rules="[ val => !val || val.length <=13  || 'Maxim 13 caractere']"
            />

            <q-input
                    outlined
                    v-model="docApp.email_solicitant"
                    label="Email solicitant"
                    lazy-rules
                    dense
                    type="email"
                    :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                    :rules="[ val => !val || val.length <=50  || 'Maxim 50 caractere']"
            />

            <q-input
                    outlined
                    v-model="docApp.titlu"
                    label="Titlu"
                    counter
                    maxlength="100"
                    lazy-rules
                    dense
                    :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                    :rules="[ val => val && val.length > 0 || 'Completati titlul!']"
            />
            <q-input
                    outlined
                    v-model="docApp.descriere"
                    label="Descriere"
                    type="textarea"
                    lazy-rules
                    counter
                    maxlength="800"
                    rows="3"
                    dense
                    :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                    :rules="[ val => val && val.length > 0 || 'Completati descrierea!']"
            />
            <div class="row">
                <div class="col-12 col-md-10">
                    <q-input
                            outlined
                            v-model="docApp.nr_inreg"
                            label="Numar document"
                            lazy-rules
                            dense
                            :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                    />
                </div>
                <div class="col-12 col-md-2">
                    <div style="max-width: 200px">
                        <q-input outlined v-model="docApp.data_inreg" dense mask="##.##.####"
                                 label="Data document"
                                 :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                        >
                            <q-popup-proxy ref="qDateProxy0" transition-show="scale" transition-hide="scale">
                                <q-date v-model="docApp.data_inreg" mask="DD.MM.YYYY"  @input="() => $refs.qDateProxy0.hide()" :locale="myLocale" />
                            </q-popup-proxy>
                            <template v-slot:append>
                                <q-icon name="event" class="cursor-pointer"></q-icon>
                            </template>
                        </q-input>
                    </div>
                </div>
            </div>

            <q-input
                    outlined
                    type="number"
                    v-model="docApp.nr_file"
                    label="Numar file"
                    lazy-rules
            />

            <q-input
                    class="col-10"
                    outlined
                    label="Departament"
                    style="max-height: 7vh;"
                    v-model="docApp.den_org_init"
                    lazy-rules
                    dense
                    readonly
                    no-parent-event
                    @click="inputOrgRepartizare"
                    :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
            >
            </q-input>

            <div class="row">
                <div class="col-2">
                    <q-toggle v-model="existaReferinta" label="Exista referinta" class="q-mb-md" />
                </div>
                <div class="col-10">
                    <q-expansion-item v-model="existaReferinta">
                        <q-card>
                            <q-card-section>
                                <div class="row">
                                    <div class="col">
                                        <q-select outlined v-model="docApp.ref_id_registru" :options="optionsRegistre" label="Registru referinta"
                                                  option-value="id_registru"
                                                  option-label="den_registru_lang_1"
                                                  emit-value
                                                  map-options
                                                  lazy-rules
                                                  dense
                                                  :content-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                                                  :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                                        />
                                    </div>
                                    <div class="col">
                                        <q-input
                                                outlined
                                                v-model="docApp.ref_nr_doc"
                                                label="Numar document referinta"
                                                lazy-rules
                                                dense
                                                :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                                        />
                                    </div>
                                    <div class="col">
                                        <div style="max-width: 200px">
                                            <q-input outlined v-model="docApp.ref_data_doc" dense mask="##.##.####"
                                                     label="Data document referinta"
                                                     :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                                            >
                                                <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
                                                    <q-date v-model="docApp.ref_data_doc" mask="DD.MM.YYYY"  @input="() => $refs.qDateProxy1.hide()" :locale="myLocale" />
                                                </q-popup-proxy>
                                                <template v-slot:append>
                                                    <q-icon name="event" class="cursor-pointer"></q-icon>
                                                </template>
                                            </q-input>
                                        </div>
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </q-expansion-item>
                </div>
            </div>
        </div>

        <div class="padding_form_document" style="width: 100%; text-align: right; margin-top:0px;margin-bottom:0px;">
            <q-btn label="Reseteaza" type="reset" color="primary" flat class="q-ml-sm" />
            <q-btn label="Genereaza numar nou" type="submit" color="primary" :disable="savingDocument"/>
        </div>
    </q-form>

    <q-dialog v-model="viewDialogSelectDepartament" position="bottom">
        <q-card style="min-width: 70vw;"
                v-bind:class="{ 'partial80_height': $q.platform.is.mobile, 'partial60_height': $q.platform.is.desktop }"
        >
            <div style="display:flex;justify-content: flex-end;">
                <span class="material-icons cursor-pointer" @click="viewDialogSelectDepartament=false" style="color:#747474;font-weight: bolder;font-size: 1.5em;">close</span>
            </div>

            <q-card-section>
                <ComboDepartamente :selectDepartament="selectDepartament" :selectDivizie="doNothing" title="Selectati departamentul" />
            </q-card-section>
        </q-card>
    </q-dialog>
</div>
</template>


<script lang="ts" src="./Intrare.ts" />

<style scoped>
    .q-field--with-bottom {
        padding-bottom: 20px;
    }

    .q-field__native{
        font-family: "Nunito Sans";
        font-weight: bolder;
        padding:0px;
    }
/*
    .q-field__native, .q-field__prefix, .q-field__suffix, .q-field__input{
        padding:0px !important;
    }
    .q-field__control-container, .col.relative-position, .row, .no-wrap, .q-anchor--skip{
        padding:10px;
        max-height: 7vh;
    }
 */
</style>
