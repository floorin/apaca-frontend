<template>
  <q-layout view="hHh lpR fFf">

    <q-header v-if="sessionIsValid" elevated style="background-color: #EEF3FA;color:black;">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />

        <!--
        <q-toolbar-title>
            <img src="/images/logo_mic_ro.png">
          Document Management
        </q-toolbar-title>
        -->
        <q-toolbar-title style="text-align:center;">
          <span class="title__current__page">{{currentPageTitle}}</span>
        </q-toolbar-title>

        <q-input v-if="user.auth_for_search=='y'" dense outlined v-model="inputFastSearch" @input="getOptionSDocumentsFastSearch" ref="refInputFastSearch" >
          <template v-slot:append>
            <div @click="clearInputFastSearch" >
              <q-icon v-if="inputFastSearch === ''" name="search" />
              <q-icon v-else name="clear" class="cursor-pointer" />
            </div>
          </template>
          <q-popup-proxy :target="$refs.refInputFastSearch" ref="refOptionsFastSearch" no-parent-event @before-show="clearListFastSearch"  @show="putFocusBackToFastSearch">
            <q-list dense style="background-color: white;position: fixed;top:50px; background-color: #EEF3FA; border: 1px solid #dddddd;z-index:99999 !important;">
            <q-item clickable v-ripple v-for="document in optionsFastSearch">
              <q-item-section @click="getDocumentFromFastSearch(document)"  style="min-width: 350px; border: 1px solid #dddddd;padding: 2px; border-radius: 2px;">
                <span class="fast__search__label--medium">{{document.id_doc}}/{{document.track_creation_date}}</span>
                <span class="fast__search__label--medium" style="white-space: nowrap;">{{document.tip_request}} / {{document.den_registru}}</span>
                <span class="fast__search__label--thin">{{ document.nume_denumire }}</span>
              </q-item-section>
            </q-item>
          </q-list>
          </q-popup-proxy>
        </q-input>


        <q-btn v-if="$q.platform.is.desktop" flat color="primary" class="text-blue" :label="user.first_name+' '+user.last_name">
          <q-menu>
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div class="text-h6 q-mb-md">Setari utilizator</div>
                <q-input
                        outlined
                        dense
                        label="Nr.randuri tabele"
                        type="number"
                        size="sm"
                        v-model="nrRanduriTabel"
                        lazy-rules
                        style="max-width: 120px;max-height: 7vh;"
                        @input="setNrRanduriTabel"
                />
              </div>

              <q-separator vertical inset class="q-mx-lg" />

              <div class="column items-center">
                <div class="q-mt-md q-mb-xs">
                  <span class="text__important">{{user.first_name}} {{user.last_name}}</span>
                  <p class="text-subtitle2">
                    {{user.functie}}
                  </p>
                  <p class="text-h6">
                    {{user.email_address}}
                  </p>
                  <p class="text-h6">
                    {{userDepartament}}
                  </p>
                </div>
              </div>
            </div>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" behavior="mobile" overlay elevated>
      <!-- drawer content -->
      <q-list>
        <q-item>
          <q-item-section avatar>
            <img src="/images/odocs_logo_mic_ro.png">
          </q-item-section>
          <q-item-section>ODOCS</q-item-section>
        </q-item>
        <q-item clickable v-ripple  @click="leftDrawerOpen=false">
          <q-item-section avatar>
            <q-icon color="primary" name="close" />
          </q-item-section>
          <q-item-section>inchide</q-item-section>
        </q-item>
      </q-list>
      <MenuApp :userid="user.userid"/>
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" behavior="mobile" overlay elevated :width="widthForDrawerDocument">
      <q-bar style="height: 50px;">
        <div class="cursor-pointer">Document</div>
        <q-space />
        <span id="span_pt_simulate_click"></span>
        <q-btn size="md" flat icon="close" @click="closeWindowDocument" />
      </q-bar>
      <WorkOnDocument :appid="appidDocToWorkOnIt" :withFinalizeButton="withFinalizeButton" :withRepartizareButton="withRepartizareButton" :fCloseDocumentWindow="closeWindowDocument"/>
    </q-drawer>
    <q-page-container>
      <q-banner inline-actions class="text-white bg-red" v-if="!StatusNomenclatoare && this.userStore.user.is_activ== 'y'">
        {{mesajSeLoadingNomenclatoare}}
      </q-banner>
      <router-view />
    </q-page-container>

    <q-dialog
            v-model="showPreviewFileOnDesktop"
            persistent
            :maximized="true"
            transition-show="slide-up"
            transition-hide="slide-down"
    >
      <q-card class="bg-white">
        <q-bar>
          <h4>{{titleForPreviewForm}}</h4>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip transition-show="rotate"
                       transition-hide="rotate">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <q-linear-progress v-if="downloadingFile" query track-color="orange" color="purple" class="q-mt-sm"  />
          <iframe id="iframe_preview_scan_desktop" type="application/pdf" width="100%" height="100%" style="width:95vw; height:calc(100vh - 70px);overflow: auto;border: none;"></iframe>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
            v-model="showPreviewFileOnMobile"
            persistent
            :maximized="true"
            transition-show="slide-up"
            transition-hide="slide-down"
    >
      <q-card class="bg-white">
        <q-bar>
          <h4>{{titleForPreviewForm}}</h4>
          <q-space />

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip transition-show="rotate"
                       transition-hide="rotate">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <!--<canvas id="canvas-pdf-preview_on_mobile_only"></canvas>-->
          <iframe
                  id="iframe_preview_scan_mobile"
                  style="width:95vw; height:calc(100vh - 70px);overflow: auto;border: none;"
                  />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script lang="ts" src="./app.ts" />

<style>
</style>
