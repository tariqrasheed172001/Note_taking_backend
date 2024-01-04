import express from 'express';
import jwtAuth from '../middlewares/chekAuth.js';
const router = express.Router();



import { RetrieveNotes, CreateNote, RetrieveNote, UpdateNote, DeleteNote, generateAuthToken} from "../controllers/data_controllers.js"

router.post("/create-note", jwtAuth, CreateNote);

router.get("/retrieve-notes", jwtAuth, RetrieveNotes);

router.get("/retrieve-note/:id", jwtAuth, RetrieveNote);

router.put("/update-note/:id", jwtAuth, UpdateNote);

router.delete("/delete-note/:id", jwtAuth, DeleteNote);


router.get("/generate-token",generateAuthToken);

export default router;