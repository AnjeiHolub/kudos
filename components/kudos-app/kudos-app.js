(function () {
  'use strict';

  class kudosApp {
    constructor ({el, addItemKudosDesk, moveItemKudosDesk, removeReadyItemKudosTools, removeItemKudosDesk}) {
      this.el = el;
      this.removeItemKudosDesk = removeItemKudosDesk;
      this.removeReadyItemKudosTools = removeReadyItemKudosTools;
      this.addItemKudosDesk = addItemKudosDesk;
      this.moveItemKudosDesk = moveItemKudosDesk;
      this._onMouseDown = this._onMouseDown.bind(this);
      this._initEvents(); 
    }

    /**
     * Podpięcie nasłuchiwaczy eventów
     */

    _initEvents () {
      this.el.addEventListener('mousedown', this._onMouseDown);
    }

    /**
     * Metoda przetwarzania eventu 'mousedown'
     */

    _onMouseDown () {
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
     * Złapanie elementu do przeniesienia na tablice
     */

    _onMouseDownAttach (item, event) {
      function drag(event) {
          item.style.top = event.pageY - 10 + 'px';
          item.style.left = event.pageX - 10 + 'px';
      };
      item.hidden = !item.hidden;
      let startingPoint = document.elementFromPoint(event.pageX - 10,event.pageY - 10);
      item.hidden = !item.hidden;
      item.style.position = 'absolute';
      item.style.top = event.pageY - 10 + 'px';
      item.style.left = event.pageX - 10 + 'px';
      this.el.addEventListener('mousemove', drag);
      item.onmouseup = (event) => {
        item.hidden = !item.hidden;
        let endPoint = document.elementFromPoint(event.pageX - 10,event.pageY - 10);
        item.hidden = !item.hidden;
        if (endPoint.closest('[data-status="desk"]') && startingPoint !== endPoint) {
          item.data.coordinates = {
            left: event.pageX,
            top: event.pageY
          };
          this.addItemKudosDesk(item);
          this.removeReadyItemKudosTools();
          item.removeEventListener('mousedown', this._onMouseDown);
          this.el.removeEventListener('mousemove', drag);
          item.onmouseup = null;
        } else if (endPoint.closest('[data-status="trash"]')) {
          if (startingPoint.closest('[data-status="desk"]')) {
            this.removeItemKudosDesk(item);
          } else if (startingPoint.closest('[data-status="tools"]')) {
            this.removeReadyItemKudosTools();
          }
        } else if (startingPoint === endPoint) {
          let coordinates = {
            left: event.pageX,
            top: event.pageY
          };
          this.moveItemKudosDesk(item, coordinates);
        }
      }
    }
  }


  //export
  window.kudosApp = kudosApp;

})();