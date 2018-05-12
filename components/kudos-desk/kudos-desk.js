(function () {
    'use strict';

    class kudosDesk {
        constructor({el}) {
            this.el = el;
            this.data = null;
            this._onClick = this._onClick.bind(this);
            this._onWheel = this._onWheel.bind(this);
            this._onMouseMove = this._onMouseMove.bind(this);
            this._onMouseUp = this._onMouseUp.bind(this);
            this._onMouseDown = this._onMouseDown.bind(this);
            this.tableField = el.querySelector('.table-field');
            this.renderingProcess = true; // rendering jest w trakcie
            this.deskParametr = {};
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
                    ${getContentItem(item.fieldsContent)}
                  </div>`
                }).join('');

            };

            this.tableField.innerHTML = `<div class="table" data-status="desk" style="transform: scale(1)">
                                    <h2 class="title">${this.data.title}</h2>
                                    ${this.data.items ? getRenderKudos(this.data) : ""}
                                    <div class="scene">
                                      <div class="cube">
                                        <div class="cube__face cube__face--front">front</div>
                                        <div class="cube__face cube__face--back">back</div>
                                        <div class="cube__face cube__face--right">right</div>
                                        <div class="cube__face cube__face--left">left</div>
                                        <div class="cube__face cube__face--top">top</div>
                                        <div class="cube__face cube__face--bottom">bottom</div>
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
            //this.el.addEventListener('mousemove', this._onMouseMove);


            document.addEventListener('mousemove', this._onMouseMove);
            document.addEventListener('mousedown', this._onMouseDown);
            document.addEventListener('mouseup', this._onMouseUp);
        }

        /**
         * Metoda przetwarzania eventu 'mousedown'
         */

        _onMouseDown(event) {
            event.preventDefault();
            let item = event.target;

            if (event.which !== 1) {
                return;
            }

            while (item != document) {
              if (item.classList.contains('table-field')) {
                this._onMouseDownAttach(item, event);
                return;
              }
              item = item.parentNode;
            }
        }

        _onMouseUp(event) {
            this.test = false;
        }

        /**
         * Złapanie elementu do przeniesienia na tablice
         */

        _onMouseDownAttach(item, event) {
            this.test = true;
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
          this.el.removeEventListener('mousemove', this._onMouseMove);
        }

        /**
         * Odblokowanie "mousmowe"
         */

        mouseMoveUnBlock() {
          this.el.addEventListener('mousemove', this._onMouseMove);
        }

        /**
         * Akcja po scrollowaniu
         */

        _onScaleAction(event, item) {

          if (item.style.transform.indexOf('scale') < 0) { //jeżeli nie ma tego stylu, dodaj
            item.style.transform = item.style.transform + 'scale(1)';
          }

          let maxWheel = 1.2, //maksymalne przybliżenie
              minWheel = 0.3, //minimalne oddalenie
              itemStyleArray = item.style.transform.replace(/\s+/g, '').replace('transform:', '').split(/[()]+/), //usuwamy wszystkie "whitespace", usuwamy "transform:", rozbijamy na tablice 'stylu' transform po nawaiasach 
              positionScale = itemStyleArray.indexOf('scale'), // pozycja 'scale' w tablicy
              scaleElement = itemStyleArray[positionScale + 1], //
              scale;

          if (event.wheelDelta > 0) { //przybliżenie
            if (+scaleElement <= maxWheel) {
              scale = +scaleElement + 0.03 + "";
            }
          } else if (event.wheelDelta < 0) { //oddalenie
            if (+scaleElement >= minWheel) {
              scale = +scaleElement - 0.03 + "";
            }
          }
          
          item.style.transform = item.style.transform.replace(/scale(\((-?\d+(?:\.\d*)?))\)/g,` scale(${scale})`);
          this.saveScaleState(item);
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
            if (this.test) {
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
              //rotateY = - (((event.x - this.getCoords(item).left)/(item.getBoundingClientRect().width/2)) - 1) * 20 * scaleElement;  // wyliczenie
              //rotateX =  (((event.y - this.getCoords(item).top)/(item.getBoundingClientRect().height/2)) - 1) * 20 * scaleElement;  // wyliczenie
              rotateY = event.pageX * 0.1;
              rotateX = event.pageY * 0.1;
              item.style.transform = item.style.transform.replace(/rotateY(\((-?\d+(?:\.\d*)?)deg)\)/g,`rotateY(${rotateY}deg)`);
              item.style.transform = item.style.transform.replace(/rotateX(\((-?\d+(?:\.\d*)?)deg)\)/g,`rotateX(${rotateX}deg)`);
              //this.deskParametr.rotateY = rotateY + 'deg';
              //this.deskParametr.rotateX = rotateX + 'deg';

            }
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