import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  listTodos,
  updateTodo,
} from "../controllers/todo.controller.js";

const todoRouter = Router();

todoRouter.use(verifyJWT);

todoRouter.route("/").post(createTodo).get(listTodos);
todoRouter.route("/:id").get(getTodoById).patch(updateTodo).delete(deleteTodo);

export default todoRouter;

