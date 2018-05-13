(function () {
    
    'use strict';


    class kudosTextEditor {
      constructor ({el, selectorWorkingArea}) {

        this.el = el;
        this.selectorWorkingArea = selectorWorkingArea;
        this.workingArea = document.querySelector(this.selectorWorkingArea);
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
        this.prepareWorkingArea();
        let target = event.target;
        if (target === this.workingArea) {
          this._onAddClick(event);
        }
      }

      /**
       * Przygotowanie obszaru roboczego
       */

      prepareWorkingArea() {
        let workingArea = document.querySelector(this.selectorWorkingArea);
        if (this.workingArea !== workingArea) {
          this.workingArea = workingArea;
        }
      }

      /**
       * Przetwarzanie akcji dodania pola do wpisania tekstu
       */

      _onAddClick(event) {
        let input = document.createElement('input'),
            typedText = document.createElement('p');
        input.classList.add('input-text-editor');
        this.workingArea.appendChild(input);
        input.value = 'Wpisz tekst...';
        input.style.position = 'absolute';
        input.style.top = event.pageY - input.getBoundingClientRect().top - input.offsetHeight/2 + 'px';
        input.style.left = event.pageX - input.getBoundingClientRect().left + 'px';
        input.style.zIndex = '9999';
        this.inputTextEditor = input;

        typedText.className = "content";
        input.parentNode.insertBefore(typedText, this.inputTextEditor.nextSibling);
        typedText.style.top = input.style.top;
        typedText.style.left = input.style.left;
        typedText.style.position = 'absolute';
        typedText.style.zIndex = '-9999';

        this.inputTextEditor.oninput = function() {
          this.nextElementSibling.innerHTML = this.value;
          this.style.width = this.nextElementSibling.clientWidth + 'px';
        };

        this.inputTextEditor.oninput();

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
        if (target.value === "" || target.value === "Wpisz tekst...") {
          this.workingArea.removeChild(target.nextElementSibling);
          this.workingArea.removeChild(target);
          return;
        }
        target.nextElementSibling.style.position = 'absolute';
        target.nextElementSibling.style.zIndex = '1';
        this.workingArea.removeChild(target);
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