import Client from "../models/client.js";
import Project from "../models/project.js";
import asyncHandler from "express-async-handler";
import User from "../models/user.js";
import { AccessControl } from "accesscontrol";
import { grantsObject } from "../utils/permissions.js";
import mongoose from "mongoose";
import capitalize from "../utils/capitalize.js";
import { uniqueFinder } from "../utils/uniqueEntry.js";

const ac = new AccessControl(grantsObject);

/* -------------------------------------------------------------------------- */

// @desc    Create a new client
// @route   POST /client
// @access  Private

const createClient = asyncHandler(async (req, res) => {
  const permission = ac.can(req.user.role).createOwn("client");
  if (permission.granted) {
    try {
      let { name } = req.body;
      name = capitalize(name);
      const uni = await uniqueFinder(name, Client);
      if (!uni) {
        throw new Error(`Client already exists.`);
      }
      const manager = req.user;
      const client = new Client({ name });

      if (!client) throw new Error("Error creating a new client");

      client.createdBy = manager._id;
      await client.save();

      manager.clients.push(client);
      await manager.save();

      res.status(201).json({
        status: "Successfully Created Client",
        data: client,
      });
    } catch (error) {
      throw new Error(error);
    }
  } else {
    // resource is forbidden for this user/role
    res.status(403).end("UnAuthorized");
  }
});

// @desc    Get client
// @route   GET /client/getClient
// @access  Private

const getClient = asyncHandler(async (req, res) => {
  const permission = ac.can(req.user.role).readOwn("client", ["*"]);

  if (permission.granted) {
    try {
      console.log(req.body);
      const user = await User.findById(req.user._id);
      let client;
      if (user.role !== "admin") {
        client = await Client.find({ manager: req.user._id }).populate([
          {
            path: "projects",
            match: {
              _id: {
                $in: user.projects,
              },
            },
            populate: [
              {
                path: "employees",
                select: [
                  "firstName",
                  "lastName",
                  "days",
                  "email",
                  "projects",
                  "role",
                ],
                populate: {
                  path: "projects",
                  model: "Project",
                  select: ["name", "budgetTime"],
                },
              },
              {
                path: "projectLeader",
                select: ["firstName", "lastName", "email"],
              },
              { path: "createdBy", select: ["firstName", "lastName"] },
            ],
          },
          { path: "createdBy", select: ["firstName", "lastName"] },
        ]);
      }

      if (user.role === "projectLeader") {
        let clientsList = await Project.aggregate([
          {
            $match: {
              projectLeader: req.user._id,
            },
          },
          {
            $group: {
              _id: null,
              clients: {
                $addToSet: "$client",
              },
            },
          },
        ]);
        console.log(clientsList);
        let clientsArr = clientsList[0] ? clientsList[0].clients : [];
        client = await Client.find({
          _id: { $in: clientsArr },
        }).populate([
          {
            path: "projects",
            match: { projectLeader: user._id },
            populate: [
              {
                path: "employees",
                select: ["firstName", "lastName", "email", "projects", "role"],
                populate: {
                  path: "projects",
                  model: "Project",
                  select: ["name", "budgetTime"],
                },
              },
              {
                path: "projectLeader",
                select: ["firstName", "lastName", "email"],
              },
              { path: "createdBy", select: ["firstName", "lastName"] },
            ],
          },
          { path: "createdBy", select: ["firstName", "lastName"] },
        ]);
      } else {
        client = await Client.find({ manager: req.user._id }).populate([
          {
            path: "projects",
            populate: [
              {
                path: "employees",
                select: [
                  "firstName",
                  "lastName",
                  "days",
                  "email",
                  "projects",
                  "role",
                ],
                populate: {
                  path: "projects",
                  model: "Project",
                  select: ["name", "budgetTime"],
                },
              },
              {
                path: "projectLeader",
                select: ["firstName", "lastName", "email"],
              },
              { path: "createdBy", select: ["firstName", "lastName"] },
            ],
          },
          { path: "createdBy", select: ["firstName", "lastName"] },
        ]);
      }

      if (!client) {
        res.status(404);
        throw new Error("No clients found");
      }

      res.status(200).json({
        status: "Client fetched succesfully",
        data: client,
      });
    } catch (error) {
      throw new Error(error);
    }
  } else {
    // resource is forbidden for this user/role
    res.status(403).end("UnAuthorized");
  }
});

// @desc    Get client by id
// @route   GET /client/:id
// @access  Private

const getClientById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const client = await Client.findById(id).populate("projects");
  try {
    if (!client) {
      res.status(404);
      throw new Error("Client not found");
    }
    res.status(200).json({
      status: "Client fetched succesfully",
      data: client,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// @desc    Edit client
// @route   PATCH /client/:id
// @access  Private

const editClient = asyncHandler(async (req, res) => {
  const permission = ac.can(req.user.role).updateAny("client");
  if (permission.granted) {
    try {
      const uni = await uniqueFinder(req.body.name, Client);
      if (!uni) {
        throw new Error("Client with same name exists.");
      }
      const client = await Client.findByIdAndUpdate(req.params.id, req.body);

      if (!client) {
        res.status(404);
        throw new Error("Client not found");
      }

      res.status(200).json({
        status: "Successfully Updated Client",
        data: client,
      });
    } catch (error) {
      throw new Error(error);
    }
  } else {
    // resource is forbidden for this user/role
    res.status(403).end("UnAuthorized");
  }
});

// @desc    Delete client
// @route   DELETE /client/:id
// @access  Private

const deleteClient = asyncHandler(async (req, res) => {
  const permission = ac.can(req.user.role).deleteOwn("client");
  if (permission.granted) {
    const clientId = req.params.id;
    try {
      /* ---------------------------- // finding Client ---------------------------- */
      const client = await Client.findById(clientId);

      if (!client) {
        res.status(404);
        throw new Error("Client not found");
      }

      const userId = client.createdBy;

      /* ------------------ finding user to delete client in that ----------------- */

      const user = await User.findById(userId);

      if (user) {
        //   user.clients.forEach((client, index) => {
        //     if (client.toHexString() == clientId) {
        //       user.clients.splice(index, 1);
        //     }
        //   });
        user.clients = user.clients.filter(
          (_id) => _id.toHexString() !== clientId
        );
        await user.save();
      }

      /* ------------------------ deleting projects in user ------------------------ */
      // taking projects from deleting client and deleting the projects and project field from their respective members

      for (let i = 0; i < client.projects.length; i++) {
        const projectId = client.projects[i];
        const project = await Project.findById(projectId);

        for (let j = 0; j < project.employees.length; j++) {
          // Deleting projects reference from the emoployee
          const employeeId = project.employees[j];
          const employee = await User.findById(employeeId);

          if (employee) {
            // employee.projects.forEach((project, index) => {
            //   if (project.toHexString() === projectId.toHexString()) {
            //     employee.projects.splice(index, 1);
            //   }
            // });
            employee.projects = employee.projects.filter(
              (_id) => _id.toHexString() !== projectId
            );
            await employee.save();
          }
        }
        // Deleting Project
        await Project.findByIdAndRemove(projectId);
      }

      /* --------------------------- deleting the client -------------------------- */

      await Client.findByIdAndRemove(clientId);

      /* ---------------------------- Sending response ---------------------------- */

      res.status(202).json({
        status: "Successfully Deleted Client",
        data: client,
      });
    } catch (error) {
      throw new Error(error);
    }
  } else {
    // resource is forbidden for this user/role
    res.status(403).end("UnAuthorized");
  }
});

export { createClient, deleteClient, editClient, getClient, getClientById };
