<template>
    <div class="no-wrap q-pa-md" :class="$q.platform.is.mobile ? 'flex_column-reverse' : 'row'" style="min-width: 30vw;">
        <div style="display: flex;align-items: center;">
            <q-list dense style="min-width: 10vw;">
                <q-item v-if="scan.file_ext=='pdf'" v-close-popup>
                    <q-btn flat color="primary" icon="pageview" no-caps no-wrap label="Vizualizeaza" @click="openPreviewForm(appid)" />
                </q-item>
                <q-item  v-close-popup>
                    <q-btn flat color="primary" icon="cloud_download" no-caps no-wrap label="Descarca"  @click="descarcaScan(appid)" />
                </q-item>
            </q-list>
        </div>
        <q-separator vertical inset class="q-mx-lg" v-if="$q.platform.is.dektop" />
        <q-separator v-if="$q.platform.is.mobile" />
        <div class="column items-center" style="min-width: 20vw;">
            <q-spinner-audio
                    v-if="loadingInfoScan"
                    color="black"
                    size="3em"
            />
            <div v-else class="column items-center">
                <span class="text-subtitle1">{{scan.description}}</span>
                <span class="text-subtitle2">{{humanReadableBytes(scan.file_size)}}</span>
                <span class="text-caption">{{scan.file_name}}</span>
                <span class="text-caption">incarcat la {{scan.track_date.substr(0,16)}} de {{scan.track_user}}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./DialogOpenScan.ts" />

<style scoped>

</style>
