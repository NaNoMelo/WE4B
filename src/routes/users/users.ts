import { Route } from "../../route";
import { prisma } from "../../index";

const usersRoute: Route = {
  protected: true,
  route: "/users",
  get: async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          first_name: true,
          roles: true,
        },
      });

      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default usersRoute;
