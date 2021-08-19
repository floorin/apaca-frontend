<template>
    <div class="q-pa-md">
        <q-table
                dense
                :rows-per-page-options="[10, 20]"
                :data="tableDataNomUsers"
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
                <q-tr :props="props" @click="SelectHandler(props.row)">
                    <q-td key="firstName" :props="props" :sortable="true">
                        <span style="font-family: 'Nunito Sans', sans-serif; font-size: 0.8em;">{{ props.row.firstName }}</span>
                    </q-td>
                    <q-td key="lastName" :props="props" :sortable="true">
                        <span style="font-family: 'Nunito Sans', sans-serif; font-size: 0.8em;">{{ props.row.lastName }}</span>
                    </q-td>
                    <q-td key="den_org" :props="props" :sortable="true">
                        <span style="font-family: 'Nunito Sans', sans-serif; font-size: 0.8em;">{{ props.row.den_org }}</span>
                    </q-td>
                </q-tr>
            </template>
        </q-table>
    </div>
</template>

<script lang="ts" src="./ComboUser.ts" />

<style scoped>

</style>
