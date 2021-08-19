<template>
<div>
    <div class="q-pa-md q-gutter-sm">
        <q-tree
                :nodes="jsonHrOgr"
                node-key="id"
                label-key="name"
                ref="refHrOrg"
                default-expand-all
        />
    </div>
</div>
</template>

<script lang="ts" src="./NomHrOrg.ts" />

<style scoped>

</style>

