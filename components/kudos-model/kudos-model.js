(function () {
    'use strict';

    let request = null;
    let resources = "https://kudos-f16.firebaseio.com/data.json";


    class kudosModel {
        constructor () {
            this._handlers = {};
        }

        setData (data) {
            this.trigger('update', data);
        }

        on (name, cb) {
            if (!this._handlers[name]) {
                this._handlers[name] = [];
            }

            this._handlers[name].push(cb);
        }

        trigger (name, data) {
            if (this._handlers[name]) {
                this._handlers[name].forEach((callback) => {
                   callback(data);
                });
            }
        }

        fetch () {
            this._makeRequest('GET', resources);
        }

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

        _makeRequest (method, resources) {
            console.log(method, resources);
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

            xhr.send(null);

        }
    }


    //export
    window.kudosModel = kudosModel;

})();