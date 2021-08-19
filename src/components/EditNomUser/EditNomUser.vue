<template>
<div class="q-pa-md" style="width: 100%;">
    <q-form
            @submit="onSubmit"
            class="q-gutter-md"
            ref="myForm"
    >
        <div class="row">
            <q-input
                    class="col-8"
                    outlined
                    label="Marca"
                    style="max-height: 7vh;"
                    type="number"
                    v-model="user.userid"
                    lazy-rules
                    dense
                    :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                    :rules="[ val => val && val.length > 0 || 'Completati marca/id-ul utilizatorului']"
            />
            <q-toggle
                    v-model="user.is_activ"
                    checked-icon="lock"
                    color="green"
                    label="Activ"
                    unchecked-icon="lock_open"
                    false-value="n"
                    true-value="y"
            />
        </div>
        <div class="row">
        <q-input
                class="col-10"
                outlined
                label="Prenume"
                style="max-height: 7vh;;"
                v-model="user.first_name"
                lazy-rules
                dense
                :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                :rules="[ val => val && val.length > 0 || 'Completati prenumele utilizatorului']"
        />
        </div>
        <div class="row">
            <q-input
                    class="col-10"
                    outlined
                    label="Nume"
                    style="max-height: 7vh;;"
                    v-model="user.last_name"
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
                    label="Email"
                    style="max-height: 7vh;"
                    type="email"
                    v-model="user.email_address"
                    lazy-rules
                    dense
                    :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                    :rules="[ val => val && val.length > 0 || 'Completati adresa de mail']"
            />
        </div>
        <div class="row">
            <q-input
                    class="col-10"
                    outlined
                    label="User wan"
                    style="max-height: 7vh;;"
                    v-model="user.user_wan"
                    lazy-rules
                    dense
                    :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                    :rules="[ val => val && val.length > 0 || 'Completati userul de wan']"
            />
        </div>
        <div class="row">
            <q-input
                    class="col-10"
                    outlined
                    label="Departament"
                    style="max-height: 7vh;"
                    v-model="user.den_org"
                    lazy-rules
                    readonly
                    dense
                    debounce="500"
                    no-parent-event
                    @click="inputOrgRepartizare"
                    :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
            />
        </div>
        <div class="row">
            <q-toggle
                    v-model="user.auth_todo_repartizare"
                    checked-icon="lock"
                    color="green"
                    label="Autorizat repartizare"
                    unchecked-icon="lock_open"
                    false-value="n"
                    true-value="y"
            />
            <q-toggle
                    v-model="user.auth_for_upload_scan"
                    checked-icon="lock"
                    color="green"
                    label="Autorizat scan"
                    unchecked-icon="lock_open"
                    false-value="n"
                    true-value="y"
            />
            <q-toggle
                    v-model="user.auth_toview_confidential"
                    checked-icon="lock"
                    color="green"
                    label="Autorizat confidential"
                    unchecked-icon="lock_open"
                    false-value="n"
                    true-value="y"
            />
        </div>
        <div class="row">
            <q-toggle
                    v-model="user.auth_for_input_intrare"
                    checked-icon="lock"
                    color="green"
                    label="Autorizat intrare"
                    unchecked-icon="lock_open"
                    false-value="n"
                    true-value="y"
            />
            <q-toggle
                    v-model="user.auth_for_input_intern"
                    checked-icon="lock"
                    color="green"
                    label="Autorizat interne"
                    unchecked-icon="lock_open"
                    false-value="n"
                    true-value="y"
            />
            <q-toggle
                    v-model="user.auth_for_input_exit"
                    checked-icon="lock"
                    color="green"
                    label="Autorizat iesiri"
                    unchecked-icon="lock_open"
                    false-value="n"
                    true-value="y"
            />
            <q-toggle
                    v-model="user.auth_for_expeditie"
                    checked-icon="lock"
                    color="green"
                    label="Autorizat expeditii"
                    unchecked-icon="lock_open"
                    false-value="n"
                    true-value="y"
            />
        </div>
        <br />
        <div class="absolute-bottom-right q-pa-sm">
            <q-btn label="Salveaza" type="submit" color="primary" size="sm"/>
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

<script lang="ts" src="./EditNomUser.ts" />

<style scoped>

</style>
