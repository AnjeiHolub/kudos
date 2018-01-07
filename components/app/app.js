(function () {
    'use strict';


    //import
    let kudosModel = window.kudosModel;
    let kudosApp = window.kudosApp;
    let kudosDesk = window.kudosDesk;
    let kudosTools = window.kudosTools;

    let kudosEdit = window.kudosEdit;

    let kudosTextEditor = window.kudosTextEditor;

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
        el: document.querySelector('.container-app'),
        addItemKudosDesk: function (item) {
            appKudosDesk._addItem(item);
        },
        moveItemKudosDesk: function (item, coordinates) {
            appKudosDesk._moveItem(item, coordinates);
        },
        removeReadyItemKudosTools: function () {
            appKudosTools._removeReadyItem();
        },
        removeItemKudosDesk: function (item) {
            appKudosDesk._removeItem(item);
        }
    });

    /**
     * Stworzenie komponentu - obszar do edycji
     */

    let appKudosEdit = new kudosEdit({
        el: document.querySelector('.container-app'),
        addReadyItem (item) {
            appKudosTools._addReadyItem(item);
        }
    })

    /**
     * Stworzenie komponentu do edycji tekstu
     */

    let appKudosTextEditor = new kudosTextEditor({
        el: document.querySelector('.container-app'),
        selectorWorkingArea: '.edit-area .kudos-edit'

    })

    appKudosModel.on('update', (data) => {
        appKudosDesk.setData(data);
    });

    appKudosModel.fetch();

})();



