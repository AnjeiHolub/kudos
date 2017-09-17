(function () {
    
    'use strict';


    class kudosTextEditor {
      constructor ({el}) {

        this.el = el;
        
        this._onClick = this._onClick.bind(this);
        this._initEvents();
      }

      _initEvents () {
        this.el.addEventListener('click', this._onClick);
      }

      _onClick (event) {
        let target = event.target;

        this._checkIsEditArea();

        if (target == this.editArea) {
          this._onAddClick(event);

        }
      }

      _checkIsEditArea () {
        if (this.el.querySelector('.kudos-edit')) {
          this.editArea = this.el.querySelector('.kudos-edit');
          this.coordsEditArea = this.getCoords(this.editArea);
        }
        
      }

      _onAddClick (event) {
        console.log(event.pageX+':'+event.pageY);
      }

      getCoords(elem) { 
        var box = elem.getBoundingClientRect();

        return {
          top: box.top + pageYOffset,
          left: box.left + pageXOffset
        };

      }
    }


    //import
    window.kudosTextEditor = kudosTextEditor;

  })();