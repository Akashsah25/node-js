import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ErrorHandler.js";
import { Apiresponse } from "../utils/ApiResponse.js";
import { Todo } from "../models/todo.model.js";

const createTodo = asyncHandler(async (req, resp) => {
  const { title, description = "" } = req.body;
  if (!title || title.trim() === "") {
    return resp.status(400).json(new ApiError(400, "title is required"));
  }

  const todo = await Todo.create({
    owner: req.user._id,
    title: title.trim(),
    description: typeof description === "string" ? description.trim() : "",
  });

  return resp.status(201).json(new Apiresponse(201, todo, "todo created"));
});

const listTodos = asyncHandler(async (req, resp) => {
  const { completed } = req.query;
  const filter = { owner: req.user._id };
  if (completed === "true") filter.completed = true;
  if (completed === "false") filter.completed = false;

  const todos = await Todo.find(filter).sort({ createdAt: -1 });
  return resp.status(200).json(new Apiresponse(200, todos, "todos fetched"));
});

const getTodoById = asyncHandler(async (req, resp) => {
  const todo = await Todo.findOne({ _id: req.params.id, owner: req.user._id });
  if (!todo) {
    return resp.status(404).json(new ApiError(404, "todo not found"));
  }
  return resp.status(200).json(new Apiresponse(200, todo, "todo fetched"));
});

const updateTodo = asyncHandler(async (req, resp) => {
  const { title, description, completed } = req.body;

  const update = {};
  if (typeof title === "string") update.title = title.trim();
  if (typeof description === "string") update.description = description.trim();
  if (typeof completed === "boolean") update.completed = completed;

  if (Object.keys(update).length === 0) {
    return resp.status(400).json(new ApiError(400, "no fields to update"));
  }

  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    { $set: update },
    { new: true }
  );

  if (!todo) {
    return resp.status(404).json(new ApiError(404, "todo not found"));
  }

  return resp.status(200).json(new Apiresponse(200, todo, "todo updated"));
});

const deleteTodo = asyncHandler(async (req, resp) => {
  const todo = await Todo.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
  });
  if (!todo) {
    return resp.status(404).json(new ApiError(404, "todo not found"));
  }
  return resp.status(200).json(new Apiresponse(200, null, "todo deleted"));
});

export { createTodo, listTodos, getTodoById, updateTodo, deleteTodo };

