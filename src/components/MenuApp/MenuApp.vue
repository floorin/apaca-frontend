<template>
<div>
    <q-item clickable v-ripple @click="goToView('Dashboard')">
        <q-item-section avatar>
            <q-icon color="primary" name="dashboard" />
        </q-item-section>
        <q-item-section>
            <q-item-label>Dashboard
                <q-badge color="blue" transparent style="position: relative;top:-5px;">
                    {{nrOfMyDocuments}}
                </q-badge>
                <q-badge v-if="nrOfPendingToRegister>0" color="orange" transparent style="position: relative;top:-5px;left:5px;">
                    {{nrOfPendingToRegister}}
                </q-badge>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item v-if="user.auth_for_search=='y'" clickable v-ripple @click="goToView('Search')">
        <q-item-section avatar>
            <q-icon color="primary" name="search" />
        </q-item-section>
        <q-item-section>Cautare Avansata</q-item-section>
    </q-item>

    <q-separator v-if="user.auth_for_input_intrare=='y' || user.auth_for_input_exit=='y' || user.auth_for_input_intern=='y'"  inset />
    <q-item-label v-if="user.auth_for_input_intrare=='y' || user.auth_for_input_exit=='y' || user.auth_for_input_intern=='y'" header>Inregistrare documente</q-item-label>
    <q-item v-if="user.auth_for_input_intrare=='y'" clickable v-ripple @click="goToView('Intrare')">
        <q-item-section avatar>
            <q-icon color="primary" name="input" />
        </q-item-section>
        <q-item-section>Document Intrare</q-item-section>
    </q-item>

    <q-item  v-if="user.auth_for_input_exit=='y'" clickable v-ripple @click="goToView('Iesire')">
        <q-item-section avatar>
            <img src="/images/document_exit2.png">
        </q-item-section>
        <q-item-section>Document Iesire</q-item-section>
    </q-item>

    <q-item  v-if="user.auth_for_input_intern=='y'" clickable v-ripple @click="goToView('Intern')">
        <q-item-section avatar>
            <q-icon color="primary" name="system_update_alt" />
        </q-item-section>
        <q-item-section>Document Intern</q-item-section>
    </q-item>

    <q-separator inset />

    <q-item-label header>Actiuni</q-item-label>
    <q-item v-if="user.auth_todo_repartizare=='y'" clickable v-ripple @click="goToView('DeRepartizat')">
        <q-item-section avatar>
            <q-icon color="primary" name="device_hub" />
        </q-item-section>
        <q-item-section>
            <q-item-label>Repartizare Documente
                <q-badge v-if="nrDocumenteDeRepartizate>0" color="red" transparent style="position: relative;top:-5px;left:5px;">
                    {{nrDocumenteDeRepartizate}}
                </q-badge>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item  v-if="user.auth_todo_repartizare=='y'" clickable v-ripple @click="goToView('ToateRepartizate')">
        <q-item-section avatar>
            <q-icon color="primary" name="layers" />
        </q-item-section>
        <q-item-section>
            <q-item-label>Documente Repartizate
                <q-badge v-if="nrAllAllocatedDocs>0" color="green" transparent style="position: relative;top:-5px;left:5px;">
                    {{nrAllAllocatedDocs}}
                </q-badge>
            </q-item-label>
        </q-item-section>
    </q-item>


    <q-item v-if="user.auth_for_search=='y'" clickable v-ripple @click="goToView('Reports')">
        <q-item-section avatar>
            <q-icon color="primary" name="bubble_chart" />
        </q-item-section>
        <q-item-section>
            <q-item-label>Generare Rapoarte
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-separator v-if="user.is_admin=='y'" inset />

    <q-item-label v-if="user.is_admin=='y'" header>Nomenclatoare</q-item-label>
    <q-item v-if="user.is_admin=='y'" clickable v-ripple  @click="goToView('NomCateg')">
        <q-item-section avatar>
            <q-icon color="primary" name="insert_drive_file" />
        </q-item-section>
        <q-item-section>Categorii Documente</q-item-section>
    </q-item>

    <q-item v-if="user.is_admin=='y'" clickable v-ripple  @click="goToView('NomTipDoc')">
        <q-item-section avatar>
            <q-icon color="primary" name="description" />
        </q-item-section>
        <q-item-section>Tipuri Documente</q-item-section>
    </q-item>

    <q-item v-if="user.is_admin=='y'" clickable v-ripple @click="goToView('NomRegistre')">
        <q-item-section avatar>
            <q-icon color="primary" name="chrome_reader_mode" />
        </q-item-section>
        <q-item-section>Registre</q-item-section>
    </q-item>
<!--
    <q-item clickable v-ripple @click="goToView('NomHrOrg')">
        <q-item-section avatar>
            <q-icon color="primary" name="people" />
        </q-item-section>
        <q-item-section>HR Organizatii</q-item-section>
    </q-item>
-->
    <q-separator v-if="user.is_admin=='y'" inset />

    <q-item-label v-if="user.is_admin=='y'" header>Administrare</q-item-label>
    <q-item v-if="user.is_admin=='y'" clickable v-ripple  @click="goToView('NomDepartamente')">
        <q-item-section avatar>
            <q-icon color="primary" name="assignment_ind" />
        </q-item-section>
        <q-item-section>Departamente</q-item-section>
    </q-item>
    <q-item v-if="user.is_admin=='y'" clickable v-ripple  @click="goToView('NomUsers')">
        <q-item-section avatar>
            <q-icon color="primary" name="people" />
        </q-item-section>
        <q-item-section>Utilizatori</q-item-section>
    </q-item>
    <q-item clickable v-ripple  @click="goToView('StatusNumere')">
        <q-item-section avatar>
            <q-icon color="primary" name="bookmark_border" />
        </q-item-section>
        <q-item-section>Status Numere</q-item-section>
    </q-item>
    <q-item v-if="user.is_admin=='y'" clickable v-ripple  @click="goToView('ParamsTypeFiles')">
        <q-item-section avatar>
            <q-icon color="primary" name="attach_file" />
        </q-item-section>
        <q-item-section>Parametri Atasamente</q-item-section>
    </q-item>
    <q-item v-if="user.is_admin=='y'" clickable v-ripple  @click="goToView('LogAdmin')">
        <q-item-section avatar>
            <q-icon color="primary" name="android" />
        </q-item-section>
        <q-item-section>Log</q-item-section>
    </q-item>

    <!--
    <div class="absolute-bottom flex__row--center">
        <img src="/images/logo_mediu_ro.png" style="margin-bottom: 10px;">
    </div>
    -->
</div>
</template>

<script lang="ts" src="./MenuApp.ts" />

<style scoped>

</style>
