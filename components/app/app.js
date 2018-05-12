(function () {
    'use strict';


    //import
    let kudosModel = window.kudosModel;
    let kudosApp = window.kudosApp;
    let kudosDesk = window.kudosDesk;
    let kudosTools = window.kudosTools;

    let kudosEdit = window.kudosEdit;

    let kudosTextEditor = window.kudosTextEditor;

    /**
     * Stworzenie komponentu, czyli moduł który odpowiada za komunikacje z bazą
     * @type {any}
     */

    let appKudosModel = new kudosModel();

    /**
     * Stworzenie komponentu tablicy z kudosami
     */

    let appKudosDesk = new kudosDesk({
        el: document.querySelector('.container-app')
    });

    /**
     * Stworzenie komponentu narzędzi serwisu
     */

    let appKudosTools = new kudosTools({
        el: document.querySelector('.container-app'),
        renderKudosEditArea (editKudos) {
            appKudosEdit.renderKudosEditArea(editKudos);
        }
    })

    /**
     * Stworzenie komponentu aplickacji kudosów
     */

    let appKudosApp = new kudosApp({
        el: document.querySelector('.container-app')
    });

    /**
     * Stworzenie komponentu - obszar do edycji
     */

    let appKudosEdit = new kudosEdit({
        el: document.querySelector('.container-app')
    })

    /**
     * Stworzenie komponentu do edycji tekstu
     */

    let appKudosTextEditor = new kudosTextEditor({
        el: document.querySelector('.container-app'),
        selectorWorkingArea: '.edit-area .kudos-edit'

    });

    /**
     * Zadeklorowanie "zdarzenia" ustawienia danych w aplikacji, renderowania oraz akcji, która będzie wywołana (callback)
     */

    appKudosModel.on('update', (data) => {
        appKudosDesk.setData(data);
        appKudosTools.setData(data);
        appKudosApp.setData(data);
        appKudosDesk.render();
        appKudosTools.render();
    });

    /**
     * Zadeklorowanie "zdarzenia" dodania kudosa do tablicy oraz akcji, która będzie wywołana (callback)
     */

    appKudosApp.on('refreshData', (event) => {
        appKudosTools.refreshData(appKudosApp.getData());
        appKudosDesk.refreshData(appKudosApp.getData());
        appKudosModel.setData(appKudosApp.getData());
        appKudosModel.save();
    });

    /**
     * Zadeklorowanie "zdarzenia" w momencie rozpoczęcia przesunięcia kudosa (callback)
     */

    appKudosApp.on('startDrag', (event) => {
        appKudosDesk.mouseMoveBlock();
    });

    /**
     * Zadeklorowanie "zdarzenia" w momencie skończenia przesunięcia kudosa (callback)
     */

    appKudosApp.on('finishDrag', (event) => {
        appKudosDesk.mouseMoveUnBlock();
    });

     /**
     * Zadeklorowanie "zdarzenia" w momencie anulowania przesunięcia kudosa (callback)
     */

    appKudosApp.on('cancelDrag', (event) => {
        appKudosDesk.restoreState();
    });

    /**
     * Zadeklorowanie "zdarzenia" dodania kudosa do tablicy oraz akcji, która będzie wywołana (callback)
     */

    appKudosTools.on('addToKudosReady', (event) => {
        appKudosApp.setData(appKudosTools.getData());
        appKudosDesk.setData(appKudosTools.getData());
        appKudosModel.setData(appKudosTools.getData());
        appKudosModel.save();
    });

    /**
     * Zadeklorowanie "zdarzenia" dodania kudosa do schowka (status "gotowy"), która będzie wywołana (callback)
     */

     appKudosEdit.on('kudosReadyTransfer', (event) => {
        let data = event.detail;
        appKudosTools._addReadyItem(data);
     });

    appKudosModel.fetch();

})();



