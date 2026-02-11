const express = require("express");
const Booking = require("../models/Booking");

module.exports.getApprovedRequests = async (req, res) => {
  try {
    const query = {
      $and: [
        { assistantRegistrarStatus: "approved" },
        { facultyStatus: "approved" },
        {
          $or: [
            { avSupport: "no" }, // When avSupport is 'no', systemAdministratorStatus won't be considered
            {
              avSupport: "yes",
              systemAdministratorStatus: "approved",
            },
          ],
        },
      ],
    };
    const approvedRequests = await Booking.find(query);
    res
      .status(200)
      .json({
        message: "successfully fetched all approved requests",
        approvedRequests,
      });
    // console.log(approvedRequests);
  } catch (e) {
    res.status(500).json({ success: false, msg: "error " });
  }
};
