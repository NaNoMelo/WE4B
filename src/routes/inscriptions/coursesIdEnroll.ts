import { Route } from "../../route";
import { prisma } from "../../index";

const coursesIdEnrollRoute: Route = {
  protected: true,
  route: "/courses/:id/enroll",
  post: async (req, res) => {
    try {

      // Check if the course exists
      const course = await prisma.course.findUnique({
        where: { id: req.params.id },
      });

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      // Check if the user is already enrolled
      const existingInscription = await prisma.inscription.findFirst({
        where: {
          course_id: req.params.id,
          user_id: req.user,
        },
      });

      if (existingInscription) {
        return res.status(400).json({ error: "User already enrolled in this course" });
      }

      // Create a new enrollment
      const newInscription = await prisma.inscription.create({
        data: {
          course_id: req.params.id,
          user_id: req.user,
        },
      });

      return res.status(201).json(newInscription);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default coursesIdEnrollRoute;
