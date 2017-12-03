(function () {
  'use strict';

  class kudosDesk {
    constructor ({el, data}) {
      this.el = el;
      this.data = data;
      this._onClick = this._onClick.bind(this);

      this.tableField = el.querySelector('.table-field');

      this.render();

      this.table = el.querySelector('.table');

      this._initEvents();

    }

    /**
     * Dodanie elementów do drzewa DOM
     */

    render () {

      function getRenderKudos (data) {

        function getContentItem (fieldsContent) {
          return fieldsContent.map(function(item) {
            return `<p class="content" style="top: ${item.top}px; left: ${item.left}px">${item.content}</p>`
                  }).join('');
        }

        return data.items.map(function(item, index) {
          return `<div class="kudos ${item.className}" data-index="${index}" data-action="attach" style="top: ${item.coordinates.top}px; left: ${item.coordinates.left}px">
                    ${getContentItem(item.fieldsContent)}
                  </div>`
                }).join('');

      };

      this.tableField.innerHTML = `<div class="table" data-status="desk">
                                    <h2 class="title">${this.data.title}</h2>
                                    ${getRenderKudos(this.data)}
                                  </div>`;

      this.tableField.querySelectorAll('.kudos').forEach((kudos, index) => {
        kudos.data = this.data.items[index];
      });
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
    }

    /**
     * Dodanie elementu do danych *import*
     */

    _addItem (item) {
      this.data.items.push(item.data);
      this.render();
    }

    /**
     * Jeżeli element został przeniesiony *import*
     */ 

    _moveItem (item, coordinates) {
      this.data.items[item.dataset.index].coordinates = coordinates;
      this.render();
    }

    /**
     * Funkcja przetwarzania akcji 'remove' (usunięcia) elementu
     */

    _onRemoveClick (item) {
      let target = item;
      while (target != this.table) {
        if (target.dataset.index) {
          this._removeItem(target.dataset.index);
          return;
        }
        target = target.parentNode;
      }
    }

    /**
     * Usunięcie elementu z danych
     */

    _removeItem (item) {
      this.data.items.splice(item.dataset.index, 1);
      this.render();
    }

  }


  //export
  window.kudosDesk = kudosDesk;

})();