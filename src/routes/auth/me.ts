import { Route } from "../../route";
import { prisma } from "../../index";

const meRoute: Route = {
  protected: true,
  route: "/auth/me",
  get: async (req, res) => {
    try {
      const userId = req.user.id; // Assuming req.user is set by authentication middleware

      // Fetch the user from the database
      const user = await prisma.user.findUnique({
        where: { id: userId },
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
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default meRoute;