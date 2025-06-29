import { Route } from "../../route";
import { prisma } from "../../index";

const filesRoute: Route = {
  protected: true,
  route: "/files",
  post: async (req, res) => {
    try {
      const { name, extension, file_data } = req.body;

      const newFile = await prisma.file.create({
        data: {
            name,
            extension,
            file: Buffer.from(file_data, 'base64'), // Assuming file_data is base64 encoded
        },
      });

      return res.status(201).json(newFile);
    } catch (error) {
      console.error("Error uploading file:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default filesRoute;
