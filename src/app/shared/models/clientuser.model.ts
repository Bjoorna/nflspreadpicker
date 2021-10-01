export class ClientUser{
    constructor(
        public email: string,
        public userID: string,
        private _token: string,
        private tokenExpiration: Date
    ){}

    get token(){
        if(!this.tokenExpiration || new Date() > this.tokenExpiration){
            return null;
        }
        return this._token;
    }
}