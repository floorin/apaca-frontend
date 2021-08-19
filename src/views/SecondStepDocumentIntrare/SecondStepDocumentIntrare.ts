import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import WorkOnDocument from '@/components/WorkOnDocument/WorkOnDocument.vue';
type OrNull<T> = { [K in keyof T]: T[K] | null }

@Component({components: {WorkOnDocument}})
export default class SecondStepDocumentIntrare extends Vue {
  @Prop({ default: '0' }) public readonly  appid!: string;
  // private userStore=getModule(User);
  constructor() {
    super();
  }

}
