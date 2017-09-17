(function () {
  'use strict';

  class kudosEdit {
    constructor ({el, addItem, addReadyItem}) {
      this.el = el;
      this._onClick = this._onClick.bind(this);
      this._onEntryHead = this._onEntryHead.bind(this);
      this._onKeyPress = this._onKeyPress.bind(this);

      this.editField = el.querySelector('.edit-field');
      this._addItem = addItem;
      this._addReadyItem = addReadyItem;

      this.editKudos;


      this.render();

      this.form = el.querySelector('.form');
      this.editArea = el.querySelector('.edit-area');

      this._initEvents();

    }

    renderKudosEditArea (editKudos) {

      this.editKudos = editKudos;
      let kudos = document.createElement('div');
      kudos.className = editKudos.className;
      kudos.classList.add('kudos-edit');

      kudos.innerHTML = `<h3 class="head"></h3>
                        <span class="remove" data-action="remove">X</span>
                        <p class="content"></p>`
      this.editArea.appendChild(kudos);
      this.switchEditor();

    }

    switchEditor () {
      let kudos = this.editArea.querySelector('.kudos-option')
      if (kudos) {
        this.editField.style.zIndex = '1';
        this.editField.style.opacity = '1';
      } else {
        this.editField.style.zIndex = '-1';
        this.editField.style.opacity = '0';
      }
    }

    render () {
      this.editField.innerHTML = `<div class="edit">
                                    <div class="edit-area clearfix">
                                    </div>
                                    <form class="form">
                                      <input type="text" />
                                      <button data-action="add">Сохранить</button>
                                    </form>
                                  </div>`;
    }

    close () {
      this.form.reset();
      this.editArea.innerHTML = '';
      this.switchEditor();
      
    }

    _initEvents () {
      this.el.addEventListener('click', this._onClick);
      this.el.addEventListener('keypress', this._onKeyPress);
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

    _onEntryHead(event) {
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
      this.editKudos.type = this.editArea.querySelector('.head').innerHTML;
      this.close();
      this._addItem(this.editKudos);
      this._addReadyItem(this.editKudos);  
    }

    _onKeyPress (item) {
      console.log(this.editArea);
      this.editArea.querySelector('.head').innerHTML += this._onEntryHead(event);

    }
  }


  //export
  window.kudosEdit = kudosEdit;

})();