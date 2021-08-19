import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import iNomRegistru from '@/types/iNomRegistru';
import {ServicesHrOrg} from '@/modules/ServicesHrOrg';
import nomenclatoare from '@/store/nomenclatoare';
import {getModule} from 'vuex-module-decorators';
@Component({components: {}})
export default class NomHrOrg extends Vue {
  // tslint:disable-next-line:ban-types
  public loadingData: boolean = false;
  public jsonHrOgr:any =[];
  public $refs: any;
  public storeNomenclatoare = getModule(nomenclatoare);
  constructor() {
    super();
  }

  public getHrOrg() {
    const vueInst = this;
        // tslint:disable-next-line:max-line-length
    ServicesHrOrg.getHrOrg().then((presponse) => {
          if ( presponse.status === 'success' ) {
            vueInst.jsonHrOgr = [presponse.hr_org];
            vueInst.$nextTick( () =>vueInst.$refs.refHrOrg.expandAll())
          }
        });
  }

  public mounted() {
    this.getHrOrg();
    this.storeNomenclatoare.set_currentpagetitle('Organigrama');
  }
}
