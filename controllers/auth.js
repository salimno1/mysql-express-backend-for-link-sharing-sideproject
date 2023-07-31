import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  //checkuser

  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("user exist");
    const salt = bcrypt.genSaltSync(10);
    const hashedP = bcrypt.hashSync(req.body.password, salt);

    const query =
      "INSERT INTO users (`username`, `email`, `password`, `name`) VALUE (?)";
    const values = [req.body.username, req.body.email, hashedP, req.body.name];

    db.query(query, [values], (err, data) => {
      if (err) return res.status(500).json("slimm");
      return res.status(200).json("user has been created");
    });

    // create new
  });
};

export const login = (req, res) => {
  const query = "SELECT * FROM users WHERE username = ?";

  db.query(query, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.lenght === 0) return res.status(404).json("User not found");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!checkPassword) return res.status(400).json("wrong password");
    const token = jwt.sign({ id: data[0].id }, "secretkey");
    const { password, ...other } = data[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(other);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", { secure: true, sameSite: "none" })
    .status(200)
    .json("user loggedout");
};
