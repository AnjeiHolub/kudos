(function () {
  'use strict';

  class kudosTools {
    constructor ({el, renderKudosEditArea}) {
      this.el = el;
      this._onClick = this._onClick.bind(this);
      this._renderKudosEditArea = renderKudosEditArea;

      this.toolsField = el.querySelector('.tools-field');

      this.render();

      this.tools = el.querySelector('.tools');
      this.form = this.tools.querySelector('.form');

      this._initEvents();

    }

    render () {

      this.toolsField.innerHTML = `<div class="tools">
                                    <div class="kudos-types clearfix">
                                      <div class="kudos-option kudos-thanks" data-action="select"></div>
                                      <div class="kudos-option kudos-happy" data-action="select"></div>
                                      <div class="kudos-option kudos-goodwork" data-action="select"></div>
                                    </div>
                                    <form class="form">
                                      <input type="text" />
                                      <textarea name="lol" id="lol" cols="30" rows="10"></textarea>
                                      <button data-action="add">Сохранить</button>
                                    </form>
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
  }


  //export
  window.kudosTools = kudosTools;

})();