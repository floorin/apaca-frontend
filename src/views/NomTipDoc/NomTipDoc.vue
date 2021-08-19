<template>
    <div class="q-pa-md">
        <q-table
                dense
                :rows-per-page-options="[10, 20]"
                :data="tableDataNomTipDoc"
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
                            Adauga tip nou de document
                        </q-tooltip>
                    </q-btn>
                <q-space />
                <q-input dense debounce="300" color="primary" v-model="filter">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </template>

<!--
            <template v-slot:header-cell-id_tip_doc="props">
                <q-th style="text-align: left;">
                    Id tip document
                </q-th>
            </template>

            <template v-slot:header-cell-den_lang_1="props">
                <q-th style="text-align: left;">
                    Denumire romana
                </q-th>
            </template>

            <template v-slot:header-cell-den_lang_2="props">
                <q-th style="text-align: left;">
                    Denumire maghiara
                </q-th>
            </template>

            <template v-slot:header-cell-den_categ="props">
                <q-th style="text-align: left;">
                    Categorie
                </q-th>
            </template>
-->

            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td key="id_tip_doc" :props="props" >
                        <q-icon name="delete_forever" class="text-red cursor-pointer" style="font-size: 2rem;" @click="askIfDeleteThis(props.row)" />
                        {{ props.row.id_tip_doc }}
                    </q-td>
                    <q-td key="den_lang_1" :props="props">
                        {{ props.row.den_lang_1 }}
                    </q-td>
                    <!--
                    <q-td key="den_lang_2" :props="props">
                        {{ props.row.den_lang_2 }}
                    </q-td>
                    -->
                    <q-td key="den_categ" :props="props">
                        {{ props.row.den_categ }}
                    </q-td>
                    <q-td key="activ" :props="props">
                        <q-toggle
                                v-model="props.row.is_confidential"
                                checked-icon="lock"
                                color="orange"
                                label="Confidential"
                                unchecked-icon="lock_open"
                                false-value="n"
                                true-value="y"
                                @input="changeConfidentality(props.row)"
                        />
                        <q-toggle
                                v-model="props.row.activ"
                                checked-icon="check"
                                color="blue"
                                label="Activ"
                                unchecked-icon="clear"
                                false-value="n"
                                true-value="y"
                                @input="changeStatus(props.row)"
                        />
                    </q-td>
                </q-tr>
            </template>
        </q-table>

        <q-dialog v-model="visibleDialogEditTipDoc" persistent >
            <q-card style="min-width: 60vw; max-width: 80vw;">
                <q-bar>
                    <q-icon name="add_box" />
                    <div>Editare tip document</div>

                    <q-space />

                    <q-btn dense flat icon="close" v-close-popup>
                        <q-tooltip>Close</q-tooltip>
                    </q-btn>
                </q-bar>

                <q-card-section>
                    <EditNomTipDoc :frenunt="renuntEditareTipDoc" :fonsave="refreshDataTableNomTipDoc" v-bind:appid="appidTipDoc"/>
                </q-card-section>
            </q-card>
        </q-dialog>
    </div>
</template>


<script lang="ts" src="./NomTipDoc.ts" />

<style scoped>

</style>
