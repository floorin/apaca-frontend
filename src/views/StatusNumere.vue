<template>
    <div style="display: flex;justify-content: center;padding-top: 20px;">
        <q-linear-progress v-if="loadingData" query track-color="orange" color="purple" class="q-mt-sm"  />
    <table class="table-bordered">
        <thead>
            <tr>
                <th>Registru</th>
                <th>Numar de start</th>
                <th>Numar curent</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="statusNr in arrStatusNumere">
                <td>
                  {{statusNr.den_registru}}
                </td>
                <td>
                    {{statusNr.nr_de_start}}
                </td>
                <td>
                    {{statusNr.nr_curent}}
                </td>
            </tr>
        </tbody>
    </table>
    </div>
</template>

<script>
    import {ServicesSearch} from '@/modules/ServicesSearch';
    import nomenclatoare from '@/store/nomenclatoare';
    import {getModule} from 'vuex-module-decorators';
    const storeNomenclatoare = getModule(nomenclatoare);
    export default {
        name: 'StatusNumere',
        data: ()=>{
            return{
                loadingData:false,
                arrStatusNumere:[]
            }
        },
        methods:{
          getStatusNumere(){
              const vueInst = this;
              ServicesSearch.getStatusNumere().then(presponse=>{
                  vueInst.loadingData=false;
                  if(presponse.status=='success'){
                      vueInst.arrStatusNumere = JSON.parse(JSON.stringify(presponse.rows));
                  }
              })
          }
        },
        mounted(){
            const vueInst = this;
            vueInst.loadingData=true;
            storeNomenclatoare.set_currentpagetitle('Status Numere');
            vueInst.getStatusNumere();
        }
    }
</script>

<style scoped>

</style>
