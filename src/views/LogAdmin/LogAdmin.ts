import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import nomenclatoare from '@/store/nomenclatoare';
import {getModule} from 'vuex-module-decorators';
import {ServicesNomUsers} from '@/modules/ServicesNomUsers';
import {ServicesSearch} from '@/modules/ServicesSearch';
import iLogUser from '@/types/iLogUser';
import iLogDoc from '@/types/iLogDoc';
import {CONFIG_ENV} from '@/config';
import iNomRegistru from '@/types/iNomCateg';
interface iOptionUser{
  userid:string,
  name: string,
}

interface iDocumentIdentificat{
  create_de: string,
  data_doc: string,
  id_doc: string,
  tip_document: string
}

@Component({components: {}})
export default class LogAdmin extends Vue {
  // tslint:disable-next-line:ban-types
  public titleTableLogUser: string = '';
  public titleTableLogDoc: string = '';
  public filterInTableLogUser:string = '';
  public filterInTableLogDoc:string = '';
  public loadingDataLogUser: boolean = false;
  public loadingDataLogDoc: boolean = false;
  public model_search_user: string = '';
  public splitterTypeOfLogs: string = '';
  public pDocumentIdentificat: iDocumentIdentificat={
    create_de: '',
    data_doc: '',
    id_doc: '',
    tip_document: ''
  }
  public data_start: string = '';
  public data_end: string = '';
  public myLocale: any;
  public log_for_doc_id_doc: number|null = null;
  public log_for_doc_id_registru: number|null = null;
  public titleTableLoguser:string='';
  public optionsUsers:iOptionUser[]=[];
  public allUsers:iOptionUser[]=[];
  public tableDataLogUser:iLogUser[]=[];
  public tableDataLogDoc:iLogDoc[]=[];
  public storeNomenclatoare = getModule(nomenclatoare);
  public myPagination:any={
    rowsPerPage:15
  }
  public visibleColumnsLogsUser: string[] = [ 'track_date','track_user', 'tip_operatie', 'id_doc','explicatie'];
  public  columnsLogsUser: any = [
    { name: 'track_date', label: 'track_date', field: 'track_date', align: 'left' },
    { name: 'track_user', label: 'track_user', field: 'track_user', align: 'left' },
    { name: 'tip_operatie', label: 'tip_operatie', field: 'tip_operatie', align: 'left', sortable: true },
    { name: 'id_doc', label: 'id_doc', field: 'id_doc', align: 'left' },
    { name: 'explicatie', label: 'explicatie', field: 'explicatie', align: 'left' }
  ];

  public visibleColumnsLogsDoc: string[] = [ 'track_date','track_user','first_name','last_name', 'tip_operatie', 'id_doc','explicatie'];
  public  columnsLogsDoc: any = [
    { name: 'track_date', label: 'track_date', field: 'track_date', align: 'left' },
    { name: 'track_user', label: 'track_user', field: 'track_user', align: 'left' },
    { name: 'first_name', label: 'first_name', field: 'first_name', align: 'left' },
    { name: 'last_name', label: 'last_name', field: 'last_name', align: 'left' },
    { name: 'tip_operatie', label: 'tip_operatie', field: 'tip_operatie', align: 'left', sortable: true },
    { name: 'id_doc', label: 'id_doc', field: 'id_doc', align: 'left' },
    { name: 'explicatie', label: 'explicatie', field: 'explicatie', align: 'left' }
  ];

  constructor() {
    super();
    this.myLocale=CONFIG_ENV.myLocale;
  }

  public getLogsUser(){
    const vueInst=this;
    vueInst.loadingDataLogUser=true;
    ServicesNomUsers.getActionLogForUser(vueInst.model_search_user,vueInst.data_start,vueInst.data_end).then(presponse=>{
      vueInst.loadingDataLogUser=false;
      if(presponse.status=='success'){
        vueInst.titleTableLogUser='Loguri utilizator '+presponse.user_name;
        vueInst.tableDataLogUser=presponse.rows;
      }
    });
  }

  public getLogsDoc(){
    const vueInst=this;
    vueInst.loadingDataLogDoc=true;
    if(vueInst.log_for_doc_id_registru && vueInst.log_for_doc_id_doc) {
      ServicesSearch.getActionLogForDoc(vueInst.log_for_doc_id_registru, vueInst.log_for_doc_id_doc).then(presponse => {
        vueInst.loadingDataLogDoc = false;
        if (presponse.status == 'success') {
          vueInst.pDocumentIdentificat.create_de=presponse.create_de;
          vueInst.pDocumentIdentificat.data_doc=presponse.data_doc;
          vueInst.pDocumentIdentificat.id_doc=presponse.id_doc;
          vueInst.pDocumentIdentificat.tip_document=presponse.tip_document;
          vueInst.tableDataLogDoc = presponse.rows;
        }
      });
    }
  }

  public getNomUsers() {
    //console.log('refreshDataTableNomUsers');
    const vueInst = this;
    ServicesNomUsers.getNomUsers().then((presponse) => {
      if (presponse.status === 'success') {
        presponse.rows.forEach(puser => {
          vueInst.allUsers.push({
            userid: puser.userid,
            name: puser.last_name + ' ' + puser.first_name
          });
        })
      }
    });
  }

  public filterFn(val:any, update:any) {
    if (val === '') {
      update(() => {
        this.optionsUsers = this.allUsers
      })
      return
    }

    update(() => {
      const needle = val.toLowerCase()
      this.optionsUsers = this.allUsers.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
    })
  }

  public  get visibleLogsUserBtn(){
    return this.data_start.length>0 && this.data_end.length>0 && this.model_search_user;
  }

  public get visibleLogsDocBtn(){
    return this.log_for_doc_id_registru && this.log_for_doc_id_doc && this.log_for_doc_id_registru.toString().length>0 && this.log_for_doc_id_doc.toString().length>0;
  }
  public get optionsRegistre(): iNomRegistru[] {
    // @ts-ignore
    return this.storeNomenclatoare.NomRegistre.filter((pregistru:iNomRegistru)=>{
      return pregistru.activ=='y';
    })
  }

  public created(){
    const vueInst=this;
    vueInst.getNomUsers();
    vueInst.storeNomenclatoare.set_currentpagetitle('Administrator - Loguri');
  }
}
