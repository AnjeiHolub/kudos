(function () {
    
    'use strict';


    class kudosTextEditor {
      constructor ({el, workingArea}) {

        this.el = el;
        this.workingArea = workingArea;
        this._onClick = this._onClick.bind(this);
        this._onFocusOut = this._onFocusOut.bind(this);
        this.editInput;
        this._initEvents();

        this.coordsEditArea = this.getCoordsElement(this.workingArea);
      }

      _initEvents() {
        this.el.addEventListener('click', this._onClick);
        this.el.addEventListener('focusout', this._onFocusOut);
      }

      _onClick(event) {
        let target = event.target;

        if (target == this.workingArea) {
          this._onAddClick(event);

        }
      }

      _onAddClick(event) {
        let input = document.createElement('input');
        input.style.position = 'absolute';
        input.style.top = event.pageY + 'px';
        input.style.left = event.pageX + 'px';
        input.style.zIndex = '9999';
        input.classList.add('input-text-editor');
        this.workingArea.appendChild(input);
        input.focus();
      }

      _onFocusOut(event) {
        let target = event.target;
        if (target.classList.contains('input-text-editor')) {
          this.addTypedText(target);
        }
      }

      addTypedText(target) {
        let typedText =  document.createElement('p');
        typedText.innerHTML = target.value;
        typedText.style.position = 'absolute';
        typedText.style.top = this.getCoordsEditInput(target).top + 'px';
        typedText.style.left = this.getCoordsEditInput(target).left + 'px';
        typedText.classList.add('content');
        this.workingArea.appendChild(typedText);
        this.workingArea.replaceChild(typedText, target);
      }

      getCoordsElement(elem) { 
        let box = elem.getBoundingClientRect();

        return {
          top: box.top + pageYOffset,
          left: box.left + pageXOffset
        };

      }

      getCoordsEditInput(elem) {
        return {
          top: parseInt(elem.style.top, 10)- this.coordsEditArea.top,
          left: parseInt(elem.style.left, 10) - this.coordsEditArea.left
        }
      }
    }


    //import
    window.kudosTextEditor = kudosTextEditor;

  })();