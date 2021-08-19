import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import iUser from '@/types/iUser';
import EditGrantRegistreUser from '@/components/EditGrantRegistreUser/EditGrantRegistreUser.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import ErrorComponent from '@/components/ErrorComponent.vue';
import {ServicesNomUsers} from '@/modules/ServicesNomUsers';
const EditNomUser = import('@/components/EditNomUser/EditNomUser.vue');
import ComboDepartamente from '@/components/ComboDepartamente/ComboDepartamente.vue'
import nomenclatoare from '@/store/nomenclatoare';
import {getModule} from 'vuex-module-decorators';
import iOrganizatie from '@/types/iOrganizatie';
import axios, {AxiosResponse} from 'axios';
import {CONFIG_ENV} from '@/config';
//const EditNomRegistru = () => import('@/components/EditNomRegistru/EditNomRegistru.vue').then(m => m.default)

interface iUserCuDepartament extends iUser{
  den_directie:string|null
  den_departament:string|null
}


// @ts-ignore
@Component({components: {
    ComboDepartamente,EditGrantRegistreUser,
    EditNomUser: () => ({
      component: EditNomUser,
      loading: LoadingComponent,
      error: ErrorComponent,
      timeout: 3000
    })
  }
})

export default class NomUsers extends Vue {
  public filter: string = '';
  public userid: string = '';
  public loadingData: boolean = false;
  public visibleDialogEditUser: boolean = false;
  public dialogChangeDepartament:boolean = false;
  public dialogEditGrantRegistre:boolean = false;
  public dialogChangeNume:boolean = false;
  public ajaxGetXls:boolean = false;
  public new_first_name:string = '';
  public new_last_name:string = '';
  public userIdToChange:number=0;
  public myPagination:any={
    rowsPerPage:10
  }

  public visibleColumns: string[] = [  'userid','first_name',  'email_address', 'user_wan', 'is_activ', 'auth_for_upload_scan', 'auth_todo_repartizare', 'auth_toview_confidential', 'auth_for_input_intrare', 'auth_for_input_intern','auth_for_input_exit', 'auth_for_expeditie', 'auth_for_search'];
  public  columns: any = [
    { name: 'den_directie', label: 'Directie', field: 'den_directie', align: 'left', sortable: true },
    { name: 'den_departament', label: 'Departament', field: 'den_departament', align: 'left', sortable: true },
    { name: 'userid', label: 'Marca', field: 'userid', align: 'left', sortable: true },
    { name: 'first_name', label: 'Nume Prenume', field: 'first_name', align: 'left', sortable: true },
    { name: 'last_name', label: 'Last named', field: 'last_name', align: 'left', sortable: true },
    { name: 'email_address', label: 'User domeniu / Email', field: 'email_address', align: 'left', sortable: true },
    { name: 'functie', label: 'Functie', field: 'functie', align: 'left', sortable: true },

    { name: 'is_activ', label: 'Registre', field: 'is_activ', sortable: true },
    { name: 'is_activ', label: 'Activ', field: 'is_activ', sortable: true },
    { name: 'auth_for_upload_scan', label: 'Autorizat upload', field: 'auth_for_upload_scan', sortable: true },
    { name: 'auth_todo_repartizare', label: 'Autorizat repartizari', field: 'auth_todo_repartizare', sortable: true },
    // tslint:disable-next-line:max-line-length
    { name: 'auth_toview_confidential', label: 'Autorizat confidentiale', field: 'auth_toview_confidential', sortable: true },
    // tslint:disable-next-line:max-line-length
    { name: 'auth_for_input_intrare', label: 'Autorizat intrari', field: 'auth_for_input_intrare', sortable: true },
    { name: 'auth_for_input_intern', label: 'Autorizat interne', field: 'auth_for_input_intern', sortable: true },
    { name: 'auth_for_input_exit', label: 'Autorizat iesiri', field: 'auth_for_input_exit', sortable: true },
    { name: 'auth_for_expeditie', label: 'Autorizat expeditie', field: 'auth_for_expeditie', sortable: true },
    { name: 'auth_for_search', label: 'Autorizat cautare', field: 'auth_for_search', sortable: true },
    { name: 'is_admin', label: 'is_admin', field: 'is_admin', sortable: true },
  ];
  public storeNomenclatoare = getModule(nomenclatoare);
  public tableDataNomUsers: iUserCuDepartament[] = [];
  public $refs: any;

  constructor() {
    super();
  }
  public addRow() {
    this.userid = '';
    this.visibleDialogEditUser = true;
  }
  public renuntEditareUser() {
    this.visibleDialogEditUser = false;
  }

  public changeStatus(authName:string,pNewAuthStatus: string, puserid: string){
    const vueInst = this;
    ServicesNomUsers.putStatusAuth(authName, pNewAuthStatus, puserid).then(presponse=>{
      if(presponse.status==='success'){
        vueInst.$q.notify({
          color: 'teal',
          textColor: 'white',
          type: 'negative',
          message: presponse.message,
          position: 'top',
          timeout: 500,
        });
      }
  });
  }

  public doNothing(){}

  public openWindowEditDepartament(params:iUser){
    this.userIdToChange=Number(params.userid);
    this.dialogChangeDepartament=true;
  }

  public opendDialogEditGrantRegistre(puserid: string){
    this.userIdToChange=Number(puserid);
    this.dialogEditGrantRegistre=true;
  }

  public askIfDeleteThis(params: iUser) {
    const vueInst = this;
    this.$q.dialog({
      title: 'Confirmare',
      message: 'Stergere '+params.email_address,
      cancel: true,
      persistent: true
    }).onOk(() => {
      ServicesNomUsers.deleteNomUser(params.userid).then(presponse=>{
        if(presponse.status==='success'){
          vueInst.refreshDataTableNomUsers();
        }else{
          vueInst.$q.notify({
            color: 'red',
            textColor: 'white',
            type: 'negative',
            message: presponse.message,
            position: 'top',
            timeout: 3500,
          });
        }
      })
    });
  }

  public getXls(){
    const vueInst = this;
    vueInst.ajaxGetXls=true;
    axios.get(`${CONFIG_ENV.URL_REPORTS.getXlsNomUsers}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'pplication/vnd.ms-excel'
        },
        responseType: 'blob'
      }).then((response: AxiosResponse) => {
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const objectUrl = window.URL.createObjectURL(blob)
      //window.open(objectUrl)
      const link = document.createElement('a');
      link.href = objectUrl;
      link.setAttribute('download', 'file.xlsx'); //or any other extension
      document.body.appendChild(link);
      link.click();
      link.remove();
      vueInst.ajaxGetXls=false;
    }).catch((error: any) => { alert(error) })
  }

  public get NomOrg():iOrganizatie[] {
    return this.storeNomenclatoare.NomOrganizatii;
  }

  public refreshDataTableNomUsers(){
    //console.log('refreshDataTableNomUsers');
    const vueInst = this;
    vueInst.visibleDialogEditUser=false;
    vueInst.tableDataNomUsers=[];
    ServicesNomUsers.getNomUsers().then((presponse)=>{
      vueInst.loadingData=false;
      if (presponse.status === 'success'){
        presponse.rows.forEach(puser=>{
          const org=vueInst.NomOrg.find(porg=>  porg.appid.toString()==puser.org_id);
          //console.log('org=%o',org)
          vueInst.tableDataNomUsers.push({
            ...puser,den_departament:(org?org.departament:''),den_directie:(org?org.divizie:'')
          });
        })

      }
    })
  }

  public askForModifyUserWan(puser:iUser){
    const vueInst = this;
    vueInst.$q.dialog({
      title:'Modificare user',
      message:'Introduceti userul de domeniu',
      prompt:{
        model:'',type:'text'
      },
      cancel: true,
      persistent: true
    }).onOk((pNewUserWan: any)=>{
      ServicesNomUsers.chgUserWanForUser(puser.userid,pNewUserWan).then(presponse=>{
        if(presponse.status=='success'){
          vueInst.tableDataNomUsers.find((user,pindex)=>{
            if(user.userid==puser.userid){
              vueInst.tableDataNomUsers[pindex].user_wan=pNewUserWan.toLowerCase();
            }
          });
          vueInst.$q.notify({
            color: 'teal',
            textColor: 'white',
            type: 'positive',
            message: presponse.message,
            position: 'top',
            timeout: 1000,
          });
        }
      })
    });
  }

  public askForModifyEmail(puser:iUser){
    const vueInst = this;
    vueInst.$q.dialog({
      title:'Modificare email',
      message:'Introduceti adresa de mail',
      prompt:{
        model:'',type:'email'
      },
      cancel: true,
      persistent: true
    }).onOk((pNewEmail: any)=>{
      ServicesNomUsers.chgEmailForUser(puser.userid,pNewEmail).then(presponse=>{
        if(presponse.status=='success'){
          vueInst.tableDataNomUsers.find((user,pindex)=>{
            if(user.userid==puser.userid){
              vueInst.tableDataNomUsers[pindex].email_address=pNewEmail.toLowerCase();
            }
          });
          vueInst.$q.notify({
            color: 'teal',
            textColor: 'white',
            type: 'positive',
            message: presponse.message,
            position: 'top',
            timeout: 1000,
          });
        }
      })
    });
  }

  public askIfDeleteUser(puser:iUser){
    const vueInst = this;
    vueInst.$q.dialog({
      title:'Confirmare',
      message:'Stergeti utilizatorul '+puser.first_name+' '+puser.last_name+'?',
      cancel: true,
      persistent: true
    }).onOk(()=>{
      ServicesNomUsers.deleteUser(puser.userid).then(presponse=>{
        if(presponse.status=='success'){
          vueInst.tableDataNomUsers.find((user,pindex)=>{
            if(user.userid==puser.userid){
              vueInst.tableDataNomUsers.splice(pindex,1);
            }
          });
          vueInst.$q.notify({
            color: 'teal',
            textColor: 'white',
            type: 'positive',
            message: presponse.message,
            position: 'top',
            timeout: 1000,
          });
        }
      })
    });
  }

  public askIfChangeDepartament(params:any){
    const vueInst = this;
    vueInst.$q.dialog({
      title: 'Confirmare',
      message: 'Departamentul de incadrare este '+ params.departament+'?',
      cancel: true,
      persistent: true
    }).onOk(() => {
      ServicesNomUsers.chgDepartamentForUser(vueInst.userIdToChange,params.appid).then(presponse=>{
        if(presponse.status=='success'){
          vueInst.$q.notify({
            color: 'teal',
            textColor: 'white',
            type: 'positive',
            message: presponse.message,
            position: 'top',
            timeout: 1000,
          });
        }
        vueInst.dialogChangeDepartament=false;
        vueInst.loadingData=true;
        vueInst.refreshDataTableNomUsers();
      });
    });
  }

  public openDialogChangeNume(puser: iUser){
    this.dialogChangeNume=true;
    this.userIdToChange=Number(puser.userid);
    this.new_first_name=puser.first_name;
    this.new_last_name=puser.last_name;
  }

  public updateNume(){
    const vueInst = this;
    ServicesNomUsers.chgNumeForUser(vueInst.userIdToChange, vueInst.new_first_name,vueInst.new_last_name).then(presponse=>{
      if(presponse.status=='success'){
        this.dialogChangeNume=false;
        vueInst.$q.notify({
          color: 'teal',
          textColor: 'white',
          type: 'positive',
          message: presponse.message,
          position: 'top',
          timeout: 1000,
        });
        vueInst.tableDataNomUsers.find((puser,pindex)=>{
          if(puser.userid==vueInst.userIdToChange.toString()){
            vueInst.$set(vueInst.tableDataNomUsers[pindex], 'last_name', vueInst.new_last_name)
            vueInst.$set(vueInst.tableDataNomUsers[pindex], 'first_name', vueInst.new_first_name)
          }
        });
      }
    });
  }



  public mounted() {
    //debugger;
    ///console.log('activated NomUSer')
    const vueInst = this;
    vueInst.loadingData=true;
    vueInst.refreshDataTableNomUsers();
    vueInst.storeNomenclatoare.set_currentpagetitle('Administrare Utilizatori');
  }
}
