(function () {
  'use strict';


  //import 
  let kudosApp = window.kudosApp;
  let kudosDesk = window.kudosDesk;
  let kudosTools = window.kudosTools;

  let kudosEdit = window.kudosEdit;

  let kudosTextEditor = window.kudosTextEditor;

  /**
   * Stworzenie komponentu aplickacji kudosów
   */

  let appKudosApp = new kudosApp({
    el: document.querySelector('.container-app')
  });

  /**
   * Stworzenie komponentu tablicy z kudosami
   */

  let appKudosDesk = new kudosDesk({
    el: document.querySelector('.container-app'),
    data: {
      title: 'kudosy',
      items: [
        {
          type: 'Cześć',
          content: 'Wiktorowi kudos',
          className: 'kudos-happy'
        },
        {
          type: 'Lalalala',
          content: 'Dzięki',
          className: 'kudos-goodwork'
        }
      ]
    }
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

  let appKudosTextEditor = new kudosTextEditor ({
    el: document.querySelector('.container-app'),
    workingArea: document.querySelector('.edit-area .kudos-edit')

  })

})();



