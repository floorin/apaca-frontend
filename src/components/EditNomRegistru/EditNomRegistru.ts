import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import iNomRegistru from '@/types/iNomRegistru';
import {ServicesRegistre} from '@/modules/ServicesRegistre';

@Component({components: {}})
export default class EditNomRegistru extends Vue {
  // tslint:disable-next-line:ban-types
  @Prop() public frenunt!: ()=>void;
  @Prop() public fonsave!: ()=>void;
  @Prop() public appid!: number;
  public filter: string = '';
  public loadingData: boolean = false;
  public $refs: any;
  public registru: iNomRegistru;
  // private userStore=getModule(User);

  constructor() {
    super();
    this.registru = {
      appid: 0,
      id_registru: 0,
      den_registru_lang_1: '',
      den_registru_lang_2: '',
      an_permis_pt_inreg: 0,
      nr_de_start: 0,
      track_user: '',
      track_date: '',
      activ: 'y',
      grantedForUser:'n'
    };
  }

  public onSubmit() {
    const vueInst = this;
    this.$refs.myForm.validate().then((success: any) => {
      if (success) {
        // yay, models are correct
        // tslint:disable-next-line:max-line-length
        ServicesRegistre.postNomRegistru(vueInst.registru.appid, vueInst.registru.den_registru_lang_1, vueInst.registru.den_registru_lang_2, vueInst.registru.an_permis_pt_inreg, vueInst.registru.nr_de_start).then((presponse) => {
          if ( presponse.status === 'success' ) {
            ServicesRegistre.updateStoreNomRegistreFromDB();
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
    this.registru.appid = this.appid;
  }
}
