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
            this.renderingProcess = true; // rendering jest w trakcie
            this.deskParametr = {};
            this.stateRotation = 0;
            this._initEvents();

        }

        /**
         * Dodanie elementów do drzewa DOM
         */

        render() {
            this.renderingProcess = true;

            function getRenderKudos(data) {

                function getContentItem(fieldsContent) {
                    return fieldsContent.map(function (item) {
                        return `<p class="content" style="top: ${item.top}px; left: ${item.left}px">${item.content}</p>`
                    }).join('');
                }

                return data.items.map(function (item, index) {
                    return `<div class="${item.className}" data-id="${item.id}" data-index="${index}" data-status="added" data-action="attach" style="top: ${item.coordinates.top}px; left: ${item.coordinates.left}px">
                    ${item.fieldsContent ? getContentItem(item.fieldsContent) : "" }
                  </div>`
                }).join('');

            };

            this.tableField.innerHTML = `
                                  <div class="feature">
                                    <button data-action="rotation">Rotation</button>
                                    <button data-action="scale-increase">+</button>
                                    <button data-action="scale-decrease">-</button>
                                  </div>
                                  <div class="table" data-status="desk" style="transform: scale(1)">
                                    <h2 class="title">${this.data.title}</h2>
                                    ${this.data.items ? getRenderKudos(this.data) : ""}
                                    <div class="border-wrapper-top">
                                      <div class="border">
                                        <div class="border__face border__face--front"></div>
                                        <div class="border__face border__face--back"></div>
                                        <div class="border__face border__face--right"></div>
                                        <div class="border__face border__face--left"></div>
                                        <div class="border__face border__face--top"></div>
                                        <div class="border__face border__face--bottom"></div>
                                      </div>
                                    </div>
                                    <div class="border-wrapper-left">
                                      <div class="border">
                                        <div class="border__face border__face--front"></div>
                                        <div class="border__face border__face--back"></div>
                                        <div class="border__face border__face--right"></div>
                                        <div class="border__face border__face--left"></div>
                                        <div class="border__face border__face--top"></div>
                                        <div class="border__face border__face--bottom"></div>
                                      </div>
                                    </div>
                                  </div>`;

            this.tableField.querySelectorAll('.kudos').forEach((kudos, index) => {
                kudos.data = this.data.items[index];
            });

            this.restoreState();

            this.renderingProcess = false; // rendering skończył się
        }
        
        /**
         * Podpięcie nasłuchiwaczy eventów
         */

        restoreState() {

            function getStylesState(deskParametr) {
              var style = '';

              if (Object.keys(deskParametr).length !== 0) {
                //style = 'style="transform:';
              } else {
                return '';
              }

              for (var properties in deskParametr) {
                if (deskParametr.hasOwnProperty(properties)) {
                  style += ' ' +  properties + '(' + deskParametr[properties] + ')';
                }
              }

              //style += ';"';

              return style;
            }

            // po to żeby była widoczna animacja przewrucenia stanu, po przesunięciu elementu
            setTimeout(() => {
              this.tableField.querySelector('.table').style.transform = getStylesState(this.deskParametr);
            }, 0);
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

            if (item.dataset.action === 'rotation') {
              this._onClickToggleRotation();
            } else if (item.dataset.action === 'scale-increase') {
              this.changeScale(1, 0.05);
            } else if (item.dataset.action === 'scale-decrease') {
              this.changeScale(-1, 0.05);
            }
        }

        /**
         * Metoda przetwarzania eventu 'mousemove'
         */

        _onMouseMove(event) {
            event.preventDefault();
            let item = event.target;

            while (item != document) {
              if (item.dataset.status === 'desk') {
                this._onMouseMoveAction(event, item);
                return;
              }
              item = item.parentNode;
            }

            if (!this.renderingProcess) {
              this.flatState();  
            }
        }

        /**
         * Metoda przetwarzania eventu 'scroll'
         */

        _onWheel(event) {
            event.preventDefault();
            let item = event.target;

            while (item != document) {
              if (item.dataset.status === 'desk') {
                this._onScaleAction(event, item);
                return;
              }
              item = item.parentNode;
            }
        }

        /**
         * Przełącznik do rotacji deski
         */

        _onClickToggleRotation() {
          if (this.stateRotation) {
            this.el.removeEventListener('mousemove', this._onMouseMove);
            this.stateRotation = 0;
          } else if (!this.stateRotation) {
            this.el.addEventListener('mousemove', this._onMouseMove);
            this.stateRotation = 1;
          }

        }

        /**
         * Stan płaski bez nachyleń
         */

        flatState() {
          let item = document.querySelector('[data-status="desk"]');
          item.style.transform = item.style.transform.replace(/rotateY(\((-?\d+(?:\.\d*)?)deg)\)/g,`rotateY(0deg)`);
          item.style.transform = item.style.transform.replace(/rotateX(\((-?\d+(?:\.\d*)?)deg)\)/g,`rotateX(0deg)`);
        }

        /**
         * Stan początkowy "zerowy"
         */

        initialState() {
          let item = document.querySelector('[data-status="desk"]');
          this.saveScaleState(item);
          item.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)'; 
        }

        /**
         * Stan początkowy "zerowy" (w momencie przenoszenia kudosa) oraz blokada "mousmowe"
         */

        mouseMoveBlock() {
          this.initialState();
          if (this.stateRotation) {
            this.el.removeEventListener('mousemove', this._onMouseMove);
          }
        }

        /**
         * Odblokowanie "mousmowe"
         */

        mouseMoveUnBlock() {
          if (this.stateRotation) {
            this.el.addEventListener('mousemove', this._onMouseMove);  
          }
        }

        /**
         * Akcja po scrollowaniu
         */

        _onScaleAction(event, item) {

          this.changeScale(event.wheelDelta, 0.03);
          
          this.saveScaleState(item);
        }

        /**
         * Zapisanie stanu - wartośc przybliżenia/oddalenia
         */

        changeScale(wheelDelta, changeDelta) {
          
          let item = this.el.querySelector('[data-status="desk"]'),
              maxWheel = 1, //maksymalne przybliżenie
              minWheel = 0.3, //minimalne oddalenie
              itemStyleArray,
              positionScale,
              scaleElement,
              scale;

          if (item.style.transform.indexOf('scale') < 0) { //jeżeli nie ma tego stylu, dodaj
            item.style.transform = item.style.transform + 'scale(1)';
          }

          itemStyleArray = item.style.transform.replace(/\s+/g, '').replace('transform:', '').split(/[()]+/); //usuwamy wszystkie "whitespace", usuwamy "transform:", rozbijamy na tablice 'stylu' transform po nawaiasach 
          positionScale = itemStyleArray.indexOf('scale'); // pozycja 'scale' w tablicy
          scaleElement = itemStyleArray[positionScale + 1]; //

          if (wheelDelta > 0) { //przybliżenie
            if (+scaleElement <= maxWheel) {
              scale = +scaleElement + changeDelta + "";
            }
          } else if (wheelDelta < 0) { //oddalenie
            if (+scaleElement >= minWheel) {
              scale = +scaleElement - changeDelta + "";
            }
          }
          
          item.style.transform = item.style.transform.replace(/scale(\((-?\d+(?:\.\d*)?))\)/g,` scale(${scale})`);  
        }

        /**
         * Zapisanie stanu - wartośc przybliżenia/oddalenia
         */

        saveScaleState(item) {
          let itemStyleArray = item.style.transform.replace(/\s+/g, '').replace('transform:', '').split(/[()]+/), //usuwamy wszystkie "whitespace", usuwamy "transform:", rozbijamy na tablice 'stylu' transform po nawaiasach 
              positionScale = itemStyleArray.indexOf('scale'), // pozycja 'scale' w tablicy
              scaleElement = itemStyleArray[positionScale + 1];

          this.deskParametr.scale = scaleElement; 
        }

        /**
         * Akcja po poruszaniu się po elemencie
         */

        _onMouseMoveAction(event, item) {
            let rotateY,
                rotateX,
                transform = item.style.transform,
                itemStyleArray = transform.replace(/\s+/g, '').replace('transform:', '').split(/[()]+/), //usuwamy wszystkie "whitespace", usuwamy "transform:", rozbijamy na tablice 'stylu' transform po nawaiasach 
                positionScale = itemStyleArray.indexOf('scale'), // pozycja 'scale' w tablicy
                scaleElement = itemStyleArray[positionScale + 1];

            if (item.style.transform.indexOf('scale') < 0) { //jeżeli nie ma tego stylu, dodaj
              item.style.transform = item.style.transform + 'scale(1)';
            }
            if (item.style.transform.indexOf('rotateY') < 0) { //jeżeli nie ma tego stylu, dodaj
              item.style.transform = item.style.transform + 'rotateY(0)';
            }
            if (item.style.transform.indexOf('rotateX') < 0) { //jeżeli nie ma tego stylu, dodaj
              item.style.transform = item.style.transform + 'rotateX(0)';
            }
            rotateY = - (((event.x - this.getCoords(item).left)/(item.getBoundingClientRect().width/2)) - 1) * 40 * scaleElement;  // wyliczenie
            rotateX =  (((event.y - this.getCoords(item).top)/(item.getBoundingClientRect().height/2)) - 1) * 40 * scaleElement;  // wyliczenie
            item.style.transform = item.style.transform.replace(/rotateY(\((-?\d+(?:\.\d*)?)deg)\)/g,`rotateY(${rotateY}deg)`);
            item.style.transform = item.style.transform.replace(/rotateX(\((-?\d+(?:\.\d*)?)deg)\)/g,`rotateX(${rotateX}deg)`);
            //this.deskParametr.rotateY = rotateY + 'deg';
            //this.deskParametr.rotateX = rotateX + 'deg';
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