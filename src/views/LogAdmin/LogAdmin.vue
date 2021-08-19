<template>
    <div>
        <q-splitter
                :v-model="20"
                style="height: 85vh"
        >

            <template v-slot:before>
                <q-tabs
                        v-model="splitterTypeOfLogs"
                        vertical
                        class="text-teal"
                >
                    <q-tab name="users" icon="folder_shared" label="Utilizatori" />
                    <q-tab name="documents" icon="description" label="Documente" />
                </q-tabs>
            </template>

            <template v-slot:after>
                <q-tab-panels
                        v-model="splitterTypeOfLogs"
                        animated
                        swipeable
                        vertical
                        transition-prev="jump-up"
                        transition-next="jump-up"
                >
                    <q-tab-panel name="users">
                        <div class="text-h6 q-mb-md">Interogare actiuni utilizator</div>
                        <p>Pentru interogarea jurnalului de actiuni selectati perioada dorita si utilizatorul.</p>
                        <div class="row">
                            <span class="col-xs-12 col-sm-2 col-md-2 col-lg-2 q-pa-xs text__label--medium" style="text-align: center;">Perioada</span>
                            <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2 q-pa-xs">
                                <div style="max-width: 200px">
                                    <q-input outlined v-model="data_start" dense mask="##.##.####"
                                             label="De la"
                                             :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                                    >
                                        <q-popup-proxy ref="qDateProxyStart" transition-show="scale" transition-hide="scale">
                                            <q-date v-model="data_start" mask="DD.MM.YYYY"  @input="() => $refs.qDateProxyStart.hide()" :locale="myLocale" />
                                        </q-popup-proxy>
                                        <template v-slot:append>
                                            <q-icon name="event" class="cursor-pointer"></q-icon>
                                        </template>
                                    </q-input>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2 q-pa-xs">
                                <div style="max-width: 200px">
                                    <q-input outlined v-model="data_end" dense mask="##.##.####"
                                             label="pana la"
                                             :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                                    >
                                        <q-popup-proxy ref="qDateProxyEnd" transition-show="scale" transition-hide="scale">
                                            <q-date v-model="data_end" mask="DD.MM.YYYY"  @input="() => $refs.qDateProxyEnd.hide()" :locale="myLocale" />
                                        </q-popup-proxy>
                                        <template v-slot:append>
                                            <q-icon name="event" class="cursor-pointer"></q-icon>
                                        </template>
                                    </q-input>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 q-pa-xs">
                                <q-select
                                        outlined
                                        dense
                                        v-model="model_search_user"
                                        use-input
                                        input-debounce="0"
                                        label="Utilizator"
                                        :options="optionsUsers"
                                        @filter="filterFn"
                                        style="width: 250px"
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
                            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 q-pa-xs">
                                <q-btn color="black" label="Interogheaza!" v-show="visibleLogsUserBtn" size="sm" no-caps  :disable="loadingDataLogUser" :loading="loadingDataLogUser" @click="getLogsUser" >
                                    <template v-slot:loading>
                                        <q-spinner-gears class="on-right" />
                                        Se cauta...
                                    </template>
                                </q-btn>
                            </div>
                        </div>

                        <q-table
                                dense
                                :rows-per-page-options="[10, 20]"
                                :data="tableDataLogUser"
                                :columns="columnsLogsUser"
                                :visible-columns="visibleColumnsLogsUser"
                                row-key="track_date"
                                :filter="filterInTableLogUser"
                                :loading="loadingDataLogUser"
                                :pagination.sync="myPagination"
                        >

                            <template v-slot:top>
                                {{titleTableLogUser}}
                                <q-space />
                                <q-input dense debounce="300" color="primary" v-model="filterInTableLogUser">
                                    <template v-slot:append>
                                        <q-icon name="search" />
                                    </template>
                                </q-input>
                            </template>

                            <template v-slot:body="props">
                                <q-tr :props="props">
                                    <q-td key="track_date" :props="props">
                                        {{ props.row.track_date }}
                                    </q-td>
                                    <q-td key="track_user" :props="props">
                                        {{ props.row.track_user }}
                                    </q-td>
                                    <q-td key="tip_operatie" :props="props">
                                        {{ props.row.tip_operatie }}
                                    </q-td>
                                    <q-td key="id_doc" :props="props">
                                        {{ props.row.id_doc }}
                                    </q-td>
                                    <q-td key="explicatie" :props="props">
                                        {{ props.row.explicatie }}
                                    </q-td>
                                </q-tr>
                            </template>
                        </q-table>

                    </q-tab-panel>

                    <q-tab-panel name="documents">
                        <div class="text-h6 q-mb-md">Interogare log pe nr. de document</div>
                        <p>Pentru interogarea jurnalului de actiuni completati registrul si nr. de document</p>
                        <div class="row">
                            <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2 q-pa-xs">
                                <q-select outlined v-model="log_for_doc_id_registru" :options="optionsRegistre" label="Registru"
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
                            <div class="col-xs-12 col-sm-3 col-md-2 col-lg-2 q-pa-xs">
                                <q-input
                                        outlined
                                        v-model="log_for_doc_id_doc"
                                        label="Numar document"
                                        lazy-rules
                                        dense
                                        :input-style="{ fontFamily: 'Nunito Sans',fontWeight: 'bolder' }"
                                />
                            </div>
                            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 q-pa-xs">
                                <q-btn color="black" label="Interogheaza!" v-show="visibleLogsDocBtn" size="sm" no-caps  :disable="loadingDataLogDoc" :loading="loadingDataLogDoc" @click="getLogsDoc" >
                                    <template v-slot:loading>
                                        <q-spinner-gears class="on-right" />
                                        Se cauta...
                                    </template>
                                </q-btn>
                            </div>
                        </div>

                        <q-table
                                dense
                                :rows-per-page-options="[10, 20]"
                                :data="tableDataLogDoc"
                                :columns="columnsLogsDoc"
                                :visible-columns="visibleColumnsLogsDoc"
                                row-key="track_date"
                                :filter="filterInTableLogDoc"
                                :loading="loadingDataLogDoc"
                                :pagination.sync="myPagination"
                        >

                            <template v-slot:top>
                                <span v-show="pDocumentIdentificat.id_doc">Document <b>{{pDocumentIdentificat.id_doc}}</b> / {{pDocumentIdentificat.data_doc}}, create de <b>{{pDocumentIdentificat.create_de}}</b>, tip corespondenta <b>{{pDocumentIdentificat.tip_document}}</b></span>
                                <q-space />
                                <q-input dense debounce="300" color="primary" v-model="filterInTableLogDoc">
                                    <template v-slot:append>
                                        <q-icon name="search" />
                                    </template>
                                </q-input>
                            </template>

                            <template v-slot:body="props">
                                <q-tr :props="props">
                                    <q-td key="track_date" :props="props">
                                        {{ props.row.track_date }}
                                    </q-td>
                                    <q-td key="track_user" :props="props">
                                        {{ props.row.track_user }}
                                    </q-td>
                                    <q-td key="first_name" :props="props">
                                        {{ props.row.first_name }}
                                    </q-td>
                                    <q-td key="last_name" :props="props">
                                        {{ props.row.last_name }}
                                    </q-td>
                                    <q-td key="tip_operatie" :props="props">
                                        {{ props.row.tip_operatie }}
                                    </q-td>
                                    <q-td key="id_doc" :props="props">
                                        {{ props.row.id_doc }}
                                    </q-td>
                                    <q-td key="explicatie" :props="props">
                                        {{ props.row.explicatie }}
                                    </q-td>
                                </q-tr>
                            </template>
                        </q-table>
                        <p>{{displayHeightInfo}}</p>
                        <p :v-html="displayHeightInfo"></p>
                    </q-tab-panel>

                </q-tab-panels>
            </template>

        </q-splitter>
    </div>
</template>

<script lang="ts" src="./LogAdmin.ts" />

<style scoped>

</style>
