import { Vue } from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import iOrganizatie from '@/types/iOrganizatie';
import iDocumentIntrare from '@/types/iDocumentIntrare';
import iDocument from '@/types/iDocument';

type OrNull<T> = { [K in keyof T]: T[K] | null }
type IDocumentIntrare = OrNull<iDocumentIntrare>;

interface TAjaxResponsePostDocument {
  status: string;
  message: string;
  appid: number;
}

interface TAjaxResponseGetDocument {
  status: string;
  message: string;
  document: IDocumentIntrare;
  denTipDocument: string;
  denDepRepartizat: string;
}

interface TAjaxResponseGetPdfCoverDocumentt {
  data: string;
}

interface TAjaxResponseMyDocuments {
  status: string;
  message: string;
  rows: iDocument[];
}

interface TAjaxResponsePageWithDocuments {
  status: string;
  message: string;
  totalNrOfPages: number;
  currentPage:number;
  nrRecordsPerPage:number;
  totalRecords:number;
  rows: iDocument[];
}

interface TAjaxResponseGetFastSearch{
  status: string;
  message: string;
  nr_of_records: number,
  rows: iDocument[];
}

interface TAjaxResponseFinInregDoc{
  status: string;
  message: string;
}

interface TAjaxResponseNrOfDoc {
  status: string;
  message: string;
  nr_of_doc: number;
}

export class ServicesDocument {
  // tslint:disable-next-line:max-line-length
  public static async postDocumentIntrare(pdocApp: IDocumentIntrare): Promise<TAjaxResponsePostDocument> {
    const response = await axios.post(`${CONFIG_ENV.URL_DOCUMENT.doc_intrare}`, pdocApp);
    return response.data;
  }
  // tslint:disable-next-line:max-line-length
  public static async postDocumentIesire(pdocApp: IDocumentIntrare): Promise<TAjaxResponsePostDocument> {
    const response = await axios.post(`${CONFIG_ENV.URL_DOCUMENT.doc_iesire}`, pdocApp);
    return response.data;
  }
  // tslint:disable-next-line:max-line-length
  public static async postDocumentIntern(pdocApp: IDocumentIntrare): Promise<TAjaxResponsePostDocument> {
    const response = await axios.post(`${CONFIG_ENV.URL_DOCUMENT.doc_intern}`, pdocApp);
    return response.data;
  }
  public static async getDocumentIntrare(appid: number): Promise<TAjaxResponseGetDocument> {
    const response = await axios.get(`${CONFIG_ENV.URL_DOCUMENT.doc_intrare}/${appid}`);
    return response.data;
  }
  public static async NuSeRepartizeaza(appid: number,p_NuSeRepartizeaza:string): Promise<TAjaxResponseFinInregDoc> {
    const response = await axios.put(`${CONFIG_ENV.URL_DOCUMENT.NuSeRepartizeaza}/${appid}/${p_NuSeRepartizeaza}`);
    return response.data;
  }
  public static async finalizeazaInregistrareDocument(appid: string): Promise<TAjaxResponseFinInregDoc> {
    const response = await axios.put(`${CONFIG_ENV.URL_DOCUMENT.finalizeazaInregistrareDocument}/${appid}`);
    return response.data;
  }

  public static async updateDocument(appid:string,tipUpdate:string,ptext: string): Promise<TAjaxResponseFinInregDoc> {
    const params = new URLSearchParams();
    params.set('new_value', ptext);
    const response = await axios.post(`${CONFIG_ENV.URL_DOCUMENT.update_document}/${appid}/${tipUpdate}`, params);
    return response.data;
  }

  public static async modificaTipDocument(appid:string,id_categ:string,id_tip_doc: string): Promise<TAjaxResponseFinInregDoc> {
    const response = await axios.put(`${CONFIG_ENV.URL_DOCUMENT.modifica_tip_document}/${appid}/${id_categ}/${id_tip_doc}`);
    return response.data;
  }

  public static async FastSearch(ptext: string): Promise<TAjaxResponseGetFastSearch> {
    const params = new URLSearchParams();
    params.set('fast_search_text', ptext);
    const response = await axios.post(`${CONFIG_ENV.URL_DOCUMENT.FastSearch}`, params);
    return response.data;
  }

  public static async getMyDocuments(): Promise<TAjaxResponseMyDocuments> {
    const response = await axios.get(`${CONFIG_ENV.URL_DOCUMENT.MyDocuments}`);
    return response.data;
  }

  public static async getDocuments(accesFrom:string,searchParams:any): Promise<TAjaxResponseMyDocuments> {
    const response = await axios.post(`${CONFIG_ENV.URL_DOCUMENT.GetDocuments}`,{accesFrom,searchParams});
    return response.data;
  }

  public static async getPageWithDocuments(nrRanduriTabel:number, pageNumber:number, accesFrom:string,searchParams:any): Promise<TAjaxResponsePageWithDocuments> {
    const response = await axios.post(`${CONFIG_ENV.URL_DOCUMENT.GetPageWithDocuments}/${nrRanduriTabel}/${pageNumber}`,{accesFrom,searchParams});
    return response.data;
  }

  public static async getDocumentsDeRepartizat(): Promise<TAjaxResponseMyDocuments> {
    const response = await axios.get(`${CONFIG_ENV.URL_DOCUMENT.DocumentsDeRepartizat}`);
    return response.data;
  }

  public static async getMyDocumentsWithNoScan(): Promise<TAjaxResponseMyDocuments> {
    const response = await axios.get(`${CONFIG_ENV.URL_DOCUMENT.MyDocumentsPendingRegistering}`);
    return response.data;
  }

  public static async getNrOfMyDocuments(): Promise<TAjaxResponseNrOfDoc> {
    const response = await axios.get(`${CONFIG_ENV.URL_SEARCH.NrOfMyDocuments}`);
    return response.data;
  }

  public static async getNrOfPendingToRegister(): Promise<TAjaxResponseNrOfDoc> {
    const response = await axios.get(`${CONFIG_ENV.URL_SEARCH.NrOfMyDocumentsPendingRegistering}`);
    return response.data;
  }

  public static async getNrOfDocumentsDeRepartizat(): Promise<TAjaxResponseNrOfDoc> {
    const response = await axios.get(`${CONFIG_ENV.URL_SEARCH.NrOfDocumentsDeRepartizat}`);
    return response.data;
  }

  public static async getPdfCoverDocument(appid: number): Promise<TAjaxResponseGetPdfCoverDocumentt> {
    const response = await axios({
                                          url: `${CONFIG_ENV.URL_DOCUMENT.pdf_cover}/${appid}`,
                                          method: 'GET',
                                          responseType: 'blob', // important
                                        });
    return response;
  }

  public static async repartizeaza(appid: number,parrayOrgs:iOrganizatie[]): Promise<TAjaxResponseFinInregDoc> {
    const response = await axios.post(`${CONFIG_ENV.URL_DOCUMENT.Repartizeaza}/${appid}`, parrayOrgs);
    return response.data;
  }

  public static async stergeRepartizarea(appid: number): Promise<TAjaxResponseFinInregDoc> {
    const response = await axios.delete(`${CONFIG_ENV.URL_DOCUMENT.Repartizeaza}/${appid}`);
    return response.data;
  }

}
