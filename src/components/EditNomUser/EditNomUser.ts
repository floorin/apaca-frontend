import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import iUser from '@/types/iUser';
import nomenclatoare from '@/store/nomenclatoare';
import {getModule} from 'vuex-module-decorators';
import {ServicesNomUsers} from '@/modules/ServicesNomUsers';
import ComboDepartamente from '@/components/ComboDepartamente/ComboDepartamente.vue'
import iOrganizatie from '@/types/iOrganizatie';

interface IUser extends iUser{
  den_org:string
}
@Component({components: {ComboDepartamente}})
export default class EditNomUser extends Vue {
  // tslint:disable-next-line:ban-types
  @Prop() public frenunt!: ()=>void;
  @Prop() public fonsave!: ()=>void;
  @Prop() public appid!: number;
  public auTrecut2SecundeDeLaUltimulSearch: boolean = false;
  public optionsOrganizatii: iOrganizatie[] = [];
  public lastSearchTextForOption:string = '';
  public filter: string = '';
  public loadingData: boolean = false;
  public $refs: any;
  public user: IUser;
  public viewDialogSelectDepartament:boolean = false;
  public storeNomenclatoare = getModule(nomenclatoare);
  // private userStore=getModule(User);
  constructor() {
    super();
    this.user = {
      userid: '',
      first_name: '',
      last_name: '',
      email_address: '',
      user_wan: '',
      org_id: '',
      is_activ: 'n',
      auth_for_input_intrare: 'n',
      auth_for_input_intern: 'n',
      auth_for_input_exit: 'n',
      auth_for_upload_scan: 'n',
      auth_todo_repartizare: 'n',
      auth_toview_confidential: 'n',
      auth_for_expeditie: 'n',
      auth_for_search: 'n',
      is_admin: 'n',
      functie: '',
      last_track_time: '',
      csrf_token: '',
      den_org:''
    };
  }

  public doNothing(){}

  public inputOrgRepartizare(){
    this.viewDialogSelectDepartament=true;
  }

  public getOptionsOrganizatii(psearchText:string){
    const vueInst = this;
    vueInst.optionsOrganizatii=vueInst.storeNomenclatoare.NomOrganizatii.filter(porg=>porg.departament.includes(psearchText.toUpperCase()));
    vueInst.lastSearchTextForOption=psearchText;
    setTimeout(()=>{ vueInst.auTrecut2SecundeDeLaUltimulSearch=true; if(vueInst.optionsOrganizatii.length==0){vueInst.$refs.refOptionsOrganizatii.hide();}}, 500);
  }

  public putFocusBackToOrg(){
    this.$refs.refOrg.focus();
  }

  public selectDepartament(organizatie: iOrganizatie){
    const vueInst = this;
    vueInst.user.org_id=organizatie.appid.toString();
    vueInst.user.den_org=organizatie.divizie+' / '+organizatie.departament;
    vueInst.viewDialogSelectDepartament=false;
  }

  public onSubmit() {
    const vueInst = this;
    ServicesNomUsers.postUser(vueInst.user).then(presponse=>{
      if(presponse.status==='success'){
        vueInst.$q.notify({
          color: 'teal',
          textColor: 'white',
          type: 'positive',
          message: presponse.message,
          position: 'top',
          timeout: 1500,
        });
        vueInst.fonsave();
      }
    });
  }



}
