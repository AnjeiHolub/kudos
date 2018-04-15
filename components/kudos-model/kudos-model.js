(function () {
    'use strict';

    let resources = "https://kudos-f16.firebaseio.com/data.json";
    //let resources = "../../data/kudos-f16-export.json";


    class kudosModel {
        constructor () {
            this._handlers = {};
            this.data = null;
        }

        /**
         * Metoda do ustawienia danych
         * @param data
         */

        setData (data) {
            this.data = data;
            this.trigger('update', data);
        }

        /**
         * Metoda do deklarowania "zdarzeń" oraz wywoływanych akcji (callback)
         * @param name
         * @param cb
         */

        on (name, cb) {
            if (!this._handlers[name]) {
                this._handlers[name] = [];
            }

            this._handlers[name].push(cb);
        }

        /**
         * Metoda do obsługi "zdarzeń"
         * @param name
         * @param data
         */

        trigger (name, data) {
            if (this._handlers[name]) {
                this._handlers[name].forEach((callback) => {
                   callback(data);
                });
            }
        }

        /**
         * Metoda wysyła dane poprzez request
         */

        save () {
            this._makeRequest('PUT', resources);
        }

        /**
         * Metoda robi request do pobierania danych
         */

        fetch () {
            this._makeRequest('GET', resources);
        }

        /**
         * Metoda zwraca obiekt requestu
         */

        createRequest () {
            try {
                return new XMLHttpRequest ();
            } catch (trymicrosoft) {
                try {
                    return new ActiveXObject("Msxm12.XMLHTTP");
                } catch (othermicrosoft) {
                    try {
                        return new ActiveXObject("Microsoft.XMLHTTP");
                    } catch (failed) {
                        return null;
                    }
                }
            }
        }

        /**
         * Metoda robi request (pobiera lub wysyła dane)
         * @param method
         * @param resources
         * @private
         */

        _makeRequest (method, resources) {

            let xhr = this.createRequest();
            xhr.open(method, resources, true);

            xhr.addEventListener('readystatechange', () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        let data = JSON.parse(xhr.responseText);
                        if (method == 'GET') {
                            this.setData(data);
                        }
                    } else {
                        console.log("Error! Request status is " + xhr.status);
                    }
                }
            });

            if (method === 'PUT') {
                xhr.send(JSON.stringify(this.data));
            } else {
                xhr.send();
            }

        }
    }


    //export
    window.kudosModel = kudosModel;

})();