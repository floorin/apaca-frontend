import iScan from '@/types/iScan';
import iRepartizare from '@/types/iRepartizare';

export default interface iDocument {
  appid: number,
  id_registru: number,
  id_categ: number,
  id_tip_document: number,
  id_doc: number,
  tip_request: string,
  data_doc: string,
  categorie_solicitant: string,
  nume_denumire: string,
  cui: string,
  titlu: string,
  descriere: string,
  nr_inreg: string,
  data_inreg: string,
  nr_file: number,
  este_confidential: boolean,
  ref_nr_doc: string,
  ref_data_doc: string,
  ref_id_registru: string,
  track_creation_date: string,
  id_org_destinatar_init: number,
  id_org_destinatar_curent: number,
  scans:iScan[],
  repartizari:iRepartizare[],
}
