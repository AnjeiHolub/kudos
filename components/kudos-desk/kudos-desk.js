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

    render () {

      function getRenderKudos (data) {
        return data.items.map(function(item, index) {
          return `<div class="kudos" data-index="${index}">
                    <h3 class="type">${item.type}</h3>
                    <span class="remove" data-action="remove">X</span>
                    <p class="content">${item.content}</p>
                  </div>`
                }).join('');

      };

      this.tableField.innerHTML = `<div class="table">
                                    <h2 class="title">${this.data.title}</h2>
                                    ${getRenderKudos(this.data)}
                                  </div>`;
    }

    _initEvents () {
      this.el.addEventListener('click', this._onClick);
    }

    _onClick (event) {
      event.preventDefault();

      let item = event.target;

      switch (item.dataset.action) {
        case 'remove':
          this._onRemoveClick(item);
          break;
      }
    }

    _addItem (item) {
      this.data.items.push(item);
      this.render();
    }

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

    _removeItem (index) {
      this.data.items.splice(index, 1);
      this.render();
    }

  }


  //export
  window.kudosDesk = kudosDesk;

})();