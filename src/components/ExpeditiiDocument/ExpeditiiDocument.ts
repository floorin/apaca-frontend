import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import moment from 'moment';
import {CONFIG_ENV} from '@/config';
import {dateToStringDDMonYYYY} from '@/modules/utils';
import {ServicesExpeditii} from '@/modules/ServicesExpeditii';
import {Notify, scroll} from 'quasar';
import iExpeditie from '@/types/iExpeditie';
import iUser from '@/types/iUser';
import user from '@/store/user';
const { getScrollTarget, setScrollPosition } = scroll;

type OrNull<T> = { [K in keyof T]: T[K] | null }

@Component({components: {}})
export default // @ts-ignore
// @ts-ignore
class ExpeditiiDocument extends Vue {
  @Prop({ default: '0' }) public readonly appid!: string;
  public loadingExpeditii:boolean = false;
  public savingExpedition:boolean = false;
  public myLocale:any;
  public $refs: any;
  public newExpeditie:iExpeditie;
  public arrExpeditii:iExpeditie[]=[];
  public userStore = getModule(user);

  public thumbStyle:any = {
    right: '4px',
    borderRadius: '5px',
    backgroundColor: '#027be3',
    width: '5px',
    opacity: 0.75
  }

  public barStyle:any = {
    right: '2px',
    borderRadius: '9px',
    backgroundColor: '#027be3',
    width: '9px',
    opacity: 0.2,
  }

  constructor() {
    super();
    this.myLocale=CONFIG_ENV.myLocale;
    this.newExpeditie={
      appid: 0,
      appid_doc: 0,
      awb_nr: '',
      awb_data: '',
      awb_detalii: ''
    }
  }

  public resetExpeditie(){
    this.newExpeditie={
      appid: 0,
      appid_doc: 0,
      awb_nr: '',
      awb_data: '',
      awb_detalii: ''
    }
  }


  public getExpeditii(){
    const vueInst=this;
    ServicesExpeditii.getExpeditii(vueInst.appid).then(presponse=>{
      vueInst.loadingExpeditii=false;
      if(presponse.status==='success'){
        vueInst.arrExpeditii=JSON.parse(JSON.stringify(presponse.rows));
      }
    });
  }

  public saveNewExpeditie(){
    const vueInst=this;
    vueInst.savingExpedition=true;
    ServicesExpeditii.addNewExpeditie(vueInst.appid,vueInst.newExpeditie).then(presponse=>{
      vueInst.savingExpedition=false;
      if(presponse.status==='success'){
        vueInst.$q.notify({
          color: 'teal',
          textColor: 'white',
          type: 'positive',
          message: presponse.message,
          position: 'top',
          timeout: 1000,
        });
        vueInst.resetExpeditie();
        vueInst.$refs.refNewExpeditie.hide();
        vueInst.getExpeditii();
      }
    });
  }


  public removeExpeditie(pexpeditie:iExpeditie,pindex:number){
    const vueInst=this;
    vueInst.$q.dialog({
      title: 'Confirm',
      message: `Stergeti expeditia ${pexpeditie.awb_nr}/${pexpeditie.awb_data}?`,
      cancel: true,
      persistent: true
    }).onOk(() => {
      ServicesExpeditii.removeExpeditie(pexpeditie.appid).then(presponse=>{
        vueInst.savingExpedition=false;
        if(presponse.status==='success'){
          vueInst.$q.notify({
            color: 'teal',
            textColor: 'white',
            type: 'positive',
            message: presponse.message,
            position: 'top',
            timeout: 1000,
          });
          vueInst.getExpeditii();
        }
      });
    })


  }




  get user(): iUser {
    return this.userStore.user;
  }



  @Watch('appid', { immediate: true })
  public onAppidChanged(newVal: string, oldVal: string) {
    //console.log('onAppidChanged in WorkOnDocument')
    const vueInst = this;
    vueInst.arrExpeditii = [];
    if(Number(newVal) !=0 && Number(vueInst.appid) != 0) {
      vueInst.loadingExpeditii=true;
      vueInst.getExpeditii();
    }
  }
}
