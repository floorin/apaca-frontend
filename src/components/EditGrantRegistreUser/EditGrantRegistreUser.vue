<template>
<div>
    <span class="text__title--big" style="color:black;">{{user_name}}</span>
    <p>Status drepturi pe registre.</p>
    <div v-for="registru in arrGrantsRegistre">
        <q-toggle
                v-model="registru.granted"
                checked-icon="lock"
                color="green"
                label=""
                unchecked-icon="lock_open"
                false-value="n"
                true-value="y"
                :label="registru.den_registru_lang_1"
                @input="changeStatus(registru)"
        />
    </div>
</div>
</template>

<script lang="ts" src="./EditGrantRegistreUser.ts" />

<style scoped>

</style>
