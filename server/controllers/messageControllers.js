const Messages = require("../models/messegeModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};
module.exports.getAllMessage = async (req, res) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        createdAt: msg.createdAt,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUnreadMsgs = async (req, res) => {
  try {
    const { user } = req.body;
    const data = await Messages.find();
    console.log(user);
    let filterData = data.filter(
      (item) => (item.users[1] == user && item.isRead === false)
    );
    res.send(filterData);
  } catch (error) {}
};

module.exports.updateMsgStatus = async (req, res) => {
  try {
    const { from, to } = req.body;
    console.log(req.body, "body");
    let data = await Messages.updateMany(
      {
        users: {
          $all: [from, to],
        },
      },
      { $set: { isRead: true } }
    );

    data && res.json("success");
  } catch (error) {}
};

// module.exports.incomingMsgs = async (req, res) => {
//   try {
//     const {from  } = req.body;
//     const {to  } = req.body;
//     const data = await Messages.find()
//     if (data) return res.json({ status:true, msg: "success." });
//   } catch (ex) {
//     next(ex);
//   }
// };

// module.exports.incomingMsgsUpdate = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const data = await User.findByIdAndUpdate(
//       id,
//      req.body,
//       { new: true }
//     );
//     if (data) return res.json({ status:true, msg: "success." });
//   } catch (ex) {
//     next(ex);
//   }
// };
// module.exports.getincomingMsgs = async (req, res) => {
//   try {
//     const messages = await Messages.find({
//       users: {
//         $all: [from, to],
//       },
//     })
//     if (data) return res.json({ status:true, msg: "success." });
//   } catch (ex) {
//     next(ex);
//   }
// };
