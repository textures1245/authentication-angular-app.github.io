export class User {

    constructor(
        public email: string,
        public password: string,
        private _token: string,
        public _tokenExpirationDate: Date,
        public status?: boolean
    ) {}

    get token() {
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }
        return this._token;
    }

}