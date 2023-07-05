import AuthService from "../services/auth.service.js"

class AuthController {
    // constructor() {
    //     this.authService = new AuthService;
    //     this.signup = this.signup.bind(this); // use if export class not instance with new => route not require arrow function
    // }

    async signup(req, res) {
        try {
            const result = await AuthService.signup(req.body);
            return res.status(200).json({
                status: 200,
                data: result
            })
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error.message
            });
        }
    }

    async login(req, res) {
        try {
            const result = await AuthService.login(req.body);
            return res.status(200).json({
                status: 200,
                data: result
            })
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error.message
            });
        }
    }
}

export default new AuthController();