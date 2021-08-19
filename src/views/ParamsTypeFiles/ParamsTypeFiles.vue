<template>
    <div class="q-pa-md">
        <q-table
                dense
                :rows-per-page-options="[10, 20]"
                :data="tableDataNomAllowedFiletypes"
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
                        Adauga tip de fisier nou
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
                    <q-td key="file_extension" :props="props">
                        <q-icon name="delete_forever" class="text-red cursor-pointer" style="font-size: 2rem;" @click="askIfDeleteThis(props.row)" />
                    </q-td>
                    <q-td key="file_extension" :props="props" :sortable="true">
                        {{ props.row.file_extension }}
                        <q-popup-edit v-model="props.row.file_extension" :validate="val => val.length >= 1 && val.length <= 5">
                            <template v-slot="{ initialValue, value, emitValue, validate, set, cancel }"  >
                                <q-input
                                        autofocus
                                        dense
                                        style="max-width:200px;"
                                        :value="props.row.file_extension"
                                        hint="Modificare extensie"
                                        :rules="[val => validate(value) || 'Intre 1 si 5 caractere']"
                                        @input="emitValue"
                                >
                                    <template v-slot:after>
                                        <q-btn flat dense color="negative" icon="cancel" @click.stop="cancel" />
                                        <q-btn flat dense color="positive" icon="check_circle" @click.stop="tryUpdateSize(props.row,set)" :disable="validate(value) === false || initialValue === value" />
                                    </template>
                                </q-input>
                            </template>
                        </q-popup-edit>
                    </q-td>
                    <q-td key="file_max_size" :props="props" :sortable="true">
                        {{ props.row.file_max_size }}
                        <q-popup-edit v-model="props.row.file_max_size" :validate="val => val.length > 0 && val.length <= 3">
                            <template v-slot="{ initialValue, value, emitValue, validate, set, cancel }"  >
                                <q-input
                                        autofocus
                                        dense
                                        style="max-width:200px;"
                                        :value="props.row.file_max_size"
                                        hint="Dimensiune maxima (Mb)"
                                        :rules="[val => validate(value) || 'Intre 1 si 3 cifre']"
                                        @input="emitValue"
                                >
                                    <template v-slot:after>
                                        <q-btn flat dense color="negative" icon="cancel" @click.stop="cancel" />
                                        <q-btn flat dense color="positive" icon="check_circle" @click.stop="tryUpdateSize(props.row,set)" :disable="validate(value) === false || initialValue === value" />
                                    </template>
                                </q-input>
                            </template>
                        </q-popup-edit>
                    </q-td>
                </q-tr>
            </template>
        </q-table>

        <q-dialog v-model="visibleDialogNomAllowedFiletype" persistent >
            <q-card style="min-width: 60vw; max-width: 80vw;">
                <q-bar>
                    <q-icon name="add_box" />
                    <div>Adaugare tip de fisier nou permis ca atasament</div>

                    <q-space />

                    <q-btn dense flat icon="close" v-close-popup>
                        <q-tooltip>Close</q-tooltip>
                    </q-btn>
                </q-bar>

                <q-card-section>
                   <EditNomAllowedFiletypes :frenunt="renuntEditareNomAllowedFiletypes" :fonsave="refreshDataTableNomAllowedFiletypes" v-bind:appid="appidNomAllowedFiletypes"/>
                </q-card-section>
            </q-card>
        </q-dialog>
    </div>
</template>


<script lang="ts" src="./ParamsTypeFiles.ts" />

<style scoped>

</style>
