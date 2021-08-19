<template>
<div>
    <q-spinner-gears
            v-if="loadingExpeditii"
            color="primary"
            size="2em"
    />
    <div  v-else flat bordered>
        <q-card-section style="display: flex;">
            <div class="text__title--medium">Expeditii</div>
            <div style="margin-left: auto;">
                <div><span v-if="user.auth_for_expeditie=='y'" class="material-icons" style="font-size: 2em;cursor: pointer;">local_shipping
                            <q-tooltip
                                    v-if="user.auth_for_expeditie=='y'"
                                    transition-show="scale"
                                    transition-hide="scale"
                            >
                                                    Adauga expeditie
                                                </q-tooltip></span>
                    <q-popup-proxy v-if="user.auth_for_expeditie=='y'" ref="refNewExpeditie"  transition-show="scale" transition-hide="scale" style="min-width: 600px !important;" >
                        <q-card class="my-card" flat bordered >
                            <q-item>
                                <q-item-section>
                                    <q-item-label>Inregistrare Expeditie</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-separator />

                            <q-card-section horizontal>
                                <q-card-section>
                                    <table class="table table-condensed" style="min-width: 400px;">
                                        <tbody>
                                        <tr>
                                            <td>
                                                Numar
                                            </td>
                                            <td>
                                                <q-input
                                                        outlined
                                                        v-model="newExpeditie.awb_nr"
                                                        lazy-rules
                                                        counter
                                                        maxlength="30"
                                                        dense
                                                        :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Data
                                            </td>
                                            <td>
                                                <q-input outlined v-model="newExpeditie.awb_data" dense mask="##.##.####"
                                                         :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                                                         style="max-width: 150px;"
                                                >
                                                    <q-popup-proxy ref="qDateProxy0" transition-show="scale" transition-hide="scale">
                                                        <q-date v-model="newExpeditie.awb_data" mask="DD.MM.YYYY"  @input="() => $refs.qDateProxy0.hide()" :locale="myLocale" />
                                                    </q-popup-proxy>
                                                    <template v-slot:append>
                                                        <q-icon name="event" class="cursor-pointer"></q-icon>
                                                    </template>
                                                </q-input>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Detalii
                                            </td>
                                            <td>
                                                <q-input
                                                        class="col-10"
                                                        outlined
                                                        style="max-height: 10vh;"
                                                        v-model="newExpeditie.awb_detalii"
                                                        type="textarea"
                                                        lazy-rules
                                                        counter
                                                        maxlength="800"
                                                        rows="3"
                                                        dense
                                                        :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                                                />
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </q-card-section>
                            </q-card-section>
                            <q-separator />
                            <div class="absolute-bottom-right q-pa-sm">
                                <q-btn label="renunt" no-caps v-close-popup flat />
                                <q-btn label="Salveaza" type="submit" color="primary" @click="saveNewExpeditie" size="sm"/>
                            </div>
                        </q-card>
                    </q-popup-proxy>
                </div>
            </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
                <div>
                    <div v-if="arrExpeditii.length==0 && !loadingExpeditii" class="text__label--thin">Nicio expeditie</div>
                        <div style="display: flex; flex-direction: row; flex-wrap: wrap;min-height: 50px;max-height: 100px; max-width: 400px;width: 400px;overflow-y: scroll;">
                            <div v-for="(expeditie,index) in arrExpeditii" class="expeditie">
                                <span v-if="user.auth_for_expeditie=='y'" class="material-icons cursor-pointer"
                                      @click="removeExpeditie(expeditie,index)"
                                      style="color: red; font-weight: bold;position: relative; font-size: 1em; top:-5px; left:-5px;">
                                <q-tooltip
                                        transition-show="rotate"
                                        transition-hide="rotate"
                                >Sterge expeditia!</q-tooltip>close</span>
                                <div style="font-size: 0.8em;">{{expeditie.awb_nr}}/{{expeditie.awb_data}} {{expeditie.awb_detalii}}</div>
                            </div>
                        </div>
            </div>
        </q-card-section>
    </div>

</div>
</template>

<script lang="ts" src="./ExpeditiiDocument.ts" />

<style scoped>
    .q-field--with-bottom {
        padding-bottom: 20px;
    }

    .q-field__native{
        font-family: "Nunito Sans";
        font-weight: bolder;
    }

    .expeditie{
        display: flex;
        justify-content: flex-start;
        border: 1px solid #d9edf7;
        border-radius: 2px;
        margin: 2px 5px;
        padding: 2px;
    }
    .q-menu{
        width: 400px !important;

    }
</style>
