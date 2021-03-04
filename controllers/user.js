const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { jsonwebtokensecret } = require("../utils/config");

exports.signup = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = await bcrypt.hash(req.body.password, 12);
    const user = new User({
      email,
      password,
      activities: [],
    });
    await user.save();
    console.log("USER CREATED", user);
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

exports.logIn = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (user) {
      const password = await bcrypt.compare(req.body.password, user.password);
      if (password) {
        const token = jwt.sign(
          { email: user.email, userId: user._id },
          jsonwebtokensecret,
          { expiresIn: "1h" }
        );
        console.log("USER LOGGED IN!", user);
        return res.status(200).json({ message: "LOGGED IN!", user, token });
      } else {
        console.log("UNABLE TO LOGIN!");
        return res.status(400).json({ message: "USER NOT FOUNDED!" });
      }
    } else {
      console.log("UNABLE TO LOGIN!");
      return res.status(400).json({ message: "USER NOT FOUNDED!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

// ENDPOINT PROTETTI

exports.getActivities = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user) {
      console.log("USER ACTIVITIES", user.activities);
      return res.status(200).json({ activities: user.activities });
    }
    return res.status(400).json({ message: "USER NOT FOUND!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

exports.postActivities = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user) {
      const activity = {
        title: req.body.title,
        description: req.body.description,
      };
      user.activities.push(activity);
      await user.save();
      console.log("ACTIVITY INSERTED", activity);
      return res.status(200).json({ activity });
    }
    return res.status(400).json({ message: "USER NOT FOUND!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

exports.editActivity = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedTitle = req.body.title;
    const updatedDescription = req.body.description;

    const user = await User.findById(id);
    if (user) {
      const activityIndex = user.activities
        .map((activity) => {
          return activity._id;
        })
        .indexOf(req.params.activityId);
      user.activities[activityIndex].title = updatedTitle;
      user.activities[activityIndex].description = updatedDescription;

      await user.save();
      console.log("ACTIVITY UPDATED! YOUR ACTIVITIES", user.activities);
      res.status(200).json({
        updatedActivity: user.activities[activityIndex],
        activities: user.activities,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

exports.deleteActivity = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user) {
      const activityId = req.params.activityId;
      await user.activities.pull(activityId);
      await user.save();
      console.log("ACTIVITY REMOVED! YOUR ACTIVITIES", user.activities);
      return res.status(200).json({ activities: user.activities });
    }
    return res.status(400).json({ message: "USER NOT FOUND!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};