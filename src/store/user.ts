import {store} from './index';
import {Module, VuexModule, Mutation, Action} from 'vuex-module-decorators';
import iUser from '@/types/iUser';

@Module({ namespaced: true, dynamic: true, store, name: 'storeUser'})
export default class User extends VuexModule {
  public user: iUser = {
    userid: '0',
    first_name: '',
    last_name: '',
    email_address: '',
    user_wan: '',
    org_id: '',
    is_activ: 'n',
    auth_for_input_intrare: '',
    auth_for_input_intern: '',
    auth_for_input_exit: '',
    auth_for_upload_scan: '',
    auth_todo_repartizare: '',
    auth_toview_confidential: '',
    auth_for_expeditie: '',
    auth_for_search: '',
    is_admin: 'n',
    functie: '',
    last_track_time: '',
    csrf_token: ''
  };

  public ScreenWidth:number=1440;
  public ScreenHeight:number=900;

  public MyImgProfileString64: string = '';

  @Mutation
  public SET_USER(puser: iUser) {
    this.user = puser;
  }
  @Action
  public set_user(puser: iUser) {
    this.context.commit('SET_USER', puser);
  }

  @Mutation
  public SET_SCREENWIDTH(pnumber: number) {
    this.ScreenWidth = pnumber;
  }
  @Action
  public set_screenwidth(pnumber: number) {
    this.context.commit('SET_SCREENWIDTH', pnumber);
  }

  @Mutation
  public SET_SCREENHEIGHT(pnumber: number) {
    this.ScreenHeight = pnumber;
  }
  @Action
  public set_screenheight(pnumber: number) {
    this.context.commit('SET_SCREENHEIGHT', pnumber);
  }

  @Mutation
  public SET_CSRF_TOKEN(ptoken: string) {
    this.user.csrf_token = ptoken;
  }
  @Action
  public set_csrf_token(ptoken: string) {
    this.context.commit('SET_CSRF_TOKEN', ptoken);
  }

  @Mutation
  public SET_MYIMGPROFILESTRING64R(pimgstring: string) {
    this.MyImgProfileString64 = pimgstring;
  }
  @Action
  public set_myimgprofilestring64r(pimgstring: string) {
    this.context.commit('SET_MYIMGPROFILESTRING64R', pimgstring);
  }

}
