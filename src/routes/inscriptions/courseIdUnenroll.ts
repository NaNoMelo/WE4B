import { prisma } from "../..";
import { Route } from "../../route";

const courseIdUnenrollRoute: Route = {
  protected: true,
  route: "/courses/:id/unenroll",
  delete: async (req, res) => {
    try {
      await prisma.inscription.delete({
        where: {
          id: req.params.id,
          user_id: req.use,
        },
      });
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default courseIdUnenrollRoute
