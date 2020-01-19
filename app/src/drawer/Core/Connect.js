import Line from "./Line.js";
import Serializer from "./Serializer.js";

export default class Connect {
    /**
     * Connect constructor
     *
     * @param {String} host
     * @param {Function} callback
     */
    constructor(host, callback) {
        this._socket = new WebSocket(`ws://127.0.0.1:80/ws`);
        this._socket.onmessage = (event) => {
            let package = JSON.parse(event.data);
            callback(package.data);
        };
        this._timer = setInterval(() => {
            if(this._stack.length > 0) {
                this.send();
            }
        }, 1000);
        this._stack = [];
    }

    /**
     * Send line to ws server
     *
     * @param {Line} line
     * @returns {Boolean}
     */
    sendLine(line) {
        this._stack.push(line);
        return this;
    }

    /**
     * Send stack to server
     */
    send() {
        let data = Serializer.serializeArrayToJson(this._stack);
        const json = `{"id": 1, "data": ${data}}`;
        if (this._socket.readyState == this._socket.OPEN) {
            this._socket.send(json);
            return true;
        }
        return false;
    }
}