import { Route } from "../route";
const helloWorldRoute: Route = {
  protected: false,
  route: "/hello-world",
  get: async (req, res) => {
    res.status(200).json({ message: "Hello, World!" });
  },
};

export default helloWorldRoute;
