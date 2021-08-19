<template>
    <div class="q-pa-sm">
        <q-spinner-gears
                v-if="loadingDocumentData"
                color="primary"
                size="4em"
                class="absolute-center"
        />
        <div v-else>
            <div  class="well well-sm">
                <div class="panel">
                    <div class="panel-body" style="display:flex; align-items:center;">
                        <div style="min-width: 90px; min-height: 90px;"><img :src="getLinkToQrCode" /></div>
                        <div style="display: flex;flex-direction: column">
                            <div
                                    v-bind:class="{ 'column': $q.platform.is.mobile, 'row': $q.platform.is.desktop }"
                            >
                                <span class="text__title--medium">Numar intrare</span>
                                <span class="text__title--medium">{{docApp.id_doc}} / {{displayDataDoc()}}</span>
                            </div>
                            <q-btn color="white" size="md" text-color="black" icon-right="print" label="Tipareste!" :disable="loadingPdfForDownload" no-caps :loading="loadingPdfForDownload" @click="prepareCoverPdfForDownload" >
                                <template v-slot:loading>
                                    <q-spinner-gears class="on-right" />
                                    Pregatire...
                                </template>
                            </q-btn>
                        </div>
                        <div style="margin-left: auto; min-height: 90px;display: flex;position: relative; top:-20px;">
                           <ExpeditiiDocument :appid="appid"/>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-7">
                        <table class="table table-condensed">
                    <tbody>
                    <tr>
                        <td class="text__title--medium">
                            Tip inregistrare:
                        </td>
                        <td class="text__input--medium bg-white">
                            {{docApp.tip_request}}
                        </td>
                    </tr>
                    <tr>
                        <td class="text__title--medium">
                            <div style="display: flex;"><span>Tip document:</span>
                            <q-btn v-if="user.is_admin=='y' && withFinalizeButton=='yes'" icon="create" flat size="sm" color="red" style="margin-left: auto;">
                                <q-popup-proxy ref="changeTipDocProxy">
                                    <ChangeTipDocument :appid="appid" :prop_id_registru="docApp.id_registru" :prop_id_categ="docApp.id_categ" :prop_id_tip_doc="docApp.id_tip_document" :frenuntModificareTipDoc="frenuntModificareTipDoc" :fModificareTipDoc="fModificareTipDoc" />
                                </q-popup-proxy>
                            </q-btn>
                            </div>
                        </td>
                        <td class="text__input--medium bg-white">
                            {{getDenTipDocument(docApp.id_tip_document)}}
                        </td>
                    </tr>
                    <tr>
                        <td class="text__title--medium">
                            Numar document:
                        </td>
                        <td class="text__input--medium bg-white">
                            {{docApp.id_doc}}
                        </td>
                    </tr>
                    <tr>
                        <td class="text__title--medium">
                            <div style="display: flex;">
                                <span>Nume prenume:</span>
                                <span v-if="withFinalizeButton=='yes'" class="material-icons" style="margin-left: auto;">create</span>
                            </div>
                        </td>
                        <td class="text__input--medium bg-white">
                            {{docApp.nume_denumire}}
                            <q-popup-edit v-if="withFinalizeButton=='yes'" v-model="docApp.nume_denumire" :validate="val => val.length > 3">
                                <template v-slot="{ initialValue, value, emitValue, validate, set, cancel }">
                                    <q-input
                                            autofocus
                                            dense
                                            style="min-width:300px;"
                                            :value="docApp.nume_denumire"
                                            hint="Modificare nume / denumire"
                                            :rules="[val => validate(value) || 'Minim 3 caractere']"
                                            @input="emitValue"
                                    >
                                        <template v-slot:after>
                                            <q-btn flat dense color="negative" icon="cancel" @click.stop="cancel" />
                                            <q-btn flat dense color="positive" icon="check_circle" @click.stop="tryUpdateNumeDenumire(set)" :disable="validate(value) === false || initialValue === value" />
                                        </template>
                                    </q-input>
                                </template>
                            </q-popup-edit>
                        </td>
                    </tr>
                    <tr>
                        <td class="text__title--medium">
                            <div style="display: flex;">
                                <span>CNP/CUI:</span>
                                <span v-if="withFinalizeButton=='yes'" class="material-icons" style="margin-left: auto;">create</span>
                            </div>
                        </td>
                        <td class="text__input--medium bg-white">
                            {{docApp.cui}}
                            <q-popup-edit v-if="withFinalizeButton=='yes'" v-model="docApp.cui" :validate="val => val.length <= 13">
                                <template v-slot="{ initialValue, value, emitValue, validate, set, cancel }">
                                    <q-input
                                            autofocus
                                            dense
                                            style="min-width:300px;"
                                            :value="docApp.cui"
                                            hint="Modificare cod identificare fiscala"
                                            :rules="[val => validate(value) || 'Maxim 13 caractere']"
                                            @input="emitValue"
                                    >
                                        <template v-slot:after>
                                            <q-btn flat dense color="negative" icon="cancel" @click.stop="cancel" />
                                            <q-btn flat dense color="positive" icon="check_circle" @click.stop="tryUpdateCui(set)" :disable="validate(value) === false || initialValue === value" />
                                        </template>
                                    </q-input>
                                </template>
                            </q-popup-edit>
                        </td>
                    </tr>
                    <tr v-if="docApp.tip_request=='intrare' || docApp.tip_request=='iesire'">
                        <td class="text__title--medium">
                            <div style="display: flex;">
                                <span>Email solicitant:</span>
                                <span v-if="withFinalizeButton=='yes'" class="material-icons" style="margin-left: auto;">create</span>
                            </div>
                        </td>
                        <td class="text__input--medium bg-white">
                            {{docApp.email_solicitant}}
                            <q-popup-edit v-if="withFinalizeButton=='yes'" v-model="docApp.email_solicitant" :validate="val => val && val.length <= 50">
                                <template v-slot="{ initialValue, value, emitValue, validate, set, cancel }">
                                    <q-input
                                            autofocus
                                            dense
                                            type="email"
                                            style="min-width:300px;"
                                            :value="docApp.email_solicitant"
                                            hint="Modificare adresa email"
                                            :rules="[val => validate(value) || 'Maxim 50 caractere']"
                                            @input="emitValue"
                                    >
                                        <template v-slot:after>
                                            <q-btn flat dense color="negative" icon="cancel" @click.stop="cancel" />
                                            <q-btn flat dense color="positive" icon="check_circle" @click.stop="tryUpdateEmail(set)" :disable="validate(value) === false || initialValue === value" />
                                        </template>
                                    </q-input>
                                </template>
                            </q-popup-edit>
                        </td>
                    </tr>
                    <tr>
                        <td class="text__title--medium">
                            <div style="display: flex;">
                                <span>Titlu:</span>
                                <span v-if="withFinalizeButton=='yes'" class="material-icons" style="margin-left: auto;">create</span>
                            </div>
                        </td>
                        <td class="text__input--medium bg-white">
                            {{docApp.titlu}}
                            <q-popup-edit v-if="withFinalizeButton=='yes'" v-model="docApp.titlu" :validate="val => val.length > 3 && val.length <= 100">
                                <template v-slot="{ initialValue, value, emitValue, validate, set, cancel }"  >
                                    <q-input
                                            autofocus
                                            dense
                                            style="min-width:400px;"
                                            :value="docApp.titlu"
                                            hint="Modificare titlu"
                                            :rules="[val => validate(value) || 'Intre 3 si 100 de carcatere']"
                                            @input="emitValue"
                                    >
                                        <template v-slot:after>
                                            <q-btn flat dense color="negative" icon="cancel" @click.stop="cancel" />
                                            <q-btn flat dense color="positive" icon="check_circle" @click.stop="tryUpdateTitlu(set)" :disable="validate(value) === false || initialValue === value" />
                                        </template>
                                    </q-input>
                                </template>
                            </q-popup-edit>
                        </td>
                    </tr>
                    <tr>
                        <td class="text__title--medium">
                            <div style="display: flex;">
                                <span>Descriere:</span>
                                <span v-if="withFinalizeButton=='yes'" class="material-icons" style="margin-left: auto;">create</span>
                            </div>
                        </td>
                        <td class="text__input--medium bg-white">
                            {{docApp.descriere}}
                            <q-popup-edit v-if="withFinalizeButton=='yes'" v-model="docApp.descriere" :validate="val => val.length > 3 && val.length <= 800">
                                <template v-slot="{ initialValue, value, emitValue, validate, set, cancel }">
                                    <q-input
                                            autofocus
                                            dense
                                            type="textarea"
                                            :value="docApp.descriere"
                                            style="min-width:400px;"
                                            hint="Modificare descriere"
                                            :rules="[val => validate(value) || 'Intre 3 si 800 de caractere']"
                                            @input="emitValue"
                                    >
                                        <template v-slot:after>
                                            <q-btn flat dense color="negative" icon="cancel" @click.stop="cancel" />
                                            <q-btn flat dense color="positive" icon="check_circle" @click.stop="tryUpdateDescriere(set)" :disable="validate(value) === false || initialValue === value" />
                                        </template>
                                    </q-input>
                                </template>
                            </q-popup-edit>
                        </td>
                    </tr>
                    <tr>
                        <td class="text__title--medium">
                            <div style="display: flex;">
                                <span>Numar file::</span>
                                <span v-if="withFinalizeButton=='yes'" class="material-icons" style="margin-left: auto;">create</span>
                            </div>
                        </td>
                        <td class="text__input--medium bg-white">
                            {{docApp.nr_file}}
                            <q-popup-edit v-if="withFinalizeButton=='yes'" v-model="docApp.nr_file" >
                                <template v-slot="{ initialValue, value, emitValue, validate, set, cancel }">
                                    <q-input
                                            autofocus
                                            dense
                                            type="number"
                                            :value="docApp.nr_file"
                                            style="min-width:200px;"
                                            hint="Modificare nr.file"
                                            :rules="[val => validate(value) || 'Completati numarul de file']"
                                            @input="emitValue"
                                    >
                                        <template v-slot:after>
                                            <q-btn flat dense color="negative" icon="cancel" @click.stop="cancel" />
                                            <q-btn flat dense color="positive" icon="check_circle" @click.stop="tryUpdateNrFile(set)" :disable="validate(value) === false || initialValue === value" />
                                        </template>
                                    </q-input>
                                </template>
                            </q-popup-edit>
                        </td>
                    </tr>
                    <tr v-if="docApp.tip_request=='intern'">
                        <td class="text__title--medium">
                            Persoana care a depus:
                        </td>
                        <td class="text__input--medium bg-white">
                            {{denPersoanaUtilizatorFromMarca(docApp.marca_user_deponent)}}
                        </td>
                    </tr>
                    <tr v-if="docApp.tip_request=='iesire' || docApp.tip_request=='intern'">
                        <td class="text__title--medium">
                            Departament initiator:
                        </td>
                        <td class="text__input--medium bg-white">
                            {{denDepartamentFromOrg(docApp.id_org_expeditor)}}
                        </td>
                    </tr>
                    <tr v-if="docApp.tip_request=='intrare' || docApp.tip_request=='intern'">
                        <td class="text__title--medium">
                            Departament destinatar:
                        </td>
                        <td class="text__input--medium bg-white">
                            {{denDepartamentFromOrg(docApp.id_org_destinatar_init)}}
                        </td>
                    </tr>
                    <tr v-if="docApp.ref_nr_doc && docApp.ref_nr_doc.length>0">
                        <td class="text__title--medium">
                            Referinta:
                        </td>
                        <td class="text__input--medium bg-white">
                            {{docApp.ref_nr_doc}} /{{displayDataRef()}}
                        </td>
                    </tr>
                    <tr>
                        <td class="text__title--medium">
                            <div style="display: flex;">
                                <span>Repartizat la:</span>
                                <span v-if="user.is_admin=='y' && docApp.este_repartizat=='y'" class="material-icons cursor-pointer" style="margin-left: auto;color: red; font-size: 1.5rem;" @click="askIfDeleteRepartizare">delete_forever</span>
                            </div>
                            <span v-if="docApp.data_repartizare && docApp.data_repartizare.length>0">in {{displayDataRepartizare()}}</span>
                        </td>
                        <td class="text__input--medium bg-white">
                            <q-linear-progress v-if="loadingRepartizari" query track-color="orange" color="purple" class="q-mt-sm"  />
                            <div v-else style="display: flex; align-items: center;flex-wrap: wrap;"
                                  v-bind:class="{ 'lista_departamente_de_repartizat-mobile': $q.platform.is.mobile, 'lista_departamente_de_repartizat-desktop': $q.platform.is.desktop }"
                            >
                                <div v-for="(repartizare,index) in repartizari" class="departament_repartizat">
                                    <div>{{repartizare.divizie}} / {{repartizare.departament}}</div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    </tbody>

                </table>
                    </div>
                    <div class="col-md-5" style="padding-left:2em;display: flex;flex-direction:column; justify-content: flex-start; align-items: center;">
                        <div style="display: flex;align-items: center;justify-content: center; width: 100%;">
                            <div>
                                <span class="text__title--big">Documente Originale</span>
                                <div v-show="scans.length==0 && !uploadingFileToServer" class="text__label--thin" style="width: 100%; text-align: center;">Nimic atasat</div>
                                <div v-show="scans.length==0">Pentru a finaliza inregistrarea este necesara incarcarea fisierului cu documentul scanat.</div>
                            </div>
                            <div  v-if="user.auth_for_upload_scan=='y' ">
                                <q-btn flat color="primary" icon="add_box" no-caps size="lg" @click="openFormUploadFile" >
                                    <q-tooltip
                                            transition-show="rotate"
                                            transition-hide="rotate"
                                    >
                                        Incarca document nou
                                    </q-tooltip>
                                </q-btn>
                            </div>
                        </div>
                        <div style="display: flex;justify-content: center;">
                            <q-spinner
                                    v-if="uploadingFileToServer"
                                    color="primary"
                                    size="3em"
                                    :thickness="10"
                            />
                            <table v-else class="table table-bordered table-condensed table-responsive" style="width: 100%; max-height: 50vh;">
                                <tbody>
                                    <tr v-for="scan in scans">
                                        <td>
                                            <span v-if="user.is_admin=='y' || !isRepartizat" class="material-icons cursor-pointer" style="color: red; font-size: 1.5rem;" @click="askIfRemoveScan(scan)">delete_forever</span>
                                        </td>
                                        <td>
                                            {{scan.file_ext}}
                                        </td>
                                        <td>
                                            {{humanReadableBytes(scan.file_size)}}
                                        </td>
                                        <td>
                                            <div class="desktop-only" style="max-width:30vw;">{{scan.description}}</div>
                                            <div class="mobile-only">{{scan.description}}</div>
                                        </td>
                                        <td>
                                            <q-btn round color="black" icon="cloud_download" size="xs"/>
                                            <q-menu
                                                    transition-show="scale"
                                                    transition-hide="scale"
                                            >
                                                <DialogOpenScan :appid="scan.appid"/>
                                            </q-menu>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div style="width:100%;display: flex; justify-content: flex-end;" v-if="withFinalizeButton=='yes' && !isFinalizat">
                <q-btn v-show="scans.length>0" color="teal" size="md" text-color="white" icon-right="bookmark_border" label="Finalizeaza inregistrarea!" no-caps @click="finalizeazaInregistrareDocument" ></q-btn>
            </div>
        </div>


    <div v-if="withRepartizareButton=='yes' && !isRepartizat">
            <q-btn v-show="!nuSeRepartizeaza" outline size="sm" color="primary" label="Adauga departament repartizare" icon="add" @click="openFormAddDepartamentRepartizare" />
            <q-checkbox keep-color v-model="nuSeRepartizeaza" label="Nu se repartizeaza" color="orange" @input="onChangeNuSeRepartizeaza" />
            <br />
            <div  style="display: flex; align-items: center;flex-wrap: wrap;"
                  v-bind:class="{ 'lista_departamente_de_repartizat-mobile': $q.platform.is.mobile, 'lista_departamente_de_repartizat-desktop': $q.platform.is.desktop }"
                >
                <div v-for="(organizatie,index) in listaOrganizatiiPentruRepartizare" class="departament_repartizat">
                    <div>{{organizatie.divizie}} / {{organizatie.departament}}</div>
                    <span class="material-icons cursor-pointer"
                            @click="removeDepartamentRepartizare(index)"
                          style="color: red; font-weight: bold;position: relative; top:-5px; right:-5px;">
                                                <q-tooltip
                                                        transition-show="rotate"
                                                        transition-hide="rotate"
                                                >
                                Sterge departamentul din repartizare
                            </q-tooltip>close</span>
                </div>
                <q-linear-progress query track-color="orange" color="purple" class="q-mt-sm" v-show="showVisualEffectAddingDepartament" />
            </div>
        <div v-show="listaOrganizatiiPentruRepartizare.length>0 && !isRepartizat" style="margin-top:10px; width:100%;display: flex; justify-content: flex-end;" >
            <q-btn color="teal" size="md" text-color="white" icon-right="device_hub" label="Repartizeaza documentul!" no-caps @click="repartizeazaDocument" ></q-btn>
        </div>
        <div id="div_btn_repartizeaza" style="margin-top:10px; "><br /></div>
    </div>
        <div v-else><q-checkbox v-show="docApp.finalizat_de_inregistrat=='y'" keep-color v-model="nuSeRepartizeaza" label="Nu se repartizeaza" :disable="user.is_admin!='y'"  color="orange" @input="onChangeNuSeRepartizeaza" /></div>


        <q-dialog v-model="dialogUploadFile" position="top">
            <q-card style="width: 350px">
                <q-linear-progress :value="0.6" color="pink" />

                <q-card-section class="column no-wrap">
                    <div class="text-weight-bold">Incarca fisier nou</div>
                    <div class="text-grey" style="margin-top: 4px; margin-bottom: 10px;"><q-input counter  outlined v-model="uploadScanTitle" label="Titlu document" dense maxlength="200" /></div>
                    <input v-show="uploadScanTitle.length>3" type="file" name="fileToUpload" id="fileToUpload" ref="myFileToUpload" @change="prepareForUpload($event)" style="margin-bottom: 10px;" />
                    <q-btn v-show="checkIfFileIsSelected" icon="cloud_upload" color="white" text-color="black" label="Salveaza pe server" @click="myUploadFile" :loading="uploadingFileToServer" style="margin-bottom: 5px;" />
                </q-card-section>
            </q-card>
        </q-dialog>

        <q-dialog v-model="dialogAddDepartamentRepartizare" position="bottom">
            <q-card style="min-width: 70vw;"
                    v-bind:class="{ 'partial80_height': $q.platform.is.mobile, 'partial60_height': $q.platform.is.desktop }"
            >
                <div style="display:flex;justify-content: flex-end;">
                    <span class="material-icons cursor-pointer" @click="dialogAddDepartamentRepartizare=false" style="color:#747474;font-weight: bolder;font-size: 1.5em;">close</span>
                </div>

                <q-card-section>
                    <q-input
                            class="col-10"
                            outlined
                            label="Cauta departament"
                            style="max-height: 7vh;"
                            v-model="textSearchDepartament"
                            lazy-rules
                            dense
                            debounce="500"
                            no-parent-event
                            ref="refOrgRepartizare"
                            @input="inputOrgRepartizare"
                            :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                    >
                    </q-input>
                    <div v-if="optionsOrganizatii.length==0 && !auTrecut2SecundeDeLaUltimulSearch" style="min-width: 30vw; color:#c5cae9;font-size:0.7em;">nu exista optiuni</div>
                    <div
                            v-bind:class="{ 'full_height-options_departamente': $q.platform.is.mobile, 'partial60_height-options_departamente': $q.platform.is.desktop }"
                            style="min-width: 50vw;overflow-y: auto;overflow-x: hidden;"
                    >
                            <div v-for="option in optionsOrganizatii" :key="option.appid"  class="cursor-pointer options_solicitanti" style="width:100%;" @click="selectOrganizatieFromOption(option)">
                                <span class="text__label--thin">{{option.divizie}}</span>
                                <br>
                                {{option.departament}}
                            </div>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>

    </div>
</template>

<script lang="ts" src="./WorkOnDocument.ts" />

<style scoped>
    .q-field--with-bottom {
        padding-bottom: 20px;
    }

    .q-field__native{
        font-family: "Nunito Sans";
        font-weight: bolder;
    }
</style>
