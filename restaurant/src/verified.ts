import {TOKEN_SECRET} from "./const/const";

const jwt = require('jsonwebtoken')
export default function auth(req, res, next) {
    const token = req.header('auth-token');

    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, TOKEN_SECRET)
        req.user = verified;
        next();
    } catch (e) {
        res.status(400).send('Invalid token');
    }
}
