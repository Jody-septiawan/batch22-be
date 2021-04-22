const express = require("express");

const router = express.Router();

const { auth } = require('../middlewares/auth');
const { uploadFile } = require('../middlewares/uploadFile');

const {
    getTodos,
    addTodo,
    updateTodo,
    deleteTodo } = require('../controllers/todos');

const { regitrasi, login } = require('../controllers/auth');

const { getUsers, updateUser } = require('../controllers/user');

router.post("/register", regitrasi);
router.post("/login", login);

router.get("/users", auth, getUsers);
router.patch("/user", auth, uploadFile("imageFile"), updateUser);

router.get("/todos", getTodos);
router.post("/todo", addTodo);
router.patch("/todo/:id", updateTodo);
router.delete("/todo/:id", deleteTodo);

module.exports = router;