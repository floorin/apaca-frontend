import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import nomenclatoare from '@/store/nomenclatoare';
import {getModule} from 'vuex-module-decorators';

interface iPersoanaUtilizatoare{
  marca:number,
  firstName:string,
  lastName:string,
  functie:string
}

@Component({components: {}})
export default class ComboUser extends Vue {
  // tslint:disable-next-line:ban-types
  @Prop() public SelectHandler!: ()=>void;
  @Prop({ default: 'Departamente' }) public readonly title!: string
  public loadingData:boolean = true;
  public filter: string = '';
  public storeNomenclatoare = getModule(nomenclatoare);
  public myPagination:any={
    rowsPerPage:10
  }
  public visibleColumns: string[] = [ 'lastName', 'firstName', 'den_org'];
  public  columns: any = [
    { name: 'lastName', label: 'nume', field: 'lastName', align: 'left', sortable: true },
    { name: 'firstName', label: 'prenume', field: 'firstName', align: 'left', sortable: true},
    { name: 'den_org', label: 'loc de munca', field: 'den_org', align: 'left', sortable: true },
  ];
  constructor() {
    super();
  }

  public get tableDataNomUsers():iPersoanaUtilizatoare[]{
    return JSON.parse(JSON.stringify(this.storeNomenclatoare.NomPersoaneUtilizatoare));
  }


  // tslint:disable-next-line:no-empty
  public renunt() {

  }


}
