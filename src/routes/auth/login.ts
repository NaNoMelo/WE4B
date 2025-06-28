import { Route } from "../../route";
import { prisma } from "../../index";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginRoute: Route = {
  protected: false,
  route: "/auth/login",
  post: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      // Find the user by email
      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      // Verify the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // Generate a JWT token (assuming you have a function to do this)
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1h",
        }
      );

      return res.status(200).json({
        message: "Login successful",
        token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          first_name: user.first_name,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: "Login Failed" });
    }
  },
};

export default loginRoute;
