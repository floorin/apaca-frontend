import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import iNomCateg from '@/types/iNomCateg';
import {ServicesNomCateg} from '@/modules/ServicesNomCateg';

@Component({components: {}})
export default class EditNomCateg extends Vue {
  // tslint:disable-next-line:ban-types
  @Prop() public frenunt!: ()=>void;
  @Prop() public fonsave!: ()=>void;
  @Prop() public appid!: number;
  public filter: string = '';
  public loadingData: boolean = false;
  public $refs: any;
  public categorie: iNomCateg;
  // private userStore=getModule(User);

  constructor() {
    super();
    this.categorie = {
      appid: 0,
      id_categ: 0,
      den_lang_1: '',
      den_lang_2: '',
      track_user: '',
      track_date: '',
      activ: 'y'
    };
  }

  public onSubmit() {
    const vueInst = this;
    this.$refs.myForm.validate().then((success: any) => {
      if (success) {
        // yay, models are correct
        // tslint:disable-next-line:max-line-length
        ServicesNomCateg.postNomCateg(vueInst.categorie.appid, vueInst.categorie.den_lang_1, vueInst.categorie.den_lang_2).then((presponse) => {
          if ( presponse.status === 'success' ) {
            ServicesNomCateg.updateStoreNomCategFromDB();
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

  public mounted() {
    this.categorie.appid = this.appid;
  }
}
