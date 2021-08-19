import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import moment from 'moment';
import {CONFIG_ENV} from '@/config';
import {humanReadableBytes} from '@/modules/utils';
import nomenclatoare from '@/store/nomenclatoare';
import iScan from '@/types/iScan';
import {dateToStringDDMonYYYY} from '@/modules/utils';
import {ServicesNomUsers} from '@/modules/ServicesNomUsers';
import {ServicesScans} from '@/modules/ServicesScans';
import {Notify} from 'quasar';
type OrNull<T> = { [K in keyof T]: T[K] | null }

@Component({components: {}})
export default // @ts-ignore
// @ts-ignore
class DialogOpenScan extends Vue {
  @Prop({ default: '0' }) public readonly appid!: string;
  public loadingInfoScan:boolean = false;
  public myLocale:any;
  public $refs: any;
  public uploadingFileToServer:boolean=false;
  public uploadScanTitle: string  = '';
  public urlForUpload:string = '';
  public headers:any= { 'access-token': '<your-token>' };
  public storeNomenclatoare = getModule(nomenclatoare);
  public filesSelectedForUpload:any= [];
  public scan: iScan;
  // private userStore=getModule(User);

  constructor() {
    super();
    this.myLocale=CONFIG_ENV.myLocale;
    this.urlForUpload=CONFIG_ENV.URL_SCAN.uploadScan;
    this.scan={
      appid: 0,
      file_name: '',
      description: '',
      file_size: 0,
      file_ext: '',
      track_date: '',
      track_user: '',
      appid_doc: 0
    }
  }


  public getInfoScan(){
    const vueInst=this;
    vueInst.loadingInfoScan=true;
    ServicesScans.getInfoScan(Number(vueInst.appid)).then((presponse)=>{
      vueInst.loadingInfoScan=false;
      if(presponse.status==='success'){
        vueInst.scan=JSON.parse(JSON.stringify(presponse.scan));
        // tslint:disable-next-line:no-shadowed-variable
        ServicesNomUsers.getUserByMarca(vueInst.scan.track_user).then( presponse =>{
          if(presponse.status=='success'){
            vueInst.scan.track_user=presponse.user.first_name+' '+presponse.user.last_name;
          }
        });
      }
    });
  }


  public displayDataDoc() :string{
    const vueInst=this;
    if(vueInst.scan.track_date){
      const day =moment(vueInst.scan.track_date.substr(0,10), 'YYYY-MM-DD');
      return dateToStringDDMonYYYY(day);
    }else { return '';}
  }

  public humanReadableBytes(nrPfBytes:number): string{
    return humanReadableBytes(nrPfBytes);
  }

  public openPreviewForm(pappid: number){
    const vueInst = this;
    //@ts-ignore;
    vueInst.$eventHub.$emit('eventToPreviewScan',{action:'show_preview_file',scan_appid:pappid});
  }

  public descarcaScan(pappid: number){
    const vueInst = this;
    //@ts-ignore;
    fetch(`${CONFIG_ENV.URL_SCAN.downloadScanFromApp}/${pappid}`, {
      credentials: 'include'
    })
      .then(resp => resp.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // the filename you want
        a.download = vueInst.scan.file_name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        Notify.create({
          color: 'teal',
          textColor: 'white',
          type: 'negative',
          message: 'Fisierul a fost descarcat!',
          position: 'top',
          timeout: 500,
        })
      })
      .catch(() => {
        Notify.create({
          color: 'red',
          textColor: 'white',
          type: 'negative',
          message: 'Eroare! Fisierul nu poate fi descarcat!',
          position: 'top',
          timeout: 3500,
        })
      });
  }

  @Watch('appid', { immediate: true })
  public onAppidChanged(newVal: string, oldVal: string) {
    const vueInst = this;
    vueInst.loadingInfoScan=true;
    if(Number(newVal) !=0 && Number(vueInst.appid) != 0) {
      vueInst.getInfoScan();
    }
  }
}
