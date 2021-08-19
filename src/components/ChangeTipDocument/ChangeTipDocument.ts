import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import nomenclatoare from '@/store/nomenclatoare';
import {getModule} from 'vuex-module-decorators';
import iNomTipDoc from '@/types/iNomTipDoc';
import iNomCateg from '@/types/iNomCateg';
import {ServicesDocument} from '@/modules/ServicesDocument';
interface iDepartament{
    appid:number,
    den_divizie:string,
    den_departament:string
}

@Component({components: {}})
export default class ChangeTipDocument extends Vue {
    // tslint:disable-next-line:ban-types
    @Prop({ default: '0' }) public readonly appid!: string;
    @Prop({ default: 0 }) public readonly prop_id_registru!: number;
    @Prop({ default: 0 }) public readonly prop_id_categ!: number;
    @Prop({ default: 0 }) public readonly prop_id_tip_doc!: number;
    @Prop() public frenuntModificareTipDoc!: ()=>void;
    @Prop() public fModificareTipDoc!: (id_categ:number, id_tip_doc:number|null)=>void;

    public id_categ=0;
    public id_tip_doc:number|null=0;

    public storeNomenclatoare = getModule(nomenclatoare);

    public get optionsCategorii(): iNomCateg[] {
        const categoriiActive=this.storeNomenclatoare.NomCategorii.filter(pcategorie=>{
            return pcategorie.activ=='y'
        })
        return categoriiActive;
    }

    public get optionsTipDoc(): iNomTipDoc[] {
        const onlyActiveTipDoc=this.storeNomenclatoare.NomTipDoc.filter(
            pTipDoc=>{
                return pTipDoc.activ=='y';
            }
        );
        return onlyActiveTipDoc;
    }

    public get filteredOptionTipDoc(): iNomTipDoc[] {
        const vueInst = this;
        return JSON.parse(JSON.stringify(vueInst.storeNomenclatoare.NomTipDoc.filter((ptipdoc)=>{
            // tslint:disable-next-line:triple-equals
            return ptipdoc.id_categ == vueInst.id_categ && ptipdoc.activ=='y';
        })));
    }

    public resetTipDoc(){
        this.id_tip_doc = null;
    }

    public modificaTipDocument(){
        const vueInst = this;
        if(vueInst.id_categ && vueInst.id_tip_doc) {
            ServicesDocument.modificaTipDocument(vueInst.appid, vueInst.id_categ.toString(), vueInst.id_tip_doc.toString()).then(presponse=>{
                console.log('modificaTipDocument presponse=%o',presponse)
                if(presponse.status=='success') {
                    vueInst.$q.notify({
                        color: 'teal',
                        textColor: 'white',
                        type: 'positive',
                        message: presponse.message,
                        position: 'top',
                        timeout: 1000,
                    });
                    vueInst.fModificareTipDoc(vueInst.id_categ, vueInst.id_tip_doc);
                    vueInst.frenuntModificareTipDoc();
                }
            });
        }
    }

    public created(){
        this.id_categ=this.prop_id_categ;
        this.id_tip_doc=this.prop_id_tip_doc;
    }
}
