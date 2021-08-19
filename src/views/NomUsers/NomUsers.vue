<template>
    <div class="q-pa-md">
        <q-table
                v-if="$q.platform.is.mobile"
                grid
                :rows-per-page-options="[10, 20]"
                :data="tableDataNomUsers"
                :columns="columns"
                :visible-columns="visibleColumns"
                row-key="appid"
                :filter="filter"
                :loading="loadingData"
                :pagination.sync="myPagination"
        >

            <template v-slot:top>
                <q-btn flat color="primary" icon="add_box" no-caps size="lg" :disable="loadingData" @click="addRow" >
                    <q-tooltip
                            transition-show="rotate"
                            transition-hide="rotate"
                    >
                        Adauga utilizator nou
                    </q-tooltip>
                </q-btn>
                <q-space />
                <q-input dense debounce="300" color="primary" v-model="filter">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </template>

            <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
                    <q-card>
                        <q-card-section style="display: flex;">
                            <div>
                                {{ props.row.userid }}
                                <br><span class="text__title--big" style="color: black;">{{ props.row.last_name }} {{ props.row.first_name }}</span>
                                <span class="text__label--thin"> ({{ props.row.functie }})</span>
                                <br><span class="text__label--thin">{{ props.row.den_directie }}<br>{{ props.row.den_departament }}</span>
                            </div>
                        </q-card-section>
                        <q-separator />
                        <q-card-section class="flex" >
                            <div style="display: flex; flex-direction: column;">
                                <div>
                                    <q-toggle
                                        v-model="props.row.is_activ"
                                        checked-icon="lock"
                                        color="green"
                                        label="Activ"
                                        unchecked-icon="lock_open"
                                        false-value="n"
                                        true-value="y"
                                        @input="changeStatus('activ',props.row.is_activ,props.row.userid)"
                                    />
                                </div>
                                <div>
                                    <q-toggle
                                            v-model="props.row.auth_for_upload_scan"
                                            checked-icon="lock"
                                            color="blue"
                                            label="Autorizat scan"
                                            unchecked-icon="lock_open"
                                            false-value="n"
                                            true-value="y"
                                            @input="changeStatus('upload_scan',props.row.auth_for_upload_scan,props.row.userid)"
                                    />
                                </div>
                                <div>
                                    <q-toggle
                                            v-model="props.row.auth_todo_repartizare"
                                            checked-icon="lock"
                                            color="yellow"
                                            label="Autorizat repartizare"
                                            unchecked-icon="lock_open"
                                            false-value="n"
                                            true-value="y"
                                            @input="changeStatus('poate_repartiza',props.row.auth_todo_repartizare,props.row.userid)"
                                    />
                                </div>
                                <div>
                                    <q-toggle
                                            v-model="props.row.auth_toview_confidential"
                                            checked-icon="lock"
                                            color="red"
                                            label="Autorizat confidential"
                                            unchecked-icon="lock_open"
                                            false-value="n"
                                            true-value="y"
                                            @input="changeStatus('vede_confidentiale',props.row.auth_toview_confidential,props.row.userid)"
                                    />
                                </div>
                                <div>
                                    <q-toggle
                                            v-model="props.row.auth_for_input_intrare"
                                            checked-icon="lock"
                                            color="orange"
                                            label="Autorizat intrare"
                                            unchecked-icon="lock_open"
                                            false-value="n"
                                            true-value="y"
                                            @input="changeStatus('intrari',props.row.auth_for_input_intrare,props.row.userid)"
                                    />
                                </div>
                                <div>
                                    <q-toggle
                                            v-model="props.row.auth_for_input_intern"
                                            checked-icon="lock"
                                            color="orange"
                                            label="Autorizat interne"
                                            unchecked-icon="lock_open"
                                            false-value="n"
                                            true-value="y"
                                            @input="changeStatus('interne',props.row.auth_for_input_intern,props.row.userid)"
                                    />
                                </div>
                                <div>
                                    <q-toggle
                                            v-model="props.row.auth_for_input_exit"
                                            checked-icon="lock"
                                            color="orange"
                                            label="Autorizat iesiri"
                                            unchecked-icon="lock_open"
                                            false-value="n"
                                            true-value="y"
                                            @input="changeStatus('iesiri',props.row.auth_for_input_exit,props.row.userid)"
                                    />
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </template>
        </q-table>

        <q-table
                v-else
                    dense
                    :rows-per-page-options="[10, 20]"
                    :data="tableDataNomUsers"
                    :columns="columns"
                    :visible-columns="visibleColumns"
                    row-key="appid"
                    :filter="filter"
                    :loading="loadingData"
                    :pagination.sync="myPagination"
            >

                <template v-slot:top>
                    <q-btn flat color="primary" icon="add_box" no-caps size="lg" :disable="loadingData" @click="addRow" >
                        <q-tooltip
                                transition-show="rotate"
                                transition-hide="rotate"
                        >
                            Adauga utilizator nou
                        </q-tooltip>
                    </q-btn>
                    <q-btn color="black" label="Descarca XLS!" size="sm" no-caps :loading="ajaxGetXls" @click="getXls" style="min-width: 170px;margin:2px;">
                        <template v-slot:loading>
                            <q-spinner-gears class="on-right" />
                            Pregatire raport...
                        </template>
                    </q-btn>
                    <q-space />
                    <q-input dense debounce="300" color="primary" v-model="filter">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                </template>

                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="userid" :props="props">
                            <q-icon name="delete_forever" class="text-red cursor-pointer" style="font-size: 2rem;" @click="askIfDeleteUser(props.row)" />
                            {{ props.row.userid }}
                        </q-td>
                        <q-td key="first_name" :props="props">
                            <div style="font-weight: bolder;cursor: pointer;" @click="openDialogChangeNume(props.row)" >
                                <span class="material-icons" style="font-size:1em;">face</span> {{ props.row.last_name }} {{ props.row.first_name }}
                                <q-tooltip transition-show="scale" transition-hide="scale">Click pentru modificare nume</q-tooltip>
                            </div>
                            <div v-if="props.row.den_departament" class="span__repartizare" style="flex-direction: column;">
                            <div style="font-size: 0.7em;cursor: pointer;" @click="openWindowEditDepartament(props.row)">{{ props.row.den_departament }}</div>
                            <div style="font-size: 0.7em;cursor: pointer;" @click="openWindowEditDepartament(props.row)">{{ props.row.den_directie }}</div>
                                <q-tooltip transition-show="scale" transition-hide="scale">
                                    Click pentru modificare departament
                                </q-tooltip>
                            </div>
                            <div v-else>
                                <div style="font-size: 0.7em;cursor: pointer; background-color: #ebccd1;" class="span__repartizare"  @click="openWindowEditDepartament(props.row)">?lipsa departament
                                    <q-tooltip transition-show="scale" transition-hide="scale">
                                        Click pentru modificare departament
                                    </q-tooltip>
                                </div>
                            </div>
                        </q-td>
                        <q-td key="email_address" :props="props">
                            <div class="span__repartizare" style="cursor: pointer;" @click="askForModifyUserWan(props.row)">{{ props.row.user_wan }}
                                <q-tooltip transition-show="scale" transition-hide="scale">
                                    Click pentru modificare user de domeniu
                                </q-tooltip>
                            </div>
                            <div class="span__repartizare" style="cursor: pointer;" @click="askForModifyEmail(props.row)">{{ props.row.email_address }}
                                <q-tooltip transition-show="scale" transition-hide="scale" >
                                    Click pentru modificare adresa de email
                                </q-tooltip>
                            </div>
                        </q-td>
                        <q-td key="is_activ" :props="props">
                            <q-btn label="Registre" icon-right="style" @click="opendDialogEditGrantRegistre(props.row.userid)"/>
                        </q-td>
                        <q-td key="is_activ" :props="props">
                            <q-toggle
                                    v-model="props.row.is_activ"
                                    checked-icon="lock"
                                    color="green"
                                    label=""
                                    unchecked-icon="lock_open"
                                    false-value="n"
                                    true-value="y"
                                    @input="changeStatus('activ',props.row.is_activ,props.row.userid)"
                            />
                        </q-td>
                        <q-td key="auth_for_upload_scan" :props="props">
                            <q-toggle
                                    v-model="props.row.auth_for_upload_scan"
                                    checked-icon="lock"
                                    color="blue"
                                    label=""
                                    unchecked-icon="lock_open"
                                    false-value="n"
                                    true-value="y"
                                    @input="changeStatus('upload_scan',props.row.auth_for_upload_scan,props.row.userid)"
                            />
                        </q-td>
                        <q-td key="auth_todo_repartizare" :props="props">
                            <q-toggle
                                    v-model="props.row.auth_todo_repartizare"
                                    checked-icon="lock"
                                    color="yellow"
                                    label=""
                                    unchecked-icon="lock_open"
                                    false-value="n"
                                    true-value="y"
                                    @input="changeStatus('poate_repartiza',props.row.auth_todo_repartizare,props.row.userid)"
                            />
                        </q-td>
                        <q-td key="auth_toview_confidential" :props="props">
                            <q-toggle
                                    v-model="props.row.auth_toview_confidential"
                                    checked-icon="lock"
                                    color="red"
                                    label=""
                                    unchecked-icon="lock_open"
                                    false-value="n"
                                    true-value="y"
                                    @input="changeStatus('vede_confidentiale',props.row.auth_toview_confidential,props.row.userid)"
                            />
                        </q-td>
                        <q-td key="auth_for_input_intrare" :props="props">
                            <q-toggle
                                    v-model="props.row.auth_for_input_intrare"
                                    checked-icon="lock"
                                    color="orange"
                                    label=""
                                    unchecked-icon="lock_open"
                                    false-value="n"
                                    true-value="y"
                                    @input="changeStatus('intrari',props.row.auth_for_input_intrare,props.row.userid)"
                            />
                        </q-td>
                        <q-td key="auth_for_input_intern" :props="props">
                            <q-toggle
                                    v-model="props.row.auth_for_input_intern"
                                    checked-icon="lock"
                                    color="orange"
                                    label=""
                                    unchecked-icon="lock_open"
                                    false-value="n"
                                    true-value="y"
                                    @input="changeStatus('interne',props.row.auth_for_input_intern,props.row.userid)"
                            />
                        </q-td>
                        <q-td key="auth_for_input_exit" :props="props">
                            <q-toggle
                                    v-model="props.row.auth_for_input_exit"
                                    checked-icon="lock"
                                    color="orange"
                                    label=""
                                    unchecked-icon="lock_open"
                                    false-value="n"
                                    true-value="y"
                                    @input="changeStatus('iesiri',props.row.auth_for_input_exit,props.row.userid)"
                            />
                        </q-td>
                        <q-td key="auth_for_input_exit" :props="props">
                            <q-toggle
                                    v-model="props.row.auth_for_expeditie"
                                    checked-icon="lock"
                                    color="orange"
                                    label=""
                                    unchecked-icon="lock_open"
                                    false-value="n"
                                    true-value="y"
                                    @input="changeStatus('expeditie',props.row.auth_for_expeditie,props.row.userid)"
                            />
                        </q-td>
                        <q-td key="auth_for_search" :props="props">
                            <q-toggle
                                    v-model="props.row.auth_for_search"
                                    checked-icon="lock"
                                    color="orange"
                                    label=""
                                    unchecked-icon="lock_open"
                                    false-value="n"
                                    true-value="y"
                                    @input="changeStatus('search',props.row.auth_for_search,props.row.userid)"
                            />
                        </q-td>
                    </q-tr>
                </template>
            </q-table>
        <q-dialog v-model="visibleDialogEditUser" persistent >
            <q-card style="min-width: 60vw; max-width: 80vw;">
                <q-bar>
                    <q-icon name="add_box" />
                    <div>Editare utilizator</div>

                    <q-space />

                    <q-btn dense flat icon="close" v-close-popup>
                        <q-tooltip>Close</q-tooltip>
                    </q-btn>
                </q-bar>
                <q-card-section>
                    <EditNomUser :frenunt="renuntEditareUser" :fonsave="refreshDataTableNomUsers" v-bind:userid="userid"/>
                </q-card-section>
            </q-card>
        </q-dialog>

        <q-dialog v-model="dialogEditGrantRegistre">
            <q-card style="min-width: 400px;"
                    v-bind:class="{ 'partial80_height': $q.platform.is.mobile, 'partial60_height': $q.platform.is.desktop }"
            >
                <div style="display:flex;justify-content: flex-end;">
                    <span class="material-icons cursor-pointer" @click="dialogEditGrantRegistre=false" style="color:#747474;font-weight: bolder;font-size: 1.5em;">close</span>
                </div>

                <q-card-section>
                    <EditGrantRegistreUser :SelectHandler="askIfChangeDepartament" :userid="userIdToChange" />
                </q-card-section>
            </q-card>
        </q-dialog>

        <q-dialog v-model="dialogChangeDepartament" position="bottom">
            <q-card style="min-width: 70vw;"
                    v-bind:class="{ 'partial80_height': $q.platform.is.mobile, 'partial60_height': $q.platform.is.desktop }"
            >
                <div style="display:flex;justify-content: flex-end;">
                    <span class="material-icons cursor-pointer" @click="dialogChangeDepartament=false" style="color:#747474;font-weight: bolder;font-size: 1.5em;">close</span>
                </div>

                <q-card-section>
                    <ComboDepartamente :selectDepartament="askIfChangeDepartament" :selectDivizie="doNothing" title="Selectati departamentul din care face parte utilizatorul" />
                </q-card-section>
            </q-card>
        </q-dialog>

        <q-dialog v-model="dialogChangeNume" persistent>
            <q-card>
                <q-card-section class="row items-center">
                    <span class="material-icons" style="font-size:3em;">face</span>
                    <span class="q-ml-sm">Modificare nume si prenume utilizator</span>
                </q-card-section>
                <q-card-section>
                    <div class="row">
                        Marca {{userIdToChange}}
                    </div>
                    <div class="row">
                        <q-input
                                class="col-10"
                                outlined
                                label="Nume"
                                style="max-height: 7vh;;"
                                v-model="new_last_name"
                                lazy-rules
                                dense
                                :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                                :rules="[ val => val && val.length > 0 || 'Completati numele utilizatorului']"
                        />
                    </div>
                    <div class="row">
                        <q-input
                                class="col-10"
                                outlined
                                label="Prenume"
                                style="max-height: 7vh;;"
                                v-model="new_first_name"
                                lazy-rules
                                dense
                                :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                                :rules="[ val => val && val.length > 0 || 'Completati prenumele utilizatorului']"
                        />
                    </div>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat label="renunt" no-caps color="primary" v-close-popup />
                    <q-btn flat label="Salveaza" color="primary" @click="updateNume" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>


<script lang="ts" src="./NomUsers.ts" />

<style scoped>

</style>
