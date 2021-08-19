import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import WorkOnDocument from '@/components/WorkOnDocument/WorkOnDocument.vue';
import user from '@/store/user';
import iUser from '@/types/iUser';
@Component({components: {WorkOnDocument}})
export default class ViewDocument extends Vue {
  @Prop({ default: '0' }) public readonly  appid!: string;
  public vueKeyToForceRefresh:number = 0;
  public userStore=getModule(user);
  constructor() {
    super();
  }

  get userid(): string {
    return this.userStore.user.userid;
  }

  @Watch('userid', { immediate: true})
  public onUseridChanged(newVal: string, oldVal: string) {
    //console.log('onUseridChanged in ViewDocument, where newVal=%o and oldVal=%o',newVal,oldVal)
    const vueInst = this;
    vueInst.vueKeyToForceRefresh=1;
  }
}
