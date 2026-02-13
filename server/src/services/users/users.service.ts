// @ts-ignore
import HashService from "../HashService.ts";

class UserService {
    async getAllUsers() {
        return "all users";
    }

    async register(req : Request, res : Response){
        try {

        }
        catch (e) {
            console.log(e);
        }
    }
}

export default new UserService();
