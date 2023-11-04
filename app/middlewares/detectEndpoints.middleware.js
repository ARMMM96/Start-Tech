const express = require("express");
const router = express.Router();
const Route = require("../database/models/route.model");
const listEndpoints = require("express-list-endpoints");

async function addRoutesToDatabase(req, res, next) {
  const routes = listEndpoints(req.app).map((route) => ({
    url: route.path,
    method: route.methods.join(","),
  }));

  await Route.deleteMany(); // remove all existing routes
  await Route.insertMany(routes); // add new routes

  next();
}

module.exports = addRoutesToDatabase;
