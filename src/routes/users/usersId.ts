import { Route } from "../../route";
import { prisma } from "../../index";

const usersIdRoute: Route = {
  protected: true,
  route: "/users/:id",
  get: async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        select: {
          id: true,
          email: true,
          name: true,
          first_name: true,
          roles: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  put: async (req, res) => {
    try {
      const { email, name, first_name, roles } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: req.params.id },
        data: {
          email,
          name,
          first_name,
          roles,
        },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  delete: async (req, res) => {
    try {
      await prisma.user.delete({
        where: { id: req.params.id },
      });

      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default usersIdRoute;
