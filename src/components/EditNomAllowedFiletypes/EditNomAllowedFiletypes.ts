import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import iNomAllowedFiletypes from '@/types/iNomAllowedFiletypes';
import {ServicesNomAllowedFiletypes} from '@/modules/ServicesNomAllowedFiletypes';

@Component({components: {}})
export default class EditNomAllowedFiletypes extends Vue {
  // tslint:disable-next-line:ban-types
  @Prop() public frenunt!: ()=>void;
  @Prop() public fonsave!: ()=>void;
  @Prop() public appid!: number;
  public filter: string = '';
  public loadingData: boolean = false;
  public $refs: any;
  public fileScan: iNomAllowedFiletypes;
  // private userStore=getModule(User);

  constructor() {
    super();
    this.fileScan = {
      appid: 0,
      file_extension:'',
      file_max_size:0
    };
  }

  public onSubmit() {
    const vueInst = this;
    this.$refs.myForm.validate().then((success: any) => {
      if (success) {
        // yay, models are correct
        // tslint:disable-next-line:max-line-length
        ServicesNomAllowedFiletypes.postNomAllowedFiletypes(vueInst.fileScan.appid, vueInst.fileScan.file_extension, vueInst.fileScan.file_max_size).then((presponse) => {
          if ( presponse.status === 'success' ) {
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
  public renuntEditareNomAllowedFiletypes() {

  }

  public mounted() {
    this.fileScan.appid = this.appid;
  }
}
