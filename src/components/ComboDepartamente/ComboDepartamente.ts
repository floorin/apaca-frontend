import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import nomenclatoare from '@/store/nomenclatoare';
import {getModule} from 'vuex-module-decorators';
import iOrganizatie from '@/types/iOrganizatie';
interface iDepartament{
  appid:number,
  den_divizie:string,
  den_departament:string
}

@Component({components: {}})
export default class ComboDepartamente extends Vue {
  // tslint:disable-next-line:ban-types
  @Prop() public selectDivizie!: ()=>void;
  @Prop() public selectDepartament!: ()=>void;
  @Prop({ default: 'Departamente' }) public readonly title!: string

  public filter: string = '';
  public storeNomenclatoare = getModule(nomenclatoare);
  public myPagination:any={
    rowsPerPage:10
  }
  public visibleColumns: string[] = [ 'divizie', 'departament'];
  public  columns: any = [
    { name: 'appid', label: 'appid', field: 'appid' },
    { name: 'appid_divizie', label: 'appid_divizie', field: 'appid_divizie' },
    { name: 'divizie', label: 'Directie', field: 'divizie', align: 'left', sortable: true},
    { name: 'departament', label: 'Departament', field: 'departament', align: 'left', sortable: true },
  ];
  constructor() {
    super();
  }

  public get tableDataNomDepartamente():iOrganizatie[]{
    return JSON.parse(JSON.stringify(this.storeNomenclatoare.NomOrganizatii));
  }

  // tslint:disable-next-line:no-empty
  public renunt() {

  }
}
