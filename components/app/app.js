(function () {
  'use strict';


  //import 
  let kudosDesk = window.kudosDesk;
  let kudosTools = window.kudosTools;

  let kudosEdit = window.kudosEdit;


  let appKudosDesk = new kudosDesk({
    el: document.querySelector('.container-app'),
    data: {
      title: 'kudosy',
      items: [
        {
          type: 'Cześć',
          content: 'Wiktorowi kudos'
        },
        {
          type: 'Lalalala',
          content: 'Dzięki'
        }
      ]
    }
  });

  let appKudosEdit = new kudosEdit({
    el: document.querySelector('.container-app'),
    addItem (item) {
      appKudosDesk._addItem(item);
    }
  })

  let appKudosTools = new kudosTools({
    el: document.querySelector('.container-app'),
    renderKudosEditArea (editKudos) {
      appKudosEdit.renderKudosEditArea(editKudos);
    }
  })



})();



