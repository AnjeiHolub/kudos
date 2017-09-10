(function () {
  'use strict';

  class kudosTools {
    constructor ({el, addItem}) {
      this.el = el;
      this._onClick = this._onClick.bind(this);
      this._addItem = addItem;

      this.toolsField = el.querySelector('.tools-field');

      this.render();

      this.tools = el.querySelector('.tools');
      this.form = this.tools.querySelector('.form');

      this._initEvents();

    }

    render () {

      this.toolsField.innerHTML = `<div class="tools">
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
        case 'add':
          this._onAddClick(item);
          break;
      } 
    }

    _onAddClick (item) {
      let dataItem = {type: this.form.querySelector('input').value, content: this.form.querySelector('textarea').value};
      this.form.reset();
      this._addItem(dataItem); 
    }
  }


  //export
  window.kudosTools = kudosTools;

})();