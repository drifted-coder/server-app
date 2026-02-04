const { Ticket } = require("../models");
const mongoose = require("mongoose");

exports.agentDashboard = async (req,res,next)=>{

  try {

    const userId =
      new mongoose.Types.ObjectId(req.user.id);

    const statusCounts =
      await Ticket.aggregate([
        { $match: { deletedAt:null } },
        { $group:{
            _id:"$status",
            count:{ $sum:1 }
        }}
      ]);

    const assignedTickets =
      await Ticket.find({
        assignedTo:userId,
        status:{ $ne:"Closed" }
      }).limit(5);

    const last7Days =
      await Ticket.countDocuments({
        createdAt:{
          $gte:new Date(
            Date.now()-7*24*60*60*1000
          )
        }
      });

    res.json({
      statusCounts,
      assignedTickets,
      last7Days
    });

  } catch(err){ next(err); }
};

exports.userDashboard = async (req,res,next)=>{

  try {

    const userId =
      new mongoose.Types.ObjectId(req.user.id);

    const statusCounts =
      await Ticket.aggregate([
        { $match:{ createdBy:userId }},
        { $group:{
            _id:"$status",
            count:{ $sum:1 }
        }}
      ]);

    const recentTickets =
      await Ticket.find({
        createdBy:userId
      })
      .sort({ createdAt:-1 })
      .limit(5);

    res.json({
      statusCounts,
      recentTickets
    });

  } catch(err){ next(err); }
};
