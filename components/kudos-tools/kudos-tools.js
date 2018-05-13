(function () {
  'use strict';

  class kudosTools {
    constructor ({el, renderKudosEditArea}) {
      this.el = el;
      this._onClick = this._onClick.bind(this);
      this._renderKudosEditArea = renderKudosEditArea;
      this.toolsField = el.querySelector('.tools-field');
      this.data;
      this.tools = el.querySelector('.tools');
      this.form;
      this._initEvents();

    }

    /**
     * Dodanie elementów do drzewa DOM
     */

    render () {

      function getReadyKudos (data) {
        let item;

        if (data) {
          item = data["item-ready"];
        }

        function getContentItem (fieldsContent) {
          if (fieldsContent) {
            return fieldsContent.map(function(item) {
              return `<p class="content" style="top: ${item.top}px; left: ${item.left}px" ">${item.content}</p>`
                    }).join('');
          } else {
            return '';
          }
          
        }

        if (item) {
          return `<div class="${item.className}" data-id="${item.id}" data-action="attach" data-status="ready">
                    ${getContentItem(item.fieldsContent)}
                  </div>`;
        } else {
          return  '';
        }


        
      }

      this.toolsField.innerHTML = `<div class="tools">
                                    <div class="kudos-types clearfix">
                                      1. Wybierz kudosa
                                      <div class="kudos-option">
                                        <div class="kudos kudos-thanks" data-action="select"></div>
                                      </div>
                                      <div class="kudos-option">
                                        <div class="kudos kudos-happy" data-action="select"></div>
                                      </div>
                                      <div class="kudos-option">
                                        <div class="kudos kudos-goodwork" data-action="select"></div>
                                      </div>
                                    </div>
                                    <div class="tools-content">
                                      ${this.data["item-ready"] ? "2. Przenieś kudosa w dowolne miejsce na tabeli" : ""}
                                      <div class="area-ready-kudos" data-status="tools">
                                        ${getReadyKudos(this.data)}
                                      </div>
                                      <div class="trash" data-status="trash">
                                        Kosz
                                      </div>
                                    </div>
                                  </div>`;
      if (this.data["item-ready"]) {
        this.toolsField.querySelector('.kudos').data = this.data["item-ready"];
      }
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

      switch (item.dataset.action) {
        case 'select':
          this._onClickSelect(item);
          break;
      } 
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

    setData(data) {
      this.data = data;
    }

    /**
     * Metoda otrzymania danych
     */

    getData () {
        return this.data;
    }


    /**
     * Wybór opcji elementu do edycji
     */

    _onClickSelect (item) {
      let editKudos = {className: item.className};
      this._renderKudosEditArea(editKudos);
    }


    /**
     * Dodanie gotowego elementu po edycji *import*
     */

    _addReadyItem (item) {
      this.data["item-ready"] = item;
      this.trigger('addToKudosReady');
      this.render();
    }

    /**
     * Usunięcie elementu *import*
     */

    _removeReadyItem () {
      this.data = null;
      this.render();
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
  window.kudosTools = kudosTools;

})();