import { Route } from "../../route";
import { prisma } from "../../index";
import { Prisma } from "@prisma/client";
import { hash } from "bcrypt";

const registerRoute: Route = {
  protected: false,
  route: "/auth/register",
  post: async (req, res) => {
    try {
      const { email, name, first_name, password } = req.body;

      if (!email || !name || !first_name || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Check if the user already exists
      const existingUser = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
      // Create a new user
      const hashedPassword = await hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email: email,
          name: name,
          first_name: first_name,
          password: hashedPassword,
        },
      });
      return res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          first_name: user.first_name,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default registerRoute;
