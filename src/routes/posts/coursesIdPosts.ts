import { Route } from "../../route";
import { prisma } from "../../index";

const coursesIdPostsRoute: Route = {
  protected: true,
  route: "/courses/:id/posts",
  get: async (req, res) => {
    try {
      const posts = await prisma.post.findMany({
        where: { course_id: req.params.id },
        select: {
          id: true,
          title: true,
          description: true,
          date_time: true,
          pinned: true,
          importance: true,
          author_id: true,
          course_id: true,
        },
      });

      return res.status(200).json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  post: async (req, res) => {
    try {
      const { title, description, date_time, pinned, importance, author_id } =
        req.body;

      const newPost = await prisma.post.create({
        data: {
          title,
          description,
          date_time,
          pinned,
          importance,
          author_id,
          course_id: req.params.id,
        },
      });

      return res.status(201).json(newPost);
    } catch (error) {
      console.error("Error creating post:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default coursesIdPostsRoute;
