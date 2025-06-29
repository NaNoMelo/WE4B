import { Route } from "../../route";
import { prisma } from "../../index";

const coursesRoute: Route = {
  protected: true,
  route: "/courses",
  get: async (req, res) => {
    try {
      const courses = await prisma.course.findMany({
        select: {
          id: true,
          code: true,
          name: true,
          description: true,
          creation_date: true,
          user_responsible_id: true,
        },
      });

      return res.status(200).json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  post: async (req, res) => {
    try {
      const { code, name, description, user_responsible_id } = req.body;

      const newCourse = await prisma.course.create({
        data: {
          code,
          name,
          description,
          user_responsible_id,
        },
      });

      return res.status(201).json(newCourse);
    } catch (error) {
      console.error("Error creating course:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default coursesRoute;
