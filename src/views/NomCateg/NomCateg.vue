<template>
    <div class="q-pa-md">
        <q-table
                dense
                :rows-per-page-options="[10, 20]"
                :data="tableDataNomCateg"
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
                            Adauga categorie noua
                        </q-tooltip>
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
                    <q-td key="id_categ" :props="props">
                        <q-icon name="delete_forever" class="text-red cursor-pointer" style="font-size: 2rem;" @click="askIfDeleteThis(props.row)" /> {{ props.row.id_categ }}
                    </q-td>
                    <q-td key="den_lang_1" :props="props" :sortable="true">
                            {{ props.row.den_lang_1 }}
                    </q-td>
                    <!--
                    <q-td key="den_lang_2" :props="props" :sortable="true">
                            {{ props.row.den_lang_2 }}
                    </q-td>
                    -->
                    <q-td key="appid" :props="props">
                        <q-toggle
                                v-model="fourth"
                                checked-icon="check"
                                color="red"
                                label="Different icon for each state"
                                unchecked-icon="clear"
                        />
                    </q-td>
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

        <q-dialog v-model="visibleDialogEditCateg" persistent >
            <q-card style="min-width: 60vw; max-width: 80vw;">
                <q-bar>
                    <q-icon name="add_box" />
                    <div>Editare categorie documente</div>

                    <q-space />

                    <q-btn dense flat icon="close" v-close-popup>
                        <q-tooltip>Close</q-tooltip>
                    </q-btn>
                </q-bar>

                <q-card-section>
                    <EditNomCateg :frenunt="renuntEditareCateg" :fonsave="refreshDataTableNomCateg" v-bind:appid="appidCategorie"/>
                </q-card-section>
            </q-card>
        </q-dialog>
    </div>
</template>


<script lang="ts" src="./NomCateg.ts" />

<style scoped>

</style>
