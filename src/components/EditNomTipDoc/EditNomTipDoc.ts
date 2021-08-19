import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import iNomCateg from '@/types/iNomCateg';
import iNomTipDoc from '@/types/iNomTipDoc';
import {ServicesNomTipDoc} from '@/modules/ServicesNomTipDoc';
import nomenclatoare from '@/store/nomenclatoare';
import {getModule} from 'vuex-module-decorators';
import {ServicesNomCateg} from '@/modules/ServicesNomCateg';

@Component({components: {}})
export default class EditNomTipDoc extends Vue {
  // tslint:disable-next-line:ban-types
  @Prop() public frenunt!: ()=>void;
  @Prop() public fonsave!: ()=>void;
  @Prop() public appid!: number;
  public filter: string = '';
  public loadingData: boolean = false;
  public $refs: any;
  public tip_doc: iNomTipDoc;
  private storeNomenclatoare = getModule(nomenclatoare);
  // private userStore=getModule(User);
  constructor() {
    super();
    this.tip_doc = {
      appid: 0,
      id_tip_doc: 0,
      id_categ: 0,
      den_lang_1: '',
      den_lang_2: '',
      track_user: '',
      track_date: '',
      activ: 'y',
      is_confidential:'n'
    };
  }

  public onSubmit() {
    const vueInst = this;
    this.$refs.myForm.validate().then((success: any) => {
      if (success) {
        // yay, models are correct
        // tslint:disable-next-line:max-line-length
        ServicesNomTipDoc.postNomTipDoc(vueInst.tip_doc.appid, vueInst.tip_doc.id_categ, vueInst.tip_doc.den_lang_1, vueInst.tip_doc.den_lang_2).then((presponse) => {
          if ( presponse.status === 'success' ) {
            ServicesNomTipDoc.updateStoreNomTipDocsFromDB();
            vueInst.$q.notify({
              color: 'green-4',
              textColor: 'white',
              type: 'positive',
              message: presponse.message,
              position: 'top',
              timeout: 1000,
            });
            vueInst.fonsave();
          }
        });
      } else {
        // oh no, user has filled in
        // at least one invalid value
      }
    })
  }

  // tslint:disable-next-line:no-empty
  public renunt() {

  }

  public get optionsCategorii(): iNomCateg[] {
    const nomcateg = JSON.parse(JSON.stringify(this.storeNomenclatoare.NomCategorii));
    nomcateg.unshift({
      appid: 0,
      den_lang_1: '',
      den_lang_2: '',
      id_categ: 0,
      track_date: '',
      track_user: '',
      activ: 'y'
    })
    return nomcateg;

  }

  public mounted() {
    this.tip_doc.appid = this.appid;
  }
}
