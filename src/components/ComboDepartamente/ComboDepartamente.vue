<template>
    <div class="q-pa-md">
        <q-table
                dense
                :rows-per-page-options="[10, 20]"
                :data="tableDataNomDepartamente"
                :columns="columns"
                :visible-columns="visibleColumns"
                row-key="appid"
                :filter="filter"
                :pagination.sync="myPagination"
        >

            <template v-slot:top>
                <span style="font-family: 'PT Sans Narrow', sans-serif; font-size: 0.8em;">{{title}}</span>
                <q-space />
                <q-input dense debounce="300" color="primary" v-model="filter">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </template>

            <template v-slot:body="props">
                <q-tr :props="props" >
                    <q-td key="divizie" :props="props" :sortable="true" class="cursor-pointer" @click="selectDivizie(props.row)">
                        <span style="font-family: 'Nunito Sans', sans-serif; font-size: 0.8em;">{{ props.row.divizie }}</span>
                    </q-td>
                    <q-td key="departament" :props="props" :sortable="true" class="cursor-pointer" @click="selectDepartament(props.row)">
                        <span style="font-family: 'Nunito Sans', sans-serif; font-size: 0.9em;font-weight: bold;" >{{ props.row.departament }}</span>
                    </q-td>
                </q-tr>
            </template>
        </q-table>
    </div>
</template>

<script lang="ts" src="./ComboDepartamente.ts" />

<style scoped>

</style>
