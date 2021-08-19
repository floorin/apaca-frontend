import { Component, Vue } from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import axios, {AxiosPromise} from 'axios';
import {LocalStorage, Notify} from 'quasar';
import {CONFIG_ENV} from '@/config';
import {ServicesNomUsers} from './modules/ServicesNomUsers';
import user from '@/store/user';
import nomenclatoare from '@/store/nomenclatoare';
import iUser from '@/types/iUser';
import MenuApp from './components/MenuApp/MenuApp.vue';
import {ServicesNomCateg} from '@/modules/ServicesNomCateg';
import {ServicesNomTipDoc} from '@/modules/ServicesNomTipDoc';
import {ServicesRegistre} from '@/modules/ServicesRegistre';
import {ServicesDocument} from '@/modules/ServicesDocument';
import {ServicesHrOrg} from '@/modules/ServicesHrOrg';

import iDocumentFastSearch from '@/types/iDocumentFastSearch';
import WorkOnDocument from '@/components/WorkOnDocument/WorkOnDocument.vue';
import moment from 'moment';
import {dateToStringDDMonYYYY} from '@/modules/utils';
/*
var MockAdapter = require('axios-mock-adapter');
var mock = new MockAdapter(axios);
mock.onGet('/loadApp').reply(200, {
    userData:{ username:'Florin Codreanu',
        id:'florin.codreanu@bcr.ro',
        empno:12789}
});
*/

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// axios.defaults.headers.common['X-CSRF-TOKEN'] = '1t6bh0lwh72pv.2k9aurnh5tk44';

@Component({components: {MenuApp, WorkOnDocument}})
export default class App extends Vue {
  public leftDrawerOpen: boolean = false;
  public rightDrawerOpen: boolean = false;
  public showPreviewFileOnDesktop: boolean = false;
  public showPreviewFileOnMobile: boolean = false;
  public downloadingFile: boolean = false;
  public nimic: boolean = false;
  public inputFastSearch: any = '';
  public nr_of_recordsFastSearch: number=0;
  public loadingResultForFastSearch: boolean=false;
  public appidForScan: number =0;
  public titleForPreviewForm = '';
  public withFinalizeButton: string = 'no';
  public withRepartizareButton: string = 'no';
  public urlBlobForPreviewFile: any = null;
  public $refs: any;
  public nrRanduriTabel:number=10;
  public appidDocToWorkOnIt: number=0;
  public sessionIsValid: boolean = false;
  public optionsFastSearch: Array<{ track_creation_date: string; den_registru: string; tip_request: string; appid: number; nume_denumire: string; id_doc: number; den_tip_doc: string }> = [];
  public userStore = getModule(user);
  public storeNomenclatoare = getModule(nomenclatoare);
  public div_el: HTMLDivElement | undefined;
  public iframe: any;
  public mesajSeLoadingNomenclatoare='Se incarca nomenclatoarele... Va rugam, asteptati!...';
  constructor() {
    super();
  }

  get user(): iUser {
    return this.userStore.user;
  }

  public get StatusNomenclatoare():boolean{
    const statusNomenclatoare=this.storeNomenclatoare.nomTipDocIsOK && this.storeNomenclatoare.nomCategIsOK && this.storeNomenclatoare.nomRegistreIsOK && this.storeNomenclatoare.nomOrgIsOK;
    return statusNomenclatoare;
  }

  public getNomenclatoareAndGoToRequestedComponent(){
    console.log('%cgetNomenclatoareAndGoToRequestedComponent<-------------------------', "color: red;font-size:16px;")
    const vueInst = this;
    const willUpdateStoreNomCategFromDB = new Promise(
      (resolve, reject) => {
        console.log('%cwillUpdateStoreNomCategFromDB from app.ts', "color: red;font-size:16px;")
        const storeNomenclatoare = getModule(nomenclatoare);
        ServicesNomCateg.getNomCateg().then((presponse) => {
          if (presponse.status === 'success') {
            storeNomenclatoare.set_nomcategorii(JSON.parse(presponse.rows));
            resolve('success');
          } else {
            reject('error');
          }
        });
      });
    const willUpdateStoreNomTipDocsFromDB = new Promise(
      (resolve, reject) => {
        const storeNomenclatoare = getModule(nomenclatoare);
        ServicesNomTipDoc.getNomTipDoc().then((presponse) => {
          if (presponse.status === 'success') {
            storeNomenclatoare.set_nomtipdoc(JSON.parse(presponse.rows));
            resolve('success');
          }
          else {
            reject('error');
          }
        });
      });
  const willUpdateStoreNomOrganizatiiFromDB = new Promise(
      (resolve, reject) => {
        const storeNomenclatoare = getModule(nomenclatoare);
        ServicesHrOrg.getNomOrganizatii().then((presponse) => {
          if (presponse.status === 'success') {
            storeNomenclatoare.set_nomorganizatii(presponse.rows);
            resolve('success');
          }
          else {
            reject('error');
          }
        });
      })

  const willUpdateStoreNomRegistreFromDB = new Promise(
      (resolve, reject) => {
        const storeNomenclatoare = getModule(nomenclatoare);
        ServicesRegistre.getNomRegistre().then((presponse) => {
          if (presponse.status === 'success') {
            storeNomenclatoare.set_nomregistre(JSON.parse(JSON.stringify(presponse.rows)));
            resolve('success');
          }
          else {
            reject('error');
          }
        });
      })

    const willUpdatePersoaneUtilizatoareDB = new Promise(
      (resolve, reject) => {
        const storeNomenclatoare = getModule(nomenclatoare);
        ServicesNomUsers.getNomPersoaneUtilizatoare().then((presponse) => {
          if (presponse.status === 'success') {
            storeNomenclatoare.set_nompersoane_utilizatoare(JSON.parse(JSON.stringify(presponse.rows)));
            resolve('success');
          }
          else {
            reject('error');
          }
        });
      })
    //ServicesNomCateg.updateStoreNomCategFromDB();
    //ServicesNomTipDoc.updateStoreNomTipDocsFromDB();
    Promise.all([willUpdateStoreNomCategFromDB, willUpdateStoreNomTipDocsFromDB, willUpdateStoreNomRegistreFromDB, willUpdateStoreNomOrganizatiiFromDB, willUpdatePersoaneUtilizatoareDB])
      .then(result => {
        console.log('Promise.all cu succes!');
        //console.log(result); //["success", "success", "success", "success"]
        const appidToView=vueInst.$router.currentRoute.params.appid;
        const currentRouteName=vueInst.$router.currentRoute.name;
        if(currentRouteName == 'ViewDocument') {
          vueInst.$router.push({name: 'ViewDocument', params: { appid: appidToView }}).catch(err => {console.log('already there')});
        }else{
          vueInst.$router.push({name: 'Home'});
        }
      })
      .catch(error => console.log(`Error in executing getNomenclatoareAndGoToRequestedComponent ${error}`))
  }

  public showOptionsFastSearch() {
      //console.log('showOptionsFastSearch');
      // this.$refs.refOptionsFastSearch.show();
    }

  public putFocusBackToFastSearch(){
    this.$refs.refInputFastSearch.focus();
  }

  public setNrRanduriTabel(){
    localStorage.setItem('nrRanduriTabel', this.nrRanduriTabel.toString());
  }

  public getDocumentFromFastSearch(params: any){
    const vueInst = this;
    vueInst.$refs.refOptionsFastSearch.hide();
    // console.log('getDocumentFromFastSearch vueInst.inputFastSearch=%o params=%o',vueInst.inputFastSearch,params);
    vueInst.rightDrawerOpen=true;
    vueInst.appidDocToWorkOnIt=params.appid;
    // @ts-ignore
    // document.getElementById('span_pt_simulate_click').click();
    // @ts-ignore
    // document.getElementById('span_pt_simulate_click').click();
  }

  public getOptionSDocumentsFastSearch(pInputSearch: string){
    const vueInst = this;
    vueInst.loadingResultForFastSearch=true;
    vueInst.$refs.refOptionsFastSearch.show();
    ServicesDocument.FastSearch(pInputSearch).then(presponse=>{
      if(presponse.status=='success'){
        vueInst.nr_of_recordsFastSearch=presponse.nr_of_records;
        vueInst.optionsFastSearch=presponse.rows.map(pDocument=>{
          const day =moment(pDocument.track_creation_date.substr(0,10), 'YYYY-MM-DD');
          const dataDocToDisplayInFastSearch = dateToStringDDMonYYYY(day);
          const tmpTipDoc=vueInst.storeNomenclatoare.NomTipDoc.find(ptipdoc=>ptipdoc.id_tip_doc==pDocument.id_tip_document);
          const tmpRegistru=vueInst.storeNomenclatoare.NomRegistre.find(pregistru=>pregistru.id_registru==pDocument.id_registru);
          return{
            appid: Number(pDocument.appid),
            id_doc: Number(pDocument.id_doc),
            den_tip_doc: (tmpTipDoc?tmpTipDoc.den_lang_1:''),
            den_registru: (tmpRegistru?tmpRegistru.den_registru_lang_1:''),
            tip_request: pDocument.tip_request,
            nume_denumire: pDocument.nume_denumire,
            track_creation_date: dataDocToDisplayInFastSearch
          }});
      }
      vueInst.$refs.refOptionsFastSearch.show();
      vueInst.loadingResultForFastSearch=false;
    });
  }

  public clearInputFastSearch(){
    this.inputFastSearch='';
    this.loadingResultForFastSearch=false;
    this.$refs.refOptionsFastSearch.hide();
  }

public getAppUser() {
    const vueInst = this;
    const $_GET = {};
    setTimeout(()=>{ vueInst.mesajSeLoadingNomenclatoare='Nomenclatoarele nu au putut fi incarcate! Apasati F5 pentru a incerca din nou! ' }, 10000);
    if(document.location.toString().indexOf('?') !== -1) {
      const query = document.location
        .toString()
        // get the query string
        .replace(/^.*?\?/, '')
        // and remove any existing hash string (thanks, @vrijdenker)
        .replace(/#.*$/, '')
        .split('&');

      for(let i=0, l=query.length; i<l; i++) {
        const aux = decodeURIComponent(query[i]).split('=');
        // @ts-ignore
        $_GET[aux[0]] = aux[1];
      }
    }
  let puser:string='x';
     // @ts-ignore
  if($_GET.bf){puser=$_GET.bf;}
  //localStorage.clear();
  ServicesNomUsers.getCurrentUserFromAD(puser).then((presult) => {
    //console.log('%cSe incarca userul din baza de date', "color: blue;font-size:18px;");
      // tslint:disable-next-line:no-console
      // console.log('presult=%o', presult);
      // tslint:disable-next-line:triple-equals
      if (presult.status == 'success') {
        console.log('%cS-a incarcat userul din baza de date', "color: blue;font-size:18px;");
        vueInst.sessionIsValid=true;
        vueInst.userStore.set_user(presult.user);
        localStorage.setItem('token', presult.user.csrf_token);
        localStorage.setItem('statusAuth', 'yes');
        localStorage.setItem('userid', presult.user.userid);
        if(localStorage.getItem('nrRanduriTabel')){
          this.nrRanduriTabel=Number(localStorage.getItem("nrRanduriTabel"));
        }else{
          this.nrRanduriTabel=10;
          localStorage.setItem('nrRanduriTabel', this.nrRanduriTabel.toString());
        }

        vueInst.getNomenclatoareAndGoToRequestedComponent();
      }else{
        vueInst.$router.push({name: 'AccesBlocat'});
      }
    });
  }

  public clearListFastSearch(){
    if(!this.inputFastSearch){
      this.optionsFastSearch=[];
    }
  }

  public get widthForDrawerDocument(): number{
    var result=0;
    if(this.$q.platform.is.mobile) {result = window.innerWidth;}
    else{
      if(screen.availWidth>1500){ result = 1200;}
      else{
        if(screen.availWidth>1000){ result = 1000;}
        else {
          if (screen.availWidth > 800) {
            result = 600;
          } else {
              result = window.innerWidth - 100;
            }
          }
      }
    }
    return result;
  }

  public get userDepartament(): string {
    const vueInst = this;
    const orgUser = vueInst.storeNomenclatoare.NomOrganizatii.find(porg=>{
        return porg.appid.toString() == vueInst.userStore.user.org_id.toString();
    })
    if(orgUser) {
      return orgUser.departament;
    } else return '';
  }

  public get currentPageTitle(){
    return this.storeNomenclatoare.currentPageTitle;
  }

  public get linkPdfScan(): string{
    const vueInst = this;
    return `${CONFIG_ENV.URL_DOCUMENT.pdf_cover}/${vueInst.appidForScan}`;
  }

  /**
   *
   * @param pappid
   * @param whatToPreview scan is meaning appid is for scan, cover is meaning appid is for document
   */
  public openPreviewForm(pappid: number, whatToPreview: string){
    const vueInst = this;
    vueInst.appidForScan = pappid;
    let urlToGetFile='';
    if(whatToPreview == 'scan'){
      urlToGetFile=`${CONFIG_ENV.URL_SCAN.downloadScanForPreviewFromApp}/${pappid}`
    }else{// so, is a cover
      urlToGetFile=`${CONFIG_ENV.URL_DOCUMENT.pdf_cover}/${pappid}`
    }
    // @ts-ignore;
    fetch(urlToGetFile, {
      credentials: 'include'
    })
      .then(resp => resp.blob())
      .then(blob => {
        vueInst.urlBlobForPreviewFile = window.URL.createObjectURL(blob);
        if(this.$q.platform.is.mobile){
          // @ts-ignore
          // tslint:disable-next-line:only-arrow-functions
            setTimeout(function(){ vueInst.downloadingFile=false;document.getElementById('iframe_preview_scan_mobile').src = '/' +
              'pdf_viewer/web/viewer.html?file='+vueInst.urlBlobForPreviewFile; }, 0);
          }else{// is desktop
            // @ts-ignore
          // tslint:disable-next-line:only-arrow-functions max-line-length
            setTimeout(function(){ vueInst.downloadingFile=false;document.getElementById('iframe_preview_scan_desktop').src = vueInst.urlBlobForPreviewFile; }, 0);
            // document.querySelector("iframe").src = vueInst.urlBlobForPreviewFile;

            /*      ServicesDocument.getPdfCoverDocument(pappid).then((response) => {
                    const url = window.URL.createObjectURL(response.data);
                    // @ts-ignore
                    document.querySelector("iframe").src = url;
                  });*/
          }
      })
      .catch((err) => {
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

  public closeWindowDocument(){
    this.rightDrawerOpen=false;
    this.appidDocToWorkOnIt=0;
  }

  public created(): void {
    const vueInst = this;
    vueInst.userStore.set_screenwidth(screen.availWidth);
    vueInst.userStore.set_screenheight(screen.availHeight);
    vueInst.getAppUser();
    // @ts-ignore
    vueInst.$eventHub.$on('eventToOpenDocument', (params: any) => {
     // console.log('in app.ts eventToOpenDocument with params=%o', params);
      switch (params.action) {
        case 'openDocument': vueInst.rightDrawerOpen=true;
                             vueInst.appidDocToWorkOnIt=params.appid;
                             vueInst.withFinalizeButton=params.with_finalize_register_document;
                             vueInst.withRepartizareButton=params.with_repartizare_buton;
                             break;
      }
    });

    // @ts-ignore
    vueInst.$eventHub.$on('eventToPreviewScan', (params: any) => {
      // console.log('in app.ts eventCloseDrawerWithDocument with params=%o', params);
      vueInst.titleForPreviewForm='Atasament';
      vueInst.downloadingFile=true;
      if(this.$q.platform.is.mobile){
        this.showPreviewFileOnMobile=true;
      }else{
        this.showPreviewFileOnDesktop=true;
      }
      vueInst.openPreviewForm(params.scan_appid,'scan');
    });

    // @ts-ignore
    vueInst.$eventHub.$on('eventToPreviewCover', (params: any) => {
      // console.log('in app.ts eventCloseDrawerWithDocument with params=%o', params);
      vueInst.titleForPreviewForm='Coperta';
      vueInst.downloadingFile=true;
      if(this.$q.platform.is.mobile){
        this.showPreviewFileOnMobile=true;
      }else{
        this.showPreviewFileOnDesktop=true;
      }
      vueInst.openPreviewForm(params.appid,'cover');
    });

    // @ts-ignore
    vueInst.$eventHub.$on('eventCloseDrawerWithDocument', (params: any) => {
     // console.log('in app.ts eventCloseDrawerWithDocument with params=%o', params);
      vueInst.rightDrawerOpen=false;
    });
  }

  public beforeDestroy() {
    // @ts-ignore
    this.$eventHub.$off('eventToPreviewScan');
    // @ts-ignore
    this.$eventHub.$off('eventToPreviewCover');
    // @ts-ignore
    this.$eventHub.$off('eventToOpenDocument');
    // @ts-ignore
    this.$eventHub.$off('eventCloseDrawerWithDocument');
  }
}
