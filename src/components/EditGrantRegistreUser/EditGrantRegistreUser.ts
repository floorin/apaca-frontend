import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import nomenclatoare from '@/store/nomenclatoare';
import {getModule} from 'vuex-module-decorators';
import {ServicesNomUsers} from '@/modules/ServicesNomUsers';
interface iGrantRegistru{
  appid:number,
  appid_registru:number,
  den_registru_lang_1:string,
  userid:number,
  granted:string
}

@Component({components: {}})
export default class EditGrantRegistreUser extends Vue {
  // tslint:disable-next-line:ban-types
  @Prop() public SelectHandler!: ()=>void;
  @Prop({ default: 0 }) public readonly userid!: number
  public user_name: string = '';
  public arrGrantsRegistre:iGrantRegistru[]=[];

  public filter: string = '';
  public storeNomenclatoare = getModule(nomenclatoare);


  constructor() {
    super();
  }

  public getInfoGrantedRegistreForUser(){
    const vueInst=this;
    ServicesNomUsers.getInfoGrantedRegistreForUser(vueInst.userid.toString()).then(presponse=>{
      if(presponse.status=='success'){
        vueInst.user_name=presponse.user_name;
        vueInst.arrGrantsRegistre.forEach((pgrant,pindex)=>{
          if(presponse.rows.includes(pgrant.appid_registru)){
            vueInst.$set(vueInst.arrGrantsRegistre[pindex],'granted','y');
          }
        });
      }
    }
    );
  }

  public changeStatus(pregistru:iGrantRegistru) {
    const vueInst=this;
    if(pregistru.granted=='n'){
      ServicesNomUsers.deleteGrantRegistruUser(vueInst.userid,pregistru.appid_registru).then(presponse=> {
          if (presponse.status === 'success') {
            vueInst.$q.notify({
              color: 'teal',
              textColor: 'white',
              type: 'negative',
              message: presponse.message,
              position: 'top',
              timeout: 500,
            });
          }
        }
      );
    }
    if(pregistru.granted=='y'){
      ServicesNomUsers.putGrantRegistruUser(vueInst.userid,pregistru.appid_registru).then(presponse=> {
          if (presponse.status === 'success') {
            vueInst.$q.notify({
              color: 'teal',
              textColor: 'white',
              type: 'negative',
              message: presponse.message,
              position: 'top',
              timeout: 500,
            });
          }
        }
      );
    }
  }

  public created(){
    const vueInst=this;
    vueInst.storeNomenclatoare.NomRegistre.forEach(pregistru=>{
      vueInst.arrGrantsRegistre.push({
        appid:pregistru.appid,
        appid_registru:pregistru.appid,
        den_registru_lang_1:pregistru.den_registru_lang_1,
        userid:vueInst.userid,
        granted:'n'
      });
    });
    vueInst.getInfoGrantedRegistreForUser();
  }
}
