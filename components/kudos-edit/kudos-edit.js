(function () {
  'use strict';

  class kudosEdit {
    constructor ({el, addItem}) {
      this.el = el;
      this._onClick = this._onClick.bind(this);
      this._onFocus = this._onFocus.bind(this);
      this._onEntryHead = this._onEntryHead.bind(this);

      this.editField = el.querySelector('.edit-field');
      this._addItem = addItem;


      this.render();

      this.editArea = el.querySelector('.edit-area');

      this._initEvents();

    }

    renderKudosEditArea (editKudos) {
      let kudos = document.createElement('div');
      kudos.className = editKudos.className;

      kudos.innerHTML = `<h3 class="head"></h3>
                        <span class="remove" data-action="remove">X</span>
                        <p class="content"></p>`
      this.editArea.appendChild(kudos);
      this.switchEditor(kudos);

    }

    switchEditor (kudos) {
      if (kudos.className) {
        this.editField.style.zIndex = '1';
        this.editField.style.opacity = '1';
      }
    }

    render () {
      this.editField.innerHTML = `<div class="edit">
                                    <div class="edit-area clearfix">
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
      this.el.addEventListener('focus', this._onFocus, true);
      this.el.addEventListener('keypress', this._onEntryHead);
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

    _onFocus (event) {
      event.preventDefault();

      let item = event.target;

      switch (item.tagName) {
        case 'INPUT':
          this._onEntryHead(item);
          break;
        case 'TEXTAREA':
          this._onEntryContent(item);
          break;
      } 
    }

    _onKeyPress(event) {
      if (event.which == null) { // IE
        if (event.keyCode < 32) return null; // спец. символ
        return String.fromCharCode(event.keyCode)
      }

      if (event.which != 0 && event.charCode != 0) { // все кроме IE
        if (event.which < 32) return null; // спец. символ
        return String.fromCharCode(event.which); // остальные
      }

      return null; // спец. символ
    }

    _onAddClick (item) {
      let dataItem = {type: this.form.querySelector('input').value, content: this.form.querySelector('textarea').value};
      this.form.reset();
      this._addItem(dataItem); 
    }

    _onEntryHead (item) {
      console.log(this.editArea);
      this.editArea.querySelector('.head').innerHTML += this._onKeyPress(event);

    }
  }


  //export
  window.kudosEdit = kudosEdit;

})();