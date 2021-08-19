<template>
    <div class="q-pa-xs">
        <q-table
                v-if="$q.platform.is.mobile"
                grid
                :rows-per-page-options="[10, 20]"
                :data="tableDataDeRepartizatDocuments"
                :columns="columns"
                :visible-columns="visibleColumns"
                row-key="appid"
                :filter="filter"
                :loading="loadingData"
                :pagination.sync="myPagination"
        >

            <template v-slot:top>
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
                            <span class="text__label--thin">Nr/data doc:</span>{{ props.row.id_doc }}/{{ displayDataDoc(props.row.track_creation_date) }}
                            <q-icon name="settings" class="cursor-pointer" style="color: #F6685E; font-size: 1.5rem; margin-left: auto;" @click="openWorkOnDocument(props.row)" />
                        </q-card-section>
                        <q-separator />
                        <q-card-section class="flex" >
                            <div style="display: flex; flex-direction: column;">
                                <div><span class="text__label--thin">Corespodenta:</span><span>{{ props.row.tip_request }}</span></div>
                                <div><span class="text__label--thin">Tip document:</span><span>{{ getDenTipDocument(props.row.id_tip_document) }}</span></div>
                                <div><span class="text__label--thin">Solicitant:</span><span>{{ props.row.nume_denumire }}</span></div>
                                <div>
                                    <div v-for="scan in props.row.scans" class="cursor-pointer">
                                        <q-btn flat color="primary" no-caps>
                                            <span class="material-icons rotated90">attachment</span>
                                            <div>{{scan.file_name}}</div>
                                        </q-btn>
                                        <q-menu
                                                fit
                                                transition-show="scale"
                                                transition-hide="scale"
                                                style="width: 90vw;"
                                        >
                                            <DialogOpenScan :appid="scan.appid"/>
                                        </q-menu>
                                    </div>
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
                :data="tableDataDeRepartizatDocuments"
                :columns="columns"
                :visible-columns="visibleColumns"
                row-key="appid"
                :filter="filter"
                :loading="loadingData"
                :pagination.sync="myPagination"
        >

            <template v-slot:top>
                <q-space />
                <q-input dense debounce="300" color="primary" v-model="filter">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </template>

            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td key="appid" :props="props">
                        <q-icon name="settings" class="cursor-pointer" style="color: #F6685E; font-size: 1.5rem;"  @click="openWorkOnDocument(props.row)" />
                    </q-td>
                    <q-td key="nr_inreg" :props="props" >
                        {{ props.row.id_doc }}
                    </q-td>
                    <q-td key="data_doc" :props="props">
                        {{ displayDataDoc(props.row.data_doc) }}
                    </q-td>
                    <q-td key="den_registru" :props="props">
                        {{ props.row.den_registru }}
                    </q-td>
                    <q-td key="tip_request" :props="props">
                        {{ props.row.tip_request }}
                    </q-td>
                    <q-td key="id_tip_document" :props="props">
                        {{ getDenTipDocument(props.row.id_tip_document) }}
                    </q-td>
                    <q-td key="nume_denumire" :props="props">
                        {{ props.row.nume_denumire }}
                    </q-td>
                    <q-td key="scans" :props="props">
                        <div style="max-width:30vw;" class="container--span__file_scan">
                        <span v-for="scan in props.row.scans" class="cursor-pointer span__file_scan">
                            <span class="material-icons rotated90">attachment</span>
                            {{humanReadableBytes(scan.file_size)}}{{scan.file_ext}}
                                  <q-menu
                                          fit
                                          transition-show="scale"
                                          transition-hide="scale"
                                          style="min-width:50vw; background-color: #3c763d;"
                                  >
                                      <DialogOpenScan :appid="scan.appid"/>
                                  </q-menu>
                        </span>
                        </div>
                    </q-td>
                </q-tr>
            </template>
        </q-table>
    </div>
</template>

<script lang="ts" src="./DeRepartizat.ts" />

<style scoped>
    .q-table__card{
        box-shadow: none !important;
    }
</style>
