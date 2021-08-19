askForRemoveDivision<template>
    <div class="q-pa-md q-gutter-sm">
        <q-input ref="filter" outlined v-model="filter" label="Cautare" size="xs" >
            <template v-slot:append>
                <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter" />
            </template>
        </q-input>

        <q-tree
                :nodes="orgTreeData"
                node-key="id_org"
                :filter="filter"
                default-expand-all
        >
            <template v-slot:default-header="prop">
                <div v-if="prop.node.tip_org">
                    <div v-if="prop.node.tip_org=='societate'" style="display: flex;">
                        <span class="text__title--medium">{{prop.node.label}}</span>
                    </div>
                </div>
                <div v-if="prop.node.tip_org">
                    <div v-if="prop.node.tip_org=='division'" style="display: flex;">
                        <span class="text__title--medium" style="font-size:0.9em;">{{prop.node.label}}</span>
                        <span class="material-icons cursor-pointer" style="margin-left: 10px;color:red; font-weight: bolder;" @click="askForRemoveDivision(prop.node)">clear
                                <q-tooltip transition-show="rotate" transition-hide="rotate">Stergere</q-tooltip></span>
                        <span class="material-icons cursor-pointer" @click="openDialogEditDivision(prop.node)" style="margin-left: 10px;" >create</span>
                    </div>
                </div>

                <div v-if="prop.node.tip_org">
                    <div v-if="prop.node.tip_org=='departament'" style="display: flex;">
                        <span  style="font-size:0.8em;">{{prop.node.label}}</span>
                        <span class="material-icons cursor-pointer" style="margin-left: 10px;color:red; font-weight: bolder;" @click="askForRemoveDepartament(prop.node)">clear
                                <q-tooltip transition-show="rotate" transition-hide="rotate">Stergere</q-tooltip></span>
                        <span class="material-icons cursor-pointer" @click="openDialogEditDepartament(prop.node)" style="margin-left: 10px;" >create</span>
                    </div>
                </div>
            </template>

            <template v-slot:default-body="prop">
                <div v-if="prop.node.tip_org">
                    <div v-if="prop.node.tip_org=='societate'">
                        <q-btn outline color="primary" icon="add" label="directie noua" size="sm" no-caps @click="openDialogAddDivision()"/>
                    </div>
                    <div v-if="prop.node.tip_org=='division'">
                        <q-btn outline color="primary" icon="add" label="departament nou" size="sm" no-caps  @click="openDialogAddDepartament(prop.node)" />
                    </div>
                </div>
            </template>
        </q-tree>

        <q-dialog v-model="visibleDialogDivision" persistent>
            <q-card style="min-width: 500px;" >
                <q-bar>
                    <div>{{titleDialogWindow}}</div>

                    <q-space />

                    <q-btn dense flat icon="close" v-close-popup>
                        <q-tooltip>Close</q-tooltip>
                    </q-btn>
                </q-bar>

                <q-card-section >
                    <table style="width:100%;">
                        <!--
                        <tr>
                            <td>
                                <q-input outlined v-model="newDivision.division_org" label="Id directie" type="number" style="max-width: 150px;" />
                            </td>
                        </tr>
                        -->
                        <tr>
                            <td>
                                <q-input outlined v-model="newDivision.division_name" label="Denumirea directiei" />
                            </td>
                        </tr>
                    </table>
                </q-card-section>

                <q-card-actions align="right" class="bg-white text-teal" style="min-height:70px;">
                    <q-btn v-show="newDivision.division_name.length>3 " flat label="Salveaza"  @click="saveDivision" />
                </q-card-actions>
            </q-card>

        </q-dialog>

        <q-dialog v-model="visibleDialogAddDepartament" persistent>
            <q-card style="min-width: 500px;" >
                <q-bar>
                    <div>{{titleDialogWindow}}</div>

                    <q-space />

                    <q-btn dense flat icon="close" v-close-popup>
                        <q-tooltip>Close</q-tooltip>
                    </q-btn>
                </q-bar>

                <q-card-section >
                    <h5>{{newDepartament.parent_name}}</h5>
                    <table style="width:100%;">
                        <!--
                        <tr>
                            <td>
                                <q-input outlined v-model="newDepartament.departament_org" label="Id departament" type="number" style="max-width: 150px;" />
                            </td>
                        </tr>
                        -->
                        <tr>
                            <td>
                                <q-input outlined v-model="newDepartament.departament_name" label="Denumirea departamentului" />
                            </td>
                        </tr>
                    </table>
                </q-card-section>

                <q-card-actions align="right" class="bg-white text-teal" style="min-height:70px;">
                    <q-btn v-show="newDepartament.departament_name.length>3 " flat label="Salveaza" v-close-popup @click="saveNewDepartament" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
    import {ServicesHrOrg} from '@/modules/ServicesHrOrg';
    import nomenclatoare from '@/store/nomenclatoare';
    import {getModule} from 'vuex-module-decorators';
    const storeNomenclatoare = getModule(nomenclatoare);
    export default {
        name: 'NomDepartamente',
        data: ()=>{
            return{
                    filter: '',
                titleDialogWindow:'',
                visibleDialogDivision:false,
                    visibleDialogAddDepartament:false,
                    newDivision: {
                        division_org: '',
                        division_name: ''
                    }
                    ,
                    newDepartament: {
                        parent_id_org: 0,
                        parent_name: '',
                        departament_org: '',
                        departament_name: '',
                        id_departament:0,
                        id_divizie:0
                    }
                    ,
                    orgTreeData: [
                        {
                            label: 'Organizatii',
                            tip_org:'societate',
                            children: []
                        }
                    ]
            }
        },
        methods: {
            resetFilter() {
                this.filter = ''
                this.$refs.filter.focus()
            },
            askForRemoveDivision(params){
                const vueInst = this;
                vueInst.$q.dialog({
                    title: 'Confirmare',
                    message: 'Stergeti directia '+ params.label+'?',
                    cancel: true,
                    persistent: true
                }).onOk(() => {
                    ServicesHrOrg.deleteDivision(params.id_divizie).then(presponse=>{
                        if(presponse.status=='success'){
                            vueInst.getTreeOrg();
                            vueInst.$q.notify({
                                color: 'teal',
                                textColor: 'white',
                                type: 'positive',
                                message: presponse.message,
                                position: 'top',
                                timeout: 1000,
                            });
                        }
                    });
                });
            },
            askForRemoveDepartament(params){
                const vueInst = this;
                vueInst.$q.dialog({
                    title: 'Confirmare',
                    message: 'Stergeti departamentul '+ params.label+'?',
                    cancel: true,
                    persistent: true
                }).onOk(() => {
                    ServicesHrOrg.deleteDepartament(params.id_departament).then(presponse=>{
                        if(presponse.status=='success'){
                            vueInst.getTreeOrg();
                            vueInst.$q.notify({
                                color: 'teal',
                                textColor: 'white',
                                type: 'positive',
                                message: presponse.message,
                                position: 'top',
                                timeout: 1000,
                            });
                        }
                    });
                });
            },
            openDialogAddDivision() {
                this.visibleDialogDivision = true;
                this.newDivision.division_org = 0;
                this.newDivision.division_name = '';
                this.titleDialogWindow='adaugare directie noua';
            },
            openDialogEditDivision(params){
                this.visibleDialogDivision = true;
                this.newDivision.division_org = params.id_org;
                this.newDivision.division_name = params.label;
                this.titleDialogWindow='modificare denumire directie';
            },
            openDialogAddDepartament(params) {
              //console.log('openDialogAddDepartament with params=%o',params)
                this.newDepartament.parent_id_org = params.id_org;
                this.newDepartament.parent_name = params.label;
                this.newDepartament.departament_org = 0;
                this.newDepartament.departament_name = '';
                this.newDepartament.id_departament = 0;
                this.newDepartament.id_divizie = params.id_divizie;
                this.visibleDialogAddDepartament = true;
                this.titleDialogWindow='adaugare departament nou';
            },
            openDialogEditDepartament(params) {
                //console.log('openDialogEditDepartament with params=%o',params)
                this.newDepartament.parent_id_org = params.id_org;
                this.newDepartament.parent_name = '';
                this.newDepartament.departament_org = params.id_org;
                this.newDepartament.departament_name = params.label;
                this.newDepartament.id_departament = params.id_departament;
                this.newDepartament.id_divizie = params.id_divizie;
                this.visibleDialogAddDepartament = true;
                this.titleDialogWindow='modificare denumire departament';
            },
            saveNewDepartament() {
                const vueInst = this;
                ServicesHrOrg.updateDepartament(vueInst.newDepartament.id_divizie,vueInst.newDepartament.id_departament, vueInst.newDepartament.departament_name).then(presponse=>{
                    if(presponse.status=='success'){
                        vueInst.visibleDialogAddDivision=false;
                        vueInst.getTreeOrg();
                        vueInst.$q.notify({
                            color: 'teal',
                            textColor: 'white',
                            type: 'positive',
                            message: presponse.message,
                            position: 'top',
                            timeout: 1000,
                        });
                    }
                });
            },
            saveDivision() {
                const vueInst = this;
                ServicesHrOrg.updateDivision(vueInst.newDivision.division_org, vueInst.newDivision.division_name).then(presponse=>{
                  if(presponse.status=='success'){
                      vueInst.visibleDialogDivision=false;
                      vueInst.getTreeOrg();
                      vueInst.$q.notify({
                          color: 'teal',
                          textColor: 'white',
                          type: 'positive',
                          message: presponse.message,
                          position: 'top',
                          timeout: 1000,
                      });
                  }
                });
            },
            getTreeOrg(){
                const vueInst = this;
                vueInst.orgTreeData[0].children=[];
                ServicesHrOrg.getNomOrganizatiiForTree().then(presponse=>{
                    if(presponse.status=='success'){
                        presponse.divizii.forEach(pdivizie=>{
                            const DataDivision= {
                                                label: pdivizie.denumire,
                                                tip_org: 'division',
                                                id_divizie: pdivizie.appid,
                                                id_departament: 0,
                                                id_org: pdivizie.appid,
                                                children:[]
                                            }
                            presponse.departamente.forEach(pdepartament=>{
                                    if(pdepartament.appid_divizie==pdivizie.appid){
                                        DataDivision.children.push({
                                            label: pdepartament.departament,tip_org:'departament', id_divizie:1*pdivizie.appid, id_departament: 1*pdepartament.appid, id_org:10000*pdivizie.appid + 1*pdepartament.appid
                                          //label: pdepartament.departament,tip_org:'departament', id_org: 1*pdepartament.appid
                                        });
                                    }
                            });
                            //console.log('push DataDivision=%o',DataDivision)
                            vueInst.orgTreeData[0].children.push(DataDivision);
                        });

                    }
                });
            }
        },
        mounted(){
            const vueInst = this;
            vueInst.loadingData=true;
            storeNomenclatoare.set_currentpagetitle('Nomenclator Organizatii');
            vueInst.getTreeOrg();
        }
    }
</script>

<style scoped>

</style>
