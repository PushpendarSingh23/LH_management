const express = require("express");
const Booking = require("../models/Booking");
const SystemAdministrator = require("../models/systemAdministrator");

module.exports.getPendingRequests = async (req, res) => {
  try {
    const query = {
      $and: [{ systemAdministratorStatus: "pending" }, { avSupport: "yes" }],
    };
    const pendingRequests = await Booking.find(query);
    res
      .status(200)
      .json({
        message: "successfully fetched all pending requests",
        pendingRequests,
      });
  } catch (e) {
    res.status(500).json({ success: false, msg: "error " });
  }
};

module.exports.getApprovedRequests = async (req, res) => {
  try {
    const query = {
      $and: [{ systemAdministratorStatus: "approved" }, { avSupport: "yes" }],
    };
    const approvedRequests = await Booking.find(query);
    res
      .status(200)
      .json({
        message: "successfully fetched all pending requests",
        approvedRequests,
      });
  } catch (e) {
    res.status(500).json({ success: false, msg: "error " });
  }
};

module.exports.approveOrReject = async (req, res) => {
  try {
    const query = {
      $and: [{ systemAdministratorStatus: "pending" }, { avSupport: "yes" }],
    };
    const { id, action } = req.body;

    const booking = await Booking.findByIdAndUpdate(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (action === "approve") {
      booking.systemAdministratorStatus = "approved";
    } else if (action === "reject") {
      booking.systemAdministratorStatus = "rejected";
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    // Save the updated booking
    await booking.save();

    res.json({ message: `Booking ${action}d successfully`, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.getAllRequest = async (req, res) => {
  try {
    const query1 = {
      $and: [
        {
          $or: [
            { assistantRegistrarStatus: "pending" },
            { assistantRegistrarStatus: "approved" },
          ],
        },
        {
          $or: [{ facultyStatus: "pending" }, { facultyStatus: "approved" }],
        },
        {
          $and: [
            { avSupport: "yes" },
            {
              $or: [
                { systemAdministratorStatus: "pending" },
                // { systemAdministratorStatus: "approved" },
              ],
            },
          ],
        },
      ],
    };
    const query2 = {
      $and: [
        {
          $or: [
            { assistantRegistrarStatus: "pending" },
            { assistantRegistrarStatus: "approved" },
          ],
        },
        // { assistantRegistrarStatus: "approved" },
        {
          $or: [{ facultyStatus: "pending" }, { facultyStatus: "approved" }],
        },
        {
          $and: [
            { avSupport: "yes" },
            {
              $or: [
                { systemAdministratorStatus: "approved" },
                // { systemAdministratorStatus: "approved" },
              ],
            },
          ],
        },
      ],
    };
    const query3 = {
      $and: [
        {
          $or: [
            { assistantRegistrarStatus: "pending" },
            { assistantRegistrarStatus: "approved" },
          ],
        },
        // { assistantRegistrarStatus: "approved" },
        {
          $or: [{ facultyStatus: "pending" }, { facultyStatus: "approved" }],
        },
        {
          $and: [
            { avSupport: "yes" },
            {
              $or: [
                { systemAdministratorStatus: "rejected" },
                // { systemAdministratorStatus: "approved" },
              ],
            },
          ],
        },
      ],
    };
    const pendingRequests = await Booking.find(query1);
    const approvedRequests = await Booking.find(query2);
    const rejectedRequests = await Booking.find(query3);

    res.status(200).json({
      message: "successfully fetched all requests",
      pendingRequests,
      approvedRequests,
      rejectedRequests,
    });
  } catch (e) {
    res.status(500).json({ success: false, msg: "error " });
  }
};
