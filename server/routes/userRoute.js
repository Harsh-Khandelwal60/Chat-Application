
const register = require('../controllers/userController').register;

const router = require(`express`).Router();

router.post("/register", register); 

module.exports = router;