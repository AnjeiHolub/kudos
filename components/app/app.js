(function () {
  'use strict';


  //import 
  let kudosDesk = window.kudosDesk;
  let kudosTools = window.kudosTools;

  let kudosEdit = window.kudosEdit;

  let kudosTextEditor = window.kudosTextEditor;


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



  let appKudosTools = new kudosTools({
    el: document.querySelector('.container-app'),
    renderKudosEditArea (editKudos) {
      appKudosEdit.renderKudosEditArea(editKudos);
    }
  })

  let appKudosEdit = new kudosEdit({
    el: document.querySelector('.container-app'),
    addItem (item) {
      appKudosDesk._addItem(item);
    },
    addReadyItem (item) {
      appKudosTools._addReadyItem(item);
    }
  })

  let appKudosTextEditor = new kudosTextEditor ({
    el: document.querySelector('.container-app'),
    workingArea: document.querySelector('.kudos-edit')

  })

})();



