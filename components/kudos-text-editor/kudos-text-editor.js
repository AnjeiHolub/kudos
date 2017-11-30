(function () {
    
    'use strict';


    class kudosTextEditor {
      constructor ({el, workingArea}) {

        this.el = el;
        this.workingArea = workingArea;
        this._onClick = this._onClick.bind(this);
        this._onFocusOut = this._onFocusOut.bind(this);
        this._onEntryHead = this._onEntryHead.bind(this);
        this._onKeyPress = this._onKeyPress.bind(this);
        this.editInput;
        this._initEvents();

        this.coordsEditArea = this.getCoordsElement(this.workingArea);
      }

      /**
       * Podpięcie nasłuchiwaczy eventów
       */

      _initEvents() {
        this.el.addEventListener('click', this._onClick);
        this.el.addEventListener('focusout', this._onFocusOut);
      }

      /**
       * Metoda przetwarzania eventu 'click'
       */

      _onClick(event) {
        let target = event.target;
        if (target == this.workingArea) {

          this._onAddClick(event);

        }
      }

      /**
       * Przetwarzanie akcji dodania pola do wpisania tekstu
       */

      _onAddClick(event) {
        let input = document.createElement('input');
        input.classList.add('input-text-editor');
        this.workingArea.appendChild(input);
        input.style.position = 'absolute';
        input.style.top = event.pageY - input.getBoundingClientRect().top + input.offsetHeight/2 + 'px';
        input.style.left = event.pageX - input.getBoundingClientRect().left + 'px';
        input.style.zIndex = '9999';
        this.inputTextEditor = input;
        input.focus();
      }

      /**
       * Metoda wywoływana w momencie eventu 'focusout'
       */

      _onFocusOut(event) {
        let target = event.target;
        if (target.classList.contains('input-text-editor')) {
          this.addTypedText(target);
        }
      }

      /**
       * Dodanie wpisanego tekstu w drzewo DOM
       */

      addTypedText(target) {
        let typedText =  document.createElement('p');
        typedText.classList.add('content');
        typedText.innerHTML = target.value;
        typedText.style.position = 'absolute';
        typedText.style.top = this.getCoordsEditInput(target).top + 'px';
        typedText.style.left = this.getCoordsEditInput(target).left + 'px';
        this.workingArea.replaceChild(typedText, target);
      }

      /**
       * Określenie współrzędnych wybranego elemntu w odniesieniu do strony
       */

      getCoordsElement(elem) { 
        let box = elem.getBoundingClientRect();

        return {
          top: box.top + pageYOffset,
          left: box.left + pageXOffset
        };
      }

      /**
       * Określenie współrzędnych wybranego elementu
       */

      getCoordsEditInput(elem) {
        return {
          top: parseInt(elem.style.top, 10),
          left: parseInt(elem.style.left, 10)
        }
      }

      /**
       * Wyświetlenie wpisanego teksu w drzewie DOM
       */

      _onKeyPress (item) {
        this.inputTextEditor.innerHTML += this._onEntryHead(event);
      }

      /**
       * Metoda przetwarzania wklikniętych klawisz (event) w dane typu 'string'
       */

      _onEntryHead(event) {
        if (event.which == null) {
          if (event.keyCode < 32) return null;
          return String.fromCharCode(event.keyCode)
        }

        if (event.which != 0 && event.charCode != 0) {
          if (event.which < 32) return null;
          return String.fromCharCode(event.which);
        }

        return null;
      }
    }


    //import
    window.kudosTextEditor = kudosTextEditor;

  })();