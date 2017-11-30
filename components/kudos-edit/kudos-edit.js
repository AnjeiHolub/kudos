(function () {
  'use strict';

  class kudosEdit {
    constructor ({el, addReadyItem}) {
      this.el = el;
      this._onClick = this._onClick.bind(this);
      this.editField = el.querySelector('.edit-field');
      this._addReadyItem = addReadyItem;
      this.editKudos;
      this.switchEditor();
      this.render();
      this.form = el.querySelector('.form');
      this.editArea = el.querySelector('.edit-area');
      this.editKudosArea = el.querySelector('.kudos-edit');
      this._initEvents();

    }

    /**
     * Fukcja przetwarzania edycji wybranego elementu *import*
     */

    renderKudosEditArea (editKudos) {
      this.editKudos = editKudos;
      this.editKudosArea.className = editKudos.className;
      this.editKudosArea.classList.add('kudos-edit');
      this.switchEditor();
    }

    /**
     * Przełącznik wyświetlenia obszaru edycji elementów
     */

    switchEditor () {
      if (this.editField.classList.contains('edit-field-show')) {
        this.editField.classList.remove('edit-field-show');
        this.editField.classList.add('edit-field-hidden');
      } else if (this.editField.classList.contains('edit-field-hidden')) {
        this.editField.classList.add('edit-field-show');
        this.editField.classList.remove('edit-field-hidden');
      } else {
        this.editField.classList.add('edit-field-hidden');
      }
    }

    /**
     * Dodanie obszaru edycji elemntów do drzewa DOM
     */

    render () {
      this.editField.innerHTML = `<div class="edit">
                                    <div class="edit-area clearfix">
                                      <div class="kudos-edit">
                                        <h3 class="head"></h3>
                                        <span class="remove" data-action="remove">X</span>
                                      </div>
                                    </div>
                                    <form class="form">
                                      <button data-action="add">Сохранить</button>
                                    </form>
                                  </div>`;
    }

    /**
     * Zamknięcie obszaru edycji
     */

    close () {
      this.editArea.innerHTML = '';
      this.switchEditor();
    }

    /**
     * Podpięcie nasłuchiwaczy eventów
     */

    _initEvents () {
      this.el.addEventListener('click', this._onClick);
    }

    /**
     * Metoda przetwarzania eventu 'click'
     */

    _onClick (event) {
      event.preventDefault();

      let item = event.target;

      switch (item.dataset.action) {
        case 'add':
          this._onAddClick(item);
          break;
      }
    }

    /**
     * Metoda dodania elementu do tablicy
     */

    _onAddClick (item) {
      this.editKudos.fieldsContent = this._handelContentEditKudos();
      this.close();
      this._addReadyItem(this.editKudos);  
    }

    /**
     * Przetwarzanie zawartości wyedytowanego kudosa w dane
     */

    _handelContentEditKudos () {
      let contents = this.editKudosArea.querySelectorAll('.content');
      return Array.prototype.map.call(contents, function (item) {
        return {
          content: item.innerHTML,
          top: item.offsetTop/3,
          left: item.offsetLeft/3
        };
      });
    }

    
  }


  //export
  window.kudosEdit = kudosEdit;

})();