import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRating from "../models/UserRating.js";

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "email"],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const getRating = async (req, res) => {
  const {
    rating1,
    rating2,
    rating3,
    rating4,
    rating5,
    rating6,
    feedback,
    userId,
  } = req.body;

  try {
    // Create a new user rating entry in the database
    await UserRating.create({
      userId: userId,
      rating1: rating1,
      rating2: rating2,
      rating3: rating3,
      rating4: rating4,
      rating5: rating5,
      rating6: rating6,
      feedback: feedback,
    });

    res.json({ message: "User rating and feedback submitted successfully" });
  } catch (error) {
    console.error("Error submitting user rating and feedback", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRatingResult = async (req, res) => {
  try {
    const userRatings = await UserRating.findAll({
      attributes: [
        "userId",
        "feedback",
        "rating1",
        "rating2",
        "rating3",
        "rating4",
        "rating5",
        "rating6",
      ],
    });
    res.json(userRatings);
  } catch (error) {
    console.error("Error fetching user ratings:", error);
    return null; // Return null if an error occurs
  }
};

export const Logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.sendStatus(204);
    }

    const user = await Users.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user) {
      return res.sendStatus(204);
    }

    await Users.update(
      { refresh_token: null },
      {
        where: {
          id: user.id,
        },
      }
    );

    res.clearCookie("refreshToken");
    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    let role = user.role;
    let name = user.name;
    if (role !== "user" && role !== "admin") {
      role = "user"; // Default to "user" role if not "user" or "admin"
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: role, name: name },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "24h",
      }
    );
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: user.id,
        },
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    res.json({ accessToken, role, name }); // Include the user's role in the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const Register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password and Confirm Password do not match" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
    });
    res.json({ msg: "Registration Successful" });
  } catch (error) {
    console.log(error);
  }
};

export const getUserRole = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming you set userId in the token payload

    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const role = user.role;
    res.json({ role });
  } catch (error) {
    console.error("Error fetching user role:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
