(function () {
    'use strict';

    class kudosApp {
        constructor({el}) {
            this.el = el;
            this._onMouseMove = this._onMouseMove.bind(this);
            this._onMouseDown = this._onMouseDown.bind(this);
            this._onMouseUp = this._onMouseUp.bind(this);
            this._initEvents();
            this.data;
            this.dragObject = {};
        }

        /**
         * Metoda ustawienia danych
         */

        setData(data) {
          this.data = data;
        }

        /**
         * Metoda otrzymania danych
         */

        getData(data) {
          return this.data;
        }

        /**
         * Podpięcie nasłuchiwaczy eventów
         */

        _initEvents() {
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
              if (item.dataset.action === 'attach') {
                this._onMouseDownAttach(item, event);
                return;
              }
              item = item.parentNode;
            }
        }

        /**
         * Sprawdzenie czy element jest jednym z elementów z tablicy, czy jest elementem w stanie "gotowy"
         */

        checkReadyStatus(item) {
            if (item.dataset.status === "ready") {
                return true;
            } else {
                return false;
            }
        }

        /**
         * Przeniesienie/dodanie kudosa do tablicy ze stanu "gotowy"
         */

        addToBoard() {
            if (!("items" in this.data)) {
                this.data.items = [];
            }

            this.data["item-ready"].coordinates = this.dragObject.avatar.coordinates;
            this.data.items.push(this.data["item-ready"]);
            this.data["item-ready"] = null;
        }

        /**
         * Zmiana pozycjy kudosa na tablicy
         */

        moveKudosOnBoard() {
            for (let i = 0, length = this.data.items.length; i < length; i = i + 1) {
                if (this.data.items[i].id === this.dragObject.avatar.dataset.id) {
                    this.data.items[i].coordinates = this.dragObject.avatar.coordinates;
                }
            }
        }

        /**
         * Usąnięcie kudosa z aplikacji
         */

        removeKudos(item) {
            let index;
            if (item.dataset.status === "ready") { //jeżeli element jest ze stanu "Gotowy"
                delete this.data['item-ready'];        
            } else { //jeżeli element jest z tablicy
                for (let i = 0, length = this.data.items.length; i <=length; i = i + 1) {
                    if (this.data.items[i].id === item.data.id) {
                        this.data.items.splice(i, 1);
                        return;
                    }
                }
            }
        }

        getCoords(elem) {
            var box = elem.getBoundingClientRect();

            return {
                top: box.top + window.pageYOffset,
                left: box.left + window.pageXOffset
            }
        }

        _onMouseMove(event) {
            if (!this.dragObject.elem) return; // element nie jest schwytany

            if (!this.dragObject.avatar) { // jeżeli przenoszenie nie rozpoczęto
                let moveX = event.pageX - this.dragObject.downX;
                let moveY = event.pageY - this.dragObject.downY;

                if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) { // jeżeli myszkę w naciśniętym stanie przesunięto nie wystarczająco daleko
                    return;
                }

                // zaczynamy przesunięcie
                this.dragObject.avatar = this.createAvatar(event); // tworzymy avatar
                if (!this.dragObject.avatar) { // anulowanie przeniesienia, nie można złapać element za tą część
                    dragObject = {};
                    return;
                }

                // avatar stworzony
                // tworzymy pomocne właściwości shiftX/shiftY
                let coords = this.getCoords(this.dragObject.avatar);
                this.dragObject.shiftX = this.dragObject.downX - coords.left;
                this.dragObject.shiftY = this.dragObject.downY - coords.top;

                this.startDrag(event); // pokazać początek przesunięcia obiektu
            }
            // wyświetlić przesunięcie obiektu przy każdym ruchu myszki
            this.dragObject.avatar.style.left = event.pageX  - this.dragObject.shiftX + 'px';
            this.dragObject.avatar.style.top = event.pageY - this.dragObject.shiftY + 'px';

            return false;
        }

        createAvatar(event) {
            // zapamiętać stare właściwości, żeby przewrócić je przy anulowaniu przesunięcia obiektu
            var avatar = this.dragObject.elem;
            var old = {
                parent: avatar.parentNode,
                nextSibling: avatar.nextSibling,
                position: avatar.style.position || '',
                left: avatar.style.left || '',
                top: avatar.style.top || '',
                zIndex: avatar.style.zIndex || ''
            };

            // funkcja dla anulowania przesunięcia obiektu
            avatar.rollback = function() {
                old.parent.insertBefore(avatar, old.nextSibling);
                avatar.style.position = old.position;
                avatar.style.left = old.left;
                avatar.style.top = old.top;
                avatar.style.zIndex = old.zIndex;
            };

            return avatar;
        }

        startDrag(event) {
            var avatar = this.dragObject.avatar;

            var parent = this.dragObject.elem.parentElement;
            // initializowanie początku przesunięcia obiektu
            document.body.appendChild(avatar);
            avatar.style.zIndex = 9999;
            avatar.style.position = 'absolute';
            this.trigger('startDrag');
        }

        _onMouseUp(event) {
            if (this.dragObject.avatar) { // jeżeli przesunięcie jest w ciągu
              this.finishDrag(event);
            }

            // przesunięcie albo nie rozpoczeło się, albo skończyło się
            // w każdym bądź razie wyczyścimy "stan przesunięcia" dragObject
            this.dragObject = {};
        }

        finishDrag(event) {
            var dropElem = this.findDroppable(event);

            if (!dropElem) {
              this.onDragCancel(this.dragObject);
            } else {
              this.onDragEnd(this.dragObject, dropElem);
            }
            this.trigger('finishDrag');
        }

        findDroppable(event) {
            // schowamy przenoszony element
            this.dragObject.avatar.hidden = true;

            // wykryć najbardziej zagnieżdżony elemnt znajdujący się pod kursorem myszki
            var elem = document.elementFromPoint(event.clientX, event.clientY);

            // pokazać przenoszony element z powrotem
            this.dragObject.avatar.hidden = false;

            if (elem == null) {
              // to jest możliwe, w przypadku gdy kursor "wyleciał" za granicy okna przeglądarki
              return null;
            }

            if (elem.closest('[data-status="trash"]')) {
                this.dragObject.avatar.endPoint = 'trash';
            } else if (elem.closest('[data-status="desk"]')) {
                this.dragObject.avatar.endPoint = 'desk';
            }

            return elem.closest('[data-status="trash"]') || elem.closest('[data-status="desk"]');
        }

        onDragEnd (dragObject, dropElem) {
            if (this.dragObject.avatar.endPoint === "desk") { // mouseup odbył się nad tablicą
                let deskElement = document.querySelector('[data-status="desk"]'),
                    coordsDesk = this.getCoords(deskElement),
                    dragObject = {}; 



                dragObject = {
                    left: event.pageX - this.dragObject.shiftX - coordsDesk.left,
                    top: event.pageY - this.dragObject.shiftY - coordsDesk.top
                };

                // przenuszony element występuje za górną krawędź - ustawić element w dół górnej krawędzi
                if (dragObject.top < 0) dragObject.top = 0;

                // przenuszony element występuje za lewą krawędź - ustawić element w dół lewej krawędzi
                if (dragObject.left < 0) dragObject.left = 0;

                // przenuszony element występuje za prawą krawędź - ustawić element w dół prawej krawędzi
                if (dragObject.left + this.dragObject.avatar.clientWidth > deskElement.clientWidth) {
                    dragObject.left = deskElement.clientWidth - this.dragObject.avatar.clientWidth;
                }

                // przenuszony element występuje za dolną krawędź - ustawić element w dół dolnej krawędzi
                if (dragObject.top + this.dragObject.avatar.clientHeight > deskElement.clientHeight) {
                    dragObject.top = deskElement.clientHeight - this.dragObject.avatar.clientHeight;
                }

                this.dragObject.avatar.coordinates = {
                    left: dragObject.left,
                    top: dragObject.top
                };
                if (this.dragObject.avatar.startPoint === "tools") { // poruszanym elementem jest element ze stanu "gotowy"
                    this.addToBoard();
                } else { // poruszanym elementem jest elementem z tablicy
                    this.moveKudosOnBoard();
                }
                this.dragObject.elem.remove();
                this.trigger('refreshData');
            } else if (this.dragObject.avatar.endPoint === "trash") {
                this.removeKudos(this.dragObject.elem);
                this.trigger('refreshData');
                this.dragObject.elem.remove();
            } else {

            }
        }

        onDragCancel (dragObject) {
            this.dragObject.avatar.rollback();
            this.trigger('cancelDrag');
        }
        
        /**
         * Złapanie elementu do przeniesienia na tablice
         */

        _onMouseDownAttach(item, event) {

            // zapamiętujemy przenoszony element
            this.dragObject.elem = item;

            item.hidden = true;

            // получить самый вложенный элемент под курсором мыши
            var elem = document.elementFromPoint(event.clientX, event.clientY);

            // показать переносимый элемент обратно
            item.hidden = false;

            // zapamiętujemy pozycje z krórej rozpoczeło się przenoszenie elementu
            // i element w którym zawierała się przenoszony element
            if (elem.closest('[data-status="tools"]')) {
                this.dragObject.elem.startPoint = 'tools';
            } else if (elem.closest('[data-status="desk"]')) {
                this.dragObject.elem.startPoint = 'desk';
            }

            this.dragObject.downX = event.pageX;
            this.dragObject.downY = event.pageY;

            return false;
        }

        on (name, callback) {
            this.el.addEventListener(name, callback);
        }

        trigger (name, data) {
            let widgetEvent = new CustomEvent(name, {
                bubbles: true,
                detail: data
            });

            this.el.dispatchEvent(widgetEvent);
        }
    }


    //export
    window.kudosApp = kudosApp;

})();