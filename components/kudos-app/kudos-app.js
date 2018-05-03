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

        // onDragEnd (dragObject, dropElem) {

        // }

        // onDragCancel (dragObject) {

        // }

        /**
         * Metoda przetwarzania eventu 'mousedown'
         */

        _onMouseDown(event) {
            event.preventDefault();
            let item = event.target;

            switch (item.dataset.action) {
                case 'attach':
                    if (event.which == 1) {
                        this._onMouseDownAttach(item, event);
                    }
                    break;
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
            this.dragObject.avatar.style.left = event.pageX - this.dragObject.shiftX + 'px';
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
                avatar.style.zIndex = old.zIndex
            };

            return avatar;
        }

        startDrag(event) {
            var avatar = this.dragObject.avatar;

            // initializowanie początku przesunięcia obiektu
            document.body.appendChild(avatar);
            avatar.style.zIndex = 9999;
            avatar.style.position = 'absolute';
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
                let coords = this.getCoords(document.querySelector('[data-status="desk"]')); 

                this.dragObject.avatar.coordinates = {
                    left: event.pageX - this.dragObject.shiftX - coords.left,
                    top: event.pageY - this.dragObject.shiftY - coords.top
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

            // function drag(event) {
            //     item.style.top = event.pageY - 10 + 'px';
            //     item.style.left = event.pageX - 10 + 'px';
            // };
            // item.hidden = !item.hidden;
            // let startingPoint = document.elementFromPoint(event.pageX - 10, event.pageY - 10);
            // item.hidden = !item.hidden;
            // item.style.position = 'absolute';
            // item.style.top = event.pageY - 10 + 'px';
            // item.style.left = event.pageX - 10 + 'px';
            // this.el.addEventListener('mousemove', drag);
            // item.onmouseup = (event) => {
            //     item.hidden = !item.hidden;
            //     let endPoint = document.elementFromPoint(event.pageX - 10, event.pageY - 10);
            //     item.hidden = !item.hidden;
            //     if (endPoint.closest('[data-status="desk"]') && startingPoint.closest('[data-status="tools"]')) { // mouseup odbył się nad tablicą
            //         item.data.coordinates = {
            //             left: event.pageX,
            //             top: event.pageY
            //         };
            //         if (this.checkReadyStatus(item) === true) { // poruszanym elementem jest element ze stanu "gotowy"
            //             this.addToBoard();
            //         } else { // poruszanym elementem jest elementem z tablicy
            //             this.moveKudosOnBoard(item);
            //         }
            //         this.trigger('refreshData');
            //         item.removeEventListener('mousedown', this._onMouseDown);
            //         this.el.removeEventListener('mousemove', drag);
            //         item.onmouseup = null;
            //     } else if (endPoint.closest('[data-status="trash"]')) {
            //         this.removeKudos(item);
            //         this.trigger('refreshData');
            //         item.remove();
            //     } else {

            //     }
            // }
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