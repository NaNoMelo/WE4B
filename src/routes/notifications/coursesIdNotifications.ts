import { Route } from "../../route";
import { prisma } from "../../index";

const coursesIdNotifications: Route = {
  protected: true,
  route: "/courses/:id/notifications",
  get: async (req, res) => {
    try {
      const notifications = await prisma.notification.findMany({
        where: { course_id: req.params.id },
        select: {
          id: true,
          title: true,
          description: true,
          date_time: true,
          user_id: true,
          course_id: true,
        },
      });

      return res.status(200).json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  post: async (req, res) => {
    try {
      const { title, description, date_time, user_id } = req.body;

      const newNotification = await prisma.notification.create({
        data: {
          title,
          description,
          date_time,
          user_id,
          course_id: req.params.id,
        },
      });

      return res.status(201).json(newNotification);
    } catch (error) {
      console.error("Error creating notification:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default coursesIdNotifications;
