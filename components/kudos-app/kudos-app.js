(function () {
  'use strict';

  class kudosApp {
    constructor ({el}) {
      this.el = el;
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
          this._onMouseDownAttach(item, event);
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
      item.style.position = 'absolute';
      item.style.top = event.pageY - 10 + 'px';
      item.style.left = event.pageX - 10 + 'px';
      this.el.addEventListener('mousemove', drag);
      this.el.addEventListener('mouseup', (event) => {
        this.el.removeEventListener('mousedown', this._onMouseDown);
        this.el.removeEventListener('mousemove', drag);
        item.style.top = event.pageY - 10 + 'px';
        item.style.left = event.pageX - 10 + 'px';
      });
    }
  }


  //export
  window.kudosApp = kudosApp;

})();