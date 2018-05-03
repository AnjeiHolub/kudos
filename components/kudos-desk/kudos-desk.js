(function () {
    'use strict';

    class kudosDesk {
        constructor({el}) {
            this.el = el;
            this.data = null;
            this._onClick = this._onClick.bind(this);
            this._onWheel = this._onWheel.bind(this);
            this.tableField = el.querySelector('.table-field');

            this.table = el.querySelector('.table');

            this._initEvents();

        }

        /**
         * Dodanie elementów do drzewa DOM
         */

        render() {
            function getRenderKudos(data) {

                function getContentItem(fieldsContent) {
                    return fieldsContent.map(function (item) {
                        return `<p class="content" style="top: ${item.top}px; left: ${item.left}px">${item.content}</p>`
                    }).join('');
                }

                return data.items.map(function (item, index) {
                    return `<div class="${item.className}" data-id="${item.id}" data-index="${index}" data-status="added" data-action="attach" style="top: ${item.coordinates.top}px; left: ${item.coordinates.left}px">
                    ${getContentItem(item.fieldsContent)}
                  </div>`
                }).join('');

            };

            this.tableField.innerHTML = `<div class="table" data-status="desk">
                                    <h2 class="title">${this.data.title}</h2>
                                    ${this.data.items ? getRenderKudos(this.data) : ""}
                                  </div>`;

            this.tableField.querySelectorAll('.kudos').forEach((kudos, index) => {
                kudos.data = this.data.items[index];
        })
            ;
        }

        /**
         * Podpięcie nasłuchiwaczy eventów
         */

        _initEvents() {
            this.el.addEventListener('click', this._onClick);
            window.addEventListener('wheel', this._onWheel);
        }

        /**
         * Metoda przetwarzania eventu 'click'
         */

        _onClick(event) {
            event.preventDefault();

            let item = event.target;
        }

        /**
         * Metoda przetwarzania eventu 'scroll'
         */

        _onWheel(event) {
            event.preventDefault();
            let item = event.target;

            switch (item.dataset.status) {
              case 'desk':
                this._onWheelAction(event, item);
                break;
            } 
        }

        /**
         * Akcja po scrollowaniu
         */

        _onWheelAction(event, item) {
          let max = 10,
              min = 0.3,
              state = item.style.transform.slice(6, -1),
              wheel;
          if (event.wheelDelta > 0) {
            if (!state) {
              state = 1;
            }
            wheel = +state + 0.03 + "";
            console.log(wheel);
            item.style.transform = `scale(${wheel})`;
          } else if (event.wheelDelta < 0) {
            if (!state) {
              state = 1;
            }
            wheel = +state - 0.03 + "";
            console.log(wheel);
            item.style.transform = `scale(${wheel})`;
          }
        }

        /**
         * Dodanie elementu do danych *import*
         */

        _addItem(item) {
            this.data.items.push(item.data);
            this.render();
        }

        /**
         * Jeżeli element został przeniesiony *import*
         */

        _moveItem(item, coordinates) {
            this.data.items[item.dataset.index].coordinates = coordinates;
            this.render();
        }

        /**
         * Funkcja przetwarzania akcji 'remove' (usunięcia) elementu
         */

        _onRemoveClick(item) {
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

        /**
         * Metoda odświeżenia danych
         */

        refreshData(data) {
          this.data = data;
          this.render();
        }

        /**
         * Metoda ustawienia danych
         */

        setData (data) {
            this.data = data;
        }

        /**
         * Metoda otrzymania danych
         */

        getData () {
            return this.data;
        }
    }


    //export
    window.kudosDesk = kudosDesk;

})();