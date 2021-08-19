// tslint:disable-next-line:only-arrow-functions
export const URL_API = ( function() {
  if ( location.hostname === 'localhost') {
    return 'http://localhost:83'
    //return 'https://regis.theappsonline.com/api'
    //return 'http://regisdra-test/api';
  } else {
    //return 'http://localhost/api'
    //return 'https://regis.theappsonline.com/api'
    return '/api';
  }
})();

export const URL_API_FILE = ( function() {
  if ( location.hostname === 'localhost') {
    return '/api';
    //return 'https://regis.theappsonline.com/api'
    //return 'http://regisdra-test/api';
  } else {
    //return 'http://localhost/api'
    //return 'https://regis.theappsonline.com/api'
    //return '/api';
    return '/api';
  }
})();

// tslint:disable-next-line:only-arrow-functions

export const CONFIG_ENV = {
  URL_USER: {
    getCurrentUserFromAD : URL_API + '/nom_users/get_current_user_ad',
    getUserByMarca : URL_API + '/nom_users/get_info_user_by_marca',
    granted_registre_marca : URL_API + '/nom_users/granted_registre_by_marca',
    getLogForuser: URL_API + '/nom_users/logs'
  },
  URL_SEARCH: {
    optionsSolicitanti : URL_API + '/search/options_solicitanti',
    optionsOrganizatii : URL_API + '/search/options_organizatii',
    getStatusNumere : URL_API + '/search/status_numere',
    NrOfMyDocumentsPendingRegistering : URL_API + '/search/nr_of_my_docs_pending_registering',
    NrOfMyDocuments : URL_API + '/search/nr_of_my_docs',
    NrOfDocumentsDeRepartizat : URL_API + '/search/nr_of_docs_de_repartizat',
    getLogForDoc: URL_API + '/search/log_for_doc'
  },
  URL_NOM: {
    categorie : URL_API + '/nom_categ/categorie',
    categorii : URL_API + '/nom_categ/categorii',
    NomAllowedFiletypes : URL_API + '/nom_allowed_filetypes',
    tip_doc : URL_API + '/nom_tip_doc/tip_doc',
    tip_docs : URL_API + '/nom_tip_doc/tip_docs',
    registru : URL_API + '/nom_registre/registru',
    registre : URL_API + '/nom_registre/registre',
    hr_nom_org: URL_API + '/nom_hr/org',
    deleteDivision: URL_API + '/nom_hr/division',
    deleteDepartament: URL_API + '/nom_hr/departament',
    allOrgForTree: URL_API + '/nom_hr/org_for_tree',
    toateDepartamentele: URL_API + '/nom_hr/toate_departamentele',
    updateDivision: URL_API + '/nom_hr/update_division',
    updateDepartament: URL_API + '/nom_hr/update_departament',
    nom_users: URL_API + '/nom_users',
    persoane_utilizatoare: URL_API + '/nom_users/persoane_utilizatoare',
    chg_user_departament: URL_API + '/nom_users/chg_user_departament',
    chg_user_wan: URL_API + '/nom_users/chg_user_wan',
    chg_user_name: URL_API + '/nom_users/chg_user_name',
    chg_user_email: URL_API + '/nom_users/chg_user_email',
    delete_user: URL_API + '/nom_users/delete_user',
  } ,
  URL_DOCUMENT: {
    doc_intrare : URL_API + '/documente/doc_intrare',
    doc_iesire : URL_API + '/documente/doc_iesire',
    doc_intern : URL_API + '/documente/doc_intern',
    qr_code : URL_API + '/documente/qr_code',
    update_document : URL_API + '/documente/update',
    modifica_tip_document : URL_API + '/documente/modifica_tip_document',
    pdf_cover : URL_API + '/documente/pdf_cover',
    finalizeazaInregistrareDocument : URL_API + '/documente/finalizeaza_inregistrare_document',
    MyDocuments : URL_API + '/documente/my_documents',
    GetDocuments : URL_API + '/documente/get_documents',
    GetPageWithDocuments: URL_API + '/documente/get_page_with_documents',
    MyDocumentsPendingRegistering : URL_API + '/documente/docs_pending_registering',
    DocumentsDeRepartizat : URL_API + '/documente/docs_de_repartizat',
    FastSearch : URL_API + '/documente/fast_search',
    Repartizeaza : URL_API + '/documente/repartizeaza',
    NuSeRepartizeaza: URL_API + '/documente/nuserepartizeaza',
    Expeditie: URL_API + '/expeditie',
  } ,
  URL_SCAN: {
    uploadScan : URL_API_FILE + '/scan/upload',
    getScans : URL_API + '/scan/scans',
    getInfoScan : URL_API + '/scan/info',
    downloadScanFromApp : URL_API_FILE + '/scan/download_from_app',
    downloadScanForPreviewFromApp : URL_API_FILE + '/scan/download_preview_from_app',
  },
  URL_REPARTIZARE: {
    getRepartizari : URL_API + '/repartizare/repartizari_doc'
  },
  URL_REPORTS: {
    getXlsByConditions : URL_API + '/reports/xls_by_condition',
    getPdfByConditions : URL_API + '/reports/pdf_by_condition',
    getXlsNomUsers : URL_API + '/reports/xls_nom_users'
  },
  myLocale: {
    /* starting with Sunday */
    days: 'Duminica_Luni_Marti_Miercuri_Joi_Vineri_Sambata'.split('_'),
    daysShort: 'Dum_Lun_Mar_Mie_Joi_Vie_Sam'.split('_'),
    months: 'Ianuarie_Februarie_Martie_Aprilie_Mai_Iunie_Iulie_August_Septembrie_Octombrie_Noiembrie_Decembrie'.split('_'),
    monthsShort: 'Ian_Feb_Mar_Apr_Mai_Iun_Iul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    firstDayOfWeek: 1
  }
}
