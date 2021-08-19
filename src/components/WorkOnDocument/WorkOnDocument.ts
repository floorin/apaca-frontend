import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import moment from 'moment';
import axios from 'axios';
import {CONFIG_ENV} from '@/config';
import { FileUploadService } from 'v-file-upload';
import {humanReadableBytes} from '@/modules/utils';
import nomenclatoare from '@/store/nomenclatoare';
import DialogOpenScan from '@/components/DialogOpenScan/DialogOpenScan.vue';
import ExpeditiiDocument from '@/components/ExpeditiiDocument/ExpeditiiDocument.vue';
import ChangeTipDocument from '@/components/ChangeTipDocument/ChangeTipDocument.vue';
import {dateToStringDDMonYYYY} from '@/modules/utils';
import {ServicesDocument} from '@/modules/ServicesDocument';
import {ServicesScans} from '@/modules/ServicesScans';
import user from '@/store/user';
import {ServicesRepartizari} from '@/modules/ServicesRepartizari';
import iOrganizatie from '@/types/iOrganizatie';
import {Notify, scroll} from 'quasar';
import {denDepartamentFromOrg} from '@/modules/utils';
import {denPersoanaUtilizatorFromMarca} from '@/modules/utils';
import {ValidateEmail} from '@/modules/utils';
import iUser from '@/types/iUser';
import iDocument from '@/types/iDocument';
import iNomCateg from '@/types/iNomCateg';
import iNomTipDoc from '@/types/iNomTipDoc';
import iNomRegistru from '@/types/iNomCateg';
import iScan from '@/types/iScan';
import iRepartizare from '@/types/iRepartizare';
const { getScrollTarget, setScrollPosition } = scroll;

type OrNull<T> = { [K in keyof T]: T[K] | null }
type IDocument = OrNull<iDocument>;
interface IDocumentRepartizare extends IDocument{
  den_org_init:string|null,
  id_org_expeditor:number|null,
  nu_se_repartizeaza:string|null,
  finalizat_de_inregistrat:string|null,
  email_solicitant:string|null,
  marca_user_deponent:number|null,
  este_repartizat:string|null,
  data_repartizare:string|null,
}
@Component({components: {DialogOpenScan,ExpeditiiDocument,ChangeTipDocument}})
export default // @ts-ignore
// @ts-ignore
class WorkOnDocument extends Vue {
  @Prop({ default: '0' }) public readonly appid!: string;
  @Prop({ default: 'no' }) public readonly withFinalizeButton!: string
  @Prop({ default: 'no' }) public readonly withRepartizareButton!: string
  @Prop() public  fCloseDocumentWindow!: Function

  public docApp: IDocumentRepartizare;
  public loadingDocumentData:boolean = false;
  public loadingPdfForDownload:boolean = false;
  public dialogUploadFile:boolean = false;
  public loadingRepartizari:boolean = false;
  public isRepartizat:boolean = false;
  public isFinalizat:boolean = false;
  public myLocale:any;
  public $refs: any;
  public nuSeRepartizeaza:boolean = false;
  public uploadingFileToServer:boolean=false;
  public dialogAddDepartamentRepartizare:boolean=false;
  public showVisualEffectAddingDepartament:boolean=false;
  public uploadScanTitle: string  = '';
  public urlForUpload:string = '';
  public auTrecut2SecundeDeLaUltimulSearch:boolean = false;
  public headers:any= {};
  public storeNomenclatoare = getModule(nomenclatoare);
  public filesSelectedForUpload:any= [];
  public scans: iScan[] = [];
  public repartizari: iRepartizare[] = [];
  public denDepRepartizat:string='';
  public optionsOrganizatii: iOrganizatie[] = [];
  public listaOrganizatiiPentruRepartizare: iOrganizatie[] = [];
  public textSearchDepartament:string='';
  public userStore = getModule(user);

  constructor() {
    super();
    this.myLocale=CONFIG_ENV.myLocale;
    this.urlForUpload=CONFIG_ENV.URL_SCAN.uploadScan;
    this.docApp = {
      appid: null,
      id_registru: null,
      id_categ: null,
      id_tip_document: null,
      id_doc: null,
      tip_request: null,
      data_doc: null,
      categorie_solicitant: null,
      nume_denumire: null,
      cui: null,
      email_solicitant: null,
      titlu: null,
      descriere: null,
      nr_inreg: null,
      data_inreg: null,
      nr_file: null,
      este_confidential: null,
      ref_nr_doc: null,
      ref_data_doc: null,
      ref_id_registru: null,
      track_creation_date: null,
      id_org_expeditor: null,
      id_org_destinatar_init: null,
      id_org_destinatar_curent: null,
      finalizat_de_inregistrat: null,
      nu_se_repartizeaza:null,
      data_repartizare:null,
      este_repartizat:null,
      scans:[],
      repartizari:[],
      den_org_init:null,
      marca_user_deponent:null
    };
  }

  public resetDocument(){
    this.docApp = {
      appid: null,
      id_registru: null,
      id_categ: null,
      id_tip_document: null,
      id_doc: null,
      tip_request: null,
      data_doc: null,
      categorie_solicitant: null,
      nume_denumire: null,
      cui: null,
      email_solicitant: null,
      titlu: null,
      descriere: null,
      nr_inreg: null,
      data_inreg: null,
      nr_file: null,
      este_confidential: null,
      finalizat_de_inregistrat: null,
      ref_nr_doc: null,
      ref_data_doc: null,
      ref_id_registru: null,
      track_creation_date: null,
      id_org_expeditor: null,
      nu_se_repartizeaza:null,
      data_repartizare:null,
      este_repartizat:null,
      id_org_destinatar_init: null,
      id_org_destinatar_curent: null,
      scans:[],
      repartizari:[],
      den_org_init:null,
      marca_user_deponent:null
    }
  }

  public frenuntModificareTipDoc(){
    this.$refs.changeTipDocProxy.hide();
  }

  public getDocument() {
    const vueInst=this;
    ServicesDocument.getDocumentIntrare(Number(vueInst.appid)).then((presponse)=>{
      vueInst.loadingDocumentData=false;
      if(presponse.status==='success'){
        vueInst.docApp=JSON.parse(JSON.stringify(presponse.document));
        if(vueInst.docApp.finalizat_de_inregistrat && vueInst.docApp.finalizat_de_inregistrat=='y'){
          vueInst.isFinalizat=true;
        }
        if(vueInst.docApp.este_repartizat && vueInst.docApp.este_repartizat=='y'){
          vueInst.isRepartizat=true;
        }
        if(vueInst.docApp.nu_se_repartizeaza && vueInst.docApp.nu_se_repartizeaza=='y'){
          vueInst.nuSeRepartizeaza=true;
          vueInst.isRepartizat=true;
        }else{
          vueInst.nuSeRepartizeaza=false;
        }
        vueInst.denDepRepartizat=presponse.denDepRepartizat;
        vueInst.getScans();
        vueInst.getRepartizari();
      }
    });
  }

  public fModificareTipDoc(id_categ:number, id_tip_doc:number){
    const vueInst=this;
    //console.log('fModificareTipDoc id_categ=%o si id_tip_doc=%o',id_categ,id_tip_doc)
    if(id_categ.toString().length>0 && id_tip_doc.toString().length>0){
      vueInst.docApp.id_categ = id_categ;
      vueInst.docApp.id_tip_document = id_tip_doc;
    }
  }

  public onChangeNuSeRepartizeaza(){
    const vueInst=this;
    var p_NuSeRepartizeaza='';
    if(vueInst.nuSeRepartizeaza){ p_NuSeRepartizeaza='y';}else{{ p_NuSeRepartizeaza='n';}}
    ServicesDocument.NuSeRepartizeaza(Number(vueInst.appid),p_NuSeRepartizeaza).then((presponse)=>{
      if(presponse.status=='success'){
        vueInst.$q.notify({
          color: 'teal',
          textColor: 'white',
          type: 'positive',
          message: presponse.message,
          position: 'top',
          timeout: 1000,
        });
        if(p_NuSeRepartizeaza=='y'){
          vueInst.isRepartizat=true;
          // @ts-ignore
          vueInst.$eventHub.$emit('eventDocumentRepartizat', {action:'RepartizatDocument', appid:vueInst.appid});
          // @ts-ignore
          vueInst.$eventHub.$emit('eventCloseDrawerWithDocument', {action:'RepartizatDocument', appid:vueInst.appid});
          setTimeout(function(){ vueInst.fCloseDocumentWindow();}, 200);
        }
      }
    });
  }

  public getScans(){
    const vueInst=this;
    vueInst.uploadingFileToServer=true;
    ServicesScans.getScans(Number(vueInst.appid)).then((presponse)=>{
      vueInst.loadingDocumentData=false;
      vueInst.uploadingFileToServer=false;
      if(presponse.status==='success'){
        vueInst.scans=JSON.parse(JSON.stringify(presponse.rows));
      }
    });
  }

  public getRepartizari(){
    const vueInst=this;
    vueInst.uploadingFileToServer=true;
    ServicesRepartizari.getRepartizari(Number(vueInst.appid)).then((presponse)=>{
      vueInst.loadingDocumentData=false;
      vueInst.loadingRepartizari=false;
      if(presponse.status==='success'){
        vueInst.repartizari=JSON.parse(JSON.stringify(presponse.rows));
      }
    });
  }

  public tryUpdateNumeDenumire(pfunction:any){
    const vueInst=this;
    if(vueInst.docApp.nume_denumire){
      ServicesDocument.updateDocument(vueInst.appid,'nume_denumire',vueInst.docApp.nume_denumire).then(presponse=>{
        if(presponse.status=='success'){
          vueInst.$q.notify({
            color: 'teal',
            textColor: 'white',
            type: 'positive',
            message: presponse.message,
            position: 'top',
            timeout: 1000,
          });
          pfunction();
        }
      })
    }
  }

  public tryUpdateCui(pfunction:any){
    const vueInst=this;
    if(vueInst.docApp.cui){
      ServicesDocument.updateDocument(vueInst.appid,'cui',vueInst.docApp.cui).then(presponse=>{
        if(presponse.status=='success'){
          vueInst.$q.notify({
            color: 'teal',
            textColor: 'white',
            type: 'positive',
            message: presponse.message,
            position: 'top',
            timeout: 1000,
          });
          pfunction();
        }
      })
    }
  }

  public tryUpdateEmail(pfunction:any){
    const vueInst=this;
    if(vueInst.docApp.email_solicitant){
      ServicesDocument.updateDocument(vueInst.appid,'email_solicitant',vueInst.docApp.email_solicitant).then(presponse=>{
        if(presponse.status=='success'){
          vueInst.$q.notify({
            color: 'teal',
            textColor: 'white',
            type: 'positive',
            message: presponse.message,
            position: 'top',
            timeout: 1000,
          });
          pfunction();
        }
      })
    }
  }

  public tryUpdateTitlu(pfunction:any){
    const vueInst=this;
    if(vueInst.docApp.titlu){
      ServicesDocument.updateDocument(vueInst.appid,'titlu',vueInst.docApp.titlu).then(presponse=>{
        if(presponse.status=='success'){
          vueInst.$q.notify({
            color: 'teal',
            textColor: 'white',
            type: 'positive',
            message: presponse.message,
            position: 'top',
            timeout: 1000,
          });
          pfunction();
        }
      })
    }
  }

  public tryUpdateDescriere(pfunction:any){
    const vueInst=this;
    if(vueInst.docApp.descriere){
      ServicesDocument.updateDocument(vueInst.appid,'descriere',vueInst.docApp.descriere).then(presponse=>{
        if(presponse.status=='success'){
          vueInst.$q.notify({
            color: 'teal',
            textColor: 'white',
            type: 'positive',
            message: presponse.message,
            position: 'top',
            timeout: 1000,
          });
          pfunction();
        }
      })
    }
  }

  public tryUpdateNrFile(pfunction:any){
    const vueInst=this;
    if(vueInst.docApp.nr_file){
      ServicesDocument.updateDocument(vueInst.appid,'nr_file',vueInst.docApp.nr_file.toString()).then(presponse=>{
        if(presponse.status=='success'){
          vueInst.$q.notify({
            color: 'teal',
            textColor: 'white',
            type: 'positive',
            message: presponse.message,
            position: 'top',
            timeout: 1000,
          });
          pfunction();
        }
      })
    }
  }

  public openFormUploadFile(){
    this.filesSelectedForUpload=[];
    this.uploadScanTitle='';
    this.dialogUploadFile=true;
  }

  public get optionsRegistre(): iNomRegistru[] {
    return JSON.parse(JSON.stringify(this.storeNomenclatoare.NomRegistre));
  }

  public get optionsCategorii(): iNomCateg[] {
    return JSON.parse(JSON.stringify(this.storeNomenclatoare.NomCategorii));
  }

  public get optionsTipDoc(): iNomTipDoc[] {
    return JSON.parse(JSON.stringify(this.storeNomenclatoare.NomTipDoc));
  }

  public displayDataDoc() :string{
    const vueInst=this;
    if(vueInst.docApp.track_creation_date){
      const day =moment(vueInst.docApp.track_creation_date.substr(0,10), 'YYYY-MM-DD');
      return dateToStringDDMonYYYY(day);
    }else { return '';}
  }

  public displayDataRepartizare() :string{
    const vueInst=this;
    if(vueInst.docApp.data_repartizare){
      const day =moment(vueInst.docApp.data_repartizare.substr(0,10), 'YYYY-MM-DD');
      return dateToStringDDMonYYYY(day);
    }else { return '';}
  }

  public displayDataRef() :string{
    const vueInst=this;
    if(vueInst.docApp.ref_data_doc){
      const day =moment(vueInst.docApp.ref_data_doc.substr(0,10), 'YYYY-MM-DD');
      return dateToStringDDMonYYYY(day);
    }else { return '';}
  }

  public openFormAddDepartamentRepartizare(){
    this.auTrecut2SecundeDeLaUltimulSearch=true;
    this.textSearchDepartament='';
    this.optionsOrganizatii=[];
    this.dialogAddDepartamentRepartizare=true;
  }

  public askIfDeleteRepartizare(){
    const vueInst = this;
    vueInst.$q.dialog({
      title: 'Confirm',
      message: `Stergeti repartizarea pentru documentul ${vueInst.docApp.id_doc}?`,
      cancel: true,
      persistent: true
    }).onOk(() => {
      ServicesDocument.stergeRepartizarea(Number(vueInst.appid)).then(presponse=>{
        if(presponse.status==='success'){
          vueInst.$q.notify({
            color: 'green-4',
            textColor: 'white',
            type: 'positive',
            message: presponse.message,
            position: 'top',
            timeout: 1000,
          });
          // @ts-ignore
          vueInst.$eventHub.$emit('eventStergereRepartizareDocument', {appid:vueInst.appid});
          // @ts-ignore
          vueInst.$eventHub.$emit('eventCloseDrawerWithDocument', {action:'RepartizatDocument', appid:vueInst.appid});
          setTimeout(function(){ vueInst.fCloseDocumentWindow();}, 200);
        }
      });
    })
  }

  get user(): iUser {
    return this.userStore.user;
  }

  public prepareCoverPdfForDownload(){
    const vueInst = this;
    //@ts-ignore;
    vueInst.$eventHub.$emit('eventToPreviewCover',{action:'show_preview_file',appid:vueInst.appid});
/*    const vueInst = this;
    vueInst.loadingPdfForDownload=true;
    ServicesDocument.getPdfCoverDocument(Number(vueInst.appid)).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file.pdf'); //or any other extension
      document.body.appendChild(link);
      vueInst.loadingPdfForDownload=false;
      link.click();
      link.remove();
    });*/
  }

  public get getLinkToQrCode():string{
    return CONFIG_ENV.URL_DOCUMENT.qr_code+'/'+this.appid;
  }

  public finalizeazaInregistrareDocument(){
    const vueInst=this;
    ServicesDocument.finalizeazaInregistrareDocument(vueInst.appid).then(
      presult =>{
        if(presult.status=='success'){
          vueInst.isFinalizat=true;
          vueInst.$q.notify({
            color: 'teal',
            textColor: 'white',
            type: 'positive',
            message: presult.message,
            position: 'top',
            timeout: 1000,
          });
          if(vueInst.$router.currentRoute.name!='Dashboard'){
            vueInst.$router.push({name: 'Dashboard'});
          }else{
          // @ts-ignore
            vueInst.$eventHub.$emit('eventToMenuApp', {action:'InterogheazaNrPendingDocs'});
            // @ts-ignore
            vueInst.$eventHub.$emit('eventFromChildComponentToPendingGrid', {action:'FinalizatInregistrareDocument', appid:vueInst.appid});
            // @ts-ignore
            vueInst.$eventHub.$emit('eventFromChildComponentToDashboard', {action:'FinalizatInregistrareDocument', appid:vueInst.appid});
            // @ts-ignore
            vueInst.$eventHub.$emit('eventCloseDrawerWithDocument', {action:'FinalizatInregistrareDocument', appid:vueInst.appid});
            setTimeout(function(){ vueInst.fCloseDocumentWindow();}, 200);
          }
        }
      }
    );
  }

  public askIfRemoveScan(pscan:iScan){
    const vueInst = this;
    vueInst.$q.dialog({
      title: 'Confirm',
      message: `Stergeti fisierul reprezentand ${pscan.description}?`,
      cancel: true,
      persistent: true
    }).onOk(() => {
      ServicesScans.deleteScan(pscan.appid).then(presponse=>{
        if(presponse.status==='success'){
          vueInst.$q.notify({
            color: 'green-4',
            textColor: 'white',
            type: 'positive',
            message: presponse.message,
            position: 'top',
            timeout: 1000,
          });
          vueInst.scans.find((scan,index)=>{if(scan.appid==pscan.appid){vueInst.scans.splice(index,1);}})
        }
      });
    })
  }

  public getDenTipDocument(pIdTipDoc: number): string{
    const vueInst=this;
    let result='';
    const TipDoc = vueInst.storeNomenclatoare.NomTipDoc.find( tipdoc =>{
      return tipdoc.id_tip_doc == pIdTipDoc;
    });
    if(TipDoc){
      result=TipDoc.den_lang_1;
    }
    return result;
  }

  public humanReadableBytes(nrPfBytes:number): string{
    return humanReadableBytes(nrPfBytes);
  }

  public myUploadFile2() {
    const vueInst=this;
    vueInst.uploadingFileToServer=true;
    setTimeout(()=>{ vueInst.uploadingFileToServer=false;vueInst.dialogUploadFile=false;  vueInst.getScans(); }, 1000);
    const fileUpload = new FileUploadService(
      this.urlForUpload,
      this.headers,
      this.onProgress
    )
    // @ts-ignore
    fileUpload.upload(vueInst.filesSelectedForUpload, { appidDoc:vueInst.appid, description:vueInst.uploadScanTitle,userid:vueInst.user.userid,token:vueInst.user.csrf_token})
      .then((e: any) => {
        // Handle success
        //console.log('fileUpload1 fileUpload1 fileUpload1 e=%o',e.target.response.status)
        if(e.target && e.target.response.status && e.target.response.status=='error'){
          Notify.create({
            color: 'red',
            textColor: 'white',
            type: 'negative',
            message: e.target.response.message,
            position: 'top',
            timeout: 3500,
          })
        }else{
          // @ts-ignore
          vueInst.$eventHub.$emit('eventFromChildComponentToPendingGrid', {action:'IncarcatScanLaDocumentAppid', appid:vueInst.appid});
        }
      })
      .catch((e: any) => {
        // Handle error
        //console.log('fileUpload2 fileUpload2 fileUpload2 e=%o',e)
      })
  }

  public myUploadFile() {
    const vueInst=this;
    vueInst.uploadingFileToServer=true;
    //const instance = axios.create({withCredentials: true})

    //setTimeout(()=>{ vueInst.uploadingFileToServer=false;vueInst.dialogUploadFile=false;  vueInst.getScans(); }, 1000);
/*    let formData = new FormData();
    formData.append('file', vueInst.filesSelectedForUpload);
    formData.append('appidDoc', vueInst.appid);
    formData.append('description', vueInst.uploadScanTitle);
    formData.append('userid', vueInst.user.userid);
    formData.append('token', vueInst.user.csrf_token);

    instance.post( vueInst.urlForUpload,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    ).then(function(presponse){
      //@ts-ignore
      vueInst.$eventHub.$emit('eventFromChildComponentToPendingGrid', {action:'IncarcatScanLaDocumentAppid', appid:vueInst.appid});
      if(presponse && presponse.data){
        if(presponse.data.status!='success'){
          Notify.create({
            color: 'red',
            textColor: 'white',
            type: 'negative',
            message: presponse.data.message,
            position: 'top',
            timeout: 3500,
          })
        }
      }
      //console.log('presponse=%o',presponse)
    })
      .catch(function(presponse){
        //console.log('presponse=%o',presponse)
        //console.log('FAILURE!!');
      });*/

   const fileUpload = new FileUploadService(
      this.urlForUpload,
      this.headers,
      this.onProgress
    )
    fileUpload.upload(vueInst.filesSelectedForUpload, { appidDoc:vueInst.appid, description:vueInst.uploadScanTitle,userid:vueInst.user.userid,token:vueInst.user.csrf_token})
      .then((e: any) => {
        vueInst.dialogUploadFile=false;
        vueInst.getScans();
        if(e.target && e.target.response.status && e.target.response.status=='error'){
          Notify.create({
            color: 'red',
            textColor: 'white',
            type: 'negative',
            message: e.target.response.message,
            position: 'top',
            timeout: 3500,
          })
        }else{
          //@ts-ignore
          vueInst.$eventHub.$emit('eventFromChildComponentToPendingGrid', {action:'IncarcatScanLaDocumentAppid', appid:vueInst.appid});
        }
      })
      .catch((e: any) => {
      })
  }

  public prepareForUpload(event:any){
    this.filesSelectedForUpload = event.target.files[0];
  }

  public get checkIfFileIsSelected():boolean{
    return this.filesSelectedForUpload.length != 0;
  }
  public onProgress(event:any) {
    // Handdle the progress
  }

  public inputOrgRepartizare(pval:string){
    this.auTrecut2SecundeDeLaUltimulSearch=false;
    this.getOptionsOrganizatii(pval);
  }

  public getOptionsOrganizatii(psearchText:string){
    const vueInst = this;
/*    ServicesSearch.optionsOrganizatii(psearchText).then(presponse=>{
      if(presponse.status=='success'){
        vueInst.optionsOrganizatii=presponse.rows;
        setTimeout(()=>{ vueInst.auTrecut2SecundeDeLaUltimulSearch=true;}, 1000);
      }
    });*/
    vueInst.optionsOrganizatii=vueInst.storeNomenclatoare.NomOrganizatii.filter(porg=>porg.departament.indexOf(psearchText.toUpperCase())!==-1);
    setTimeout(()=>{ vueInst.auTrecut2SecundeDeLaUltimulSearch=true;}, 500);
  }

  public removeDepartamentRepartizare(pindex:number){
    this.listaOrganizatiiPentruRepartizare.splice(pindex,1);
  }

  public repartizeazaDocument(){
    const vueInst = this;
    ServicesDocument.repartizeaza(Number(vueInst.appid), vueInst.listaOrganizatiiPentruRepartizare)
      .then(presponse=>{
        if(presponse.status=='success'){
          vueInst.isRepartizat=true;
          vueInst.docApp.este_repartizat='y';
          vueInst.$q.notify({
            color: 'green-4',
            textColor: 'white',
            type: 'positive',
            message: presponse.message,
            position: 'top',
            timeout: 1000,
          });
          // @ts-ignore
          vueInst.$eventHub.$emit('eventDocumentRepartizat', {action:'RepartizatDocument', appid:vueInst.appid});
          // @ts-ignore
          vueInst.$eventHub.$emit('eventCloseDrawerWithDocument', {action:'RepartizatDocument', appid:vueInst.appid});
          setTimeout(function(){ vueInst.fCloseDocumentWindow();}, 200);
        }
      })
  }

  public denDepartamentFromOrg(pOrgId:number){
    return denDepartamentFromOrg(pOrgId);
  }

  public denPersoanaUtilizatorFromMarca(pOrgId:number){
    return denPersoanaUtilizatorFromMarca(pOrgId);
  }

  public selectOrganizatieFromOption(porganizatie: iOrganizatie){
    const vueInst = this;
    vueInst.$q.dialog({
      title: 'Confirmare',
      message: 'Adaugati '+porganizatie.departament+' in lista de repartizat?',
      cancel: true,
      persistent: true
    }).onOk(() => {
      vueInst.dialogAddDepartamentRepartizare=false;
      vueInst.textSearchDepartament='';
      vueInst.optionsOrganizatii=[];
      if(vueInst.listaOrganizatiiPentruRepartizare.find(item=>{
        return item.appid==porganizatie.appid;
      })){
        vueInst.$q.notify({
          color: 'teal',
          textColor: 'white',
          type: 'negative',
          message: 'Deja selectat!',
          position: 'top',
          timeout: 1000,
        });
      }else{
        vueInst.showVisualEffectAddingDepartament=true;
        setTimeout(()=>{ vueInst.showVisualEffectAddingDepartament=false;
          vueInst.listaOrganizatiiPentruRepartizare.push(porganizatie);
        }, 500);
      }
      vueInst.goToDivBtnRepartizeaza();
    });
  }

  public ValidateEmail(pEmail:string):boolean{
    return ValidateEmail(pEmail);
  }

  public goToDivBtnRepartizeaza(){
    const el: HTMLElement = document.getElementById('div_btn_repartizeaza')!;
    const target = getScrollTarget(el)
    const offset = el.offsetTop
    const duration = 300;
    setScrollPosition(target, offset, duration);
  }

  @Watch('appid', { immediate: true })
  public onAppidChanged(newVal: string, oldVal: string) {
    //console.log('onAppidChanged in WorkOnDocument')
    const vueInst = this;
    vueInst.resetDocument();
    vueInst.scans = [];
    vueInst.repartizari = [];
    vueInst.listaOrganizatiiPentruRepartizare=[];
    vueInst.loadingDocumentData=true;
    if(Number(newVal) !=0 && Number(vueInst.appid) != 0) {
                vueInst.isRepartizat=false;
                vueInst.isFinalizat=false;
                vueInst.getDocument();
                vueInst.loadingRepartizari=true;
    }
  }
}
