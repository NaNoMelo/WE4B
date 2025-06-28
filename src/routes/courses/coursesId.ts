import { Route } from "../../route";
import { prisma } from "../../index";

const coursesIdRoute: Route = {
  protected: true,
  route: "/courses/:id",
  get: async (req, res) => {
    try {
      const course = await prisma.course.findUnique({
        where: { id: req.params.id },
        select: {
          id: true,
          code: true,
          name: true,
          description: true,
          creation_date: true,
          user_responsible_id: true,
        },
      });

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      return res.status(200).json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  put: async (req, res) => {
    try {
      const { code, name, description, user_responsible_id } = req.body;

      const updatedCourse = await prisma.course.update({
        where: { id: req.params.id },
        data: {
          code,
          name,
          description,
          user_responsible_id,
        },
      });

      return res.status(200).json(updatedCourse);
    } catch (error) {
      console.error("Error updating course:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  delete: async (req, res) => {
    try {
      await prisma.course.delete({
        where: { id: req.params.id },
      });

      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting course:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default coursesIdRoute;
