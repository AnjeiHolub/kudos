(function () {
    'use strict';

    class kudosDesk {
        constructor({el}) {
            this.el = el;
            this.data = null;
            this._onClick = this._onClick.bind(this);
            this._onWheel = this._onWheel.bind(this);
            this._onMouseMove = this._onMouseMove.bind(this);
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
            this.el.addEventListener('mousemove', this._onMouseMove);
        }

        /**
         * Metoda przetwarzania eventu 'click'
         */

        _onClick(event) {
            event.preventDefault();

            let item = event.target;
        }

        /**
         * Metoda przetwarzania eventu 'mousemove'
         */

        _onMouseMove(event) {
            event.preventDefault();
            let item = event.target;

            switch (item.dataset.status) {
              case 'desk':
                this._onMouseMoveAction(event, item);
                break;
            } 
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

          if (item.style.transform.indexOf('scale') < 0) { //jeżeli nie ma tego stylu, dodaj
            item.style.transform = item.style.transform + 'scale(1)';
          }

          let maxWheel = 1.2, //maksymalne przyżenie
              minWheel = 0.3, //minimalne oddalenie
              itemStyleArray = item.style.transform.split(/[()]+/), //rozbicie na tablice 'stylu' transform po nawaiasach 
              positionScale = itemStyleArray.indexOf(' scale'), // pozycja 'scale' w tablicy
              scale = itemStyleArray[positionScale + 1], //
              wheel;

          if (event.wheelDelta > 0) { //przybliżenia
            if (+scale <= maxWheel) {
              wheel = +scale + 0.03 + "";
            }
          } else if (event.wheelDelta < 0) { //oddalenie
            if (+scale >= minWheel) {
              wheel = +scale - 0.03 + "";
            }
          }
          
          item.style.transform = item.style.transform.replace(/scale(\((-?\d+(?:\.\d*)?))\)/g,`scale(${wheel})`);
        }

        /**
         * Akcja po poruszaniu się po elemencie
         */

        _onMouseMoveAction(event, item) {
            let rotateY,
                rotateX,
                transform = item.style.transform;

            if (item.style.transform.indexOf('rotateY') < 0) { //jeżeli nie ma tego stylu, dodaj
              item.style.transform = item.style.transform + 'rotateY(0)';
            }
            if (item.style.transform.indexOf('rotateX') < 0) { //jeżeli nie ma tego stylu, dodaj
              item.style.transform = item.style.transform + 'rotateX(0)';
            }
            rotateY = - (((event.x - this.getCoords(item).left)/(item.getBoundingClientRect().width/2)) - 1) * 15;  // wyliczenie
            rotateX =  (((event.y - this.getCoords(item).top)/(item.getBoundingClientRect().height/2)) - 1) * 15;  // wyliczenie
            item.style.transform = item.style.transform.replace(/rotateY(\((-?\d+(?:\.\d*)?)deg)\)/g,`rotateY(${rotateY}deg)`);
            item.style.transform = item.style.transform.replace(/rotateX(\((-?\d+(?:\.\d*)?)deg)\)/g,`rotateX(${rotateX}deg)`);
        }



        getCoords(elem) {
            var box = elem.getBoundingClientRect();

            return {
                top: box.top + window.pageYOffset,
                left: box.left + window.pageXOffset
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