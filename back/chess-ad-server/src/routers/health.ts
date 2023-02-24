import { Router } from "express";

const hRouter = Router();

hRouter.get('/h', (req, res) => {
    res.send('1... d6');
})

export { hRouter };