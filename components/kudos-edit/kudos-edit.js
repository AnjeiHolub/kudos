(function () {
  'use strict';

  class kudosEdit {
    constructor ({el, addReadyItem}) {
      this.el = el;
      this.data = null;
      this._onClick = this._onClick.bind(this);
      this.editField = this.el.querySelector('.edit-field');
      this._addReadyItem = addReadyItem;
      this.switchEditor();
      this.render();
      this.form = this.el.querySelector('.form');
      this.editArea = this.el.querySelector('.edit-area');
      this.editKudosArea;
      this._initEvents();

    }

    /**
     * Fukcja przetwarzania edycji wybranego elementu *import*
     */

    renderKudosEditArea (editKudos) {
      this.editKudos = editKudos;
      this.data = editKudos;
      this.render();
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

      function getRenderKudos (data) {
        if (data !== null) {
          return `<div class="kudos kudos-edit ${data.className}">
                  </div>`;
        } else {
          return `<div class="kudos kudos-edit">
                  </div>`;
        }
      };

      this.editField.innerHTML = `<div class="edit">
                                    <div class="edit-area clearfix">
                                      ${getRenderKudos(this.data)}
                                    </div>
                                    <form class="form">
                                      <button data-action="add">Сохранить</button>
                                    </form>
                                  </div>`;
      this.editKudosArea = this.el.querySelector('.kudos-edit');
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
      this.data.fieldsContent = this._handelContentEditKudos();
      this.close();
      console.log(this.data);
      this._addReadyItem(this.data);  
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