<template>
    <div class="q-pa-md">
        <q-table
                dense
                :data="tableDataNomRegistre"
                :columns="columns"
                :visible-columns="visibleColumns"
                row-key="id"
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
                        Adauga registru nou
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
            <template v-slot:header-cell-id_registru="props">
                <q-th style="text-align: left;">
                    Id registru
                </q-th>
            </template>
            <template v-slot:header-cell-an_permis_pt_inreg="props">
                <q-th style="text-align: left;">
                    Anul
                </q-th>
            </template>
            <template v-slot:header-cell-nr_de_start="props">
                <q-th style="text-align: left;">
                    Nr.de start
                </q-th>
            </template>
            <template v-slot:header-cell-den_registru_lang_1="props">
                <q-th style="text-align: left;">
                    Denumire romana
                </q-th>
            </template>
            <template v-slot:header-cell-den_registru_lang_2="props">
                <q-th style="text-align: left;">
                    Denumire maghiara
                </q-th>
            </template>
-->
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td key="id_registru" :props="props">
                        <q-icon name="delete_forever" class="text-red cursor-pointer" style="font-size: 2rem;" @click="askIfDeleteThis(props.row)" /> {{ props.row.id_registru }}
                    </q-td>
                    <q-td key="an_permis_pt_inreg" :props="props">
                        {{ props.row.an_permis_pt_inreg }}
                    </q-td>
                    <q-td key="nr_de_start" :props="props">
                        {{ props.row.nr_de_start }}
                    </q-td>
                    <q-td key="den_registru_lang_1" :props="props">
                        {{ props.row.den_registru_lang_1 }}
                    </q-td>
                    <!--
                    <q-td key="den_registru_lang_2" :props="props">
                        {{ props.row.den_registru_lang_2 }}
                    </q-td>
                    -->
                    <q-td key="activ" :props="props">
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

        <q-dialog v-model="visibleDialogEditRegistru" persistent >
            <q-card style="min-width: 60vw; max-width: 80vw;">
                <q-bar>
                    <q-icon name="add_box" />
                    <div>Editare registru</div>

                    <q-space />

                    <q-btn dense flat icon="close" v-close-popup>
                        <q-tooltip>Close</q-tooltip>
                    </q-btn>
                </q-bar>

                <q-card-section>
                    <EditNomRegistru :frenunt="renuntEditareRegistru" :fonsave="refreshDataTableNomRegistre" v-bind:appid="appidRegistru"/>
                </q-card-section>
            </q-card>
        </q-dialog>
    </div>
</template>

<script lang="ts" src="./NomRegistre.ts" />

<style scoped>

</style>
