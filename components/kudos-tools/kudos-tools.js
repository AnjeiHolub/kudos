(function () {
  'use strict';

  class kudosTools {
    constructor ({el, renderKudosEditArea}) {
      this.el = el;
      this._onClick = this._onClick.bind(this);
      this._renderKudosEditArea = renderKudosEditArea;

      this.toolsField = el.querySelector('.tools-field');
      this.readyKudos;

      this.render();

      this.tools = el.querySelector('.tools');
      this.form = this.tools.querySelector('.form');

      this._initEvents();

    }

    render () {

      function getReadyKudos (item) {
        if (item) {
          return `<div class="kudos ${item.className}">
                  <h3 class="type">${item.type}</h3>
                  <span class="remove" data-action="remove">X</span>
                  <p class="content">${item.content}</p>
                </div>`;
        } else {
          return  '';
        }
        
      }

      this.toolsField.innerHTML = `<div class="tools">
                                    <div class="kudos-types clearfix">
                                      <div class="kudos-option kudos-thanks" data-action="select"></div>
                                      <div class="kudos-option kudos-happy" data-action="select"></div>
                                      <div class="kudos-option kudos-goodwork" data-action="select"></div>
                                    </div>
                                    <div class="area-ready-kudos">
                                      ${getReadyKudos(this.readyKudos)}
                                    </div>
                                  </div>`;
    }

    _initEvents () {
      this.el.addEventListener('click', this._onClick);
    }

    _onClick (event) {
      event.preventDefault();

      let item = event.target;

      switch (item.dataset.action) {
        case 'select':
          this._onClickSelect(item);
          break;
      } 
    }

    _onClickSelect(item) {
      let editKudos = {className: item.className};

      this._renderKudosEditArea(editKudos);
    }

    _addReadyItem (item) {
      this.readyKudos = item;
      this.render();
    }
  }


  //export
  window.kudosTools = kudosTools;

})();