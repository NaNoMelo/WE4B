import { PrismaClient } from "@prisma/client";
import express, { Request, Response, NextFunction, RequestHandler } from "express";
import cors from "cors";
import { glob } from "fs/promises";
import { Route } from "./route";
import jwt from "jsonwebtoken";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*", // Allow all origins
  })
);

export const prisma = new PrismaClient({
  log: ["query"],
});

const verifyToken = (req: any, res: any, next: any) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

async function main() {
  const routes = glob(process.cwd() + "/src/routes/**/*.ts");

  for await (const file of routes) {
    console.log(`Loading route from file: ${file}`);
    import(file).then((module) => {
      if (!module.default) {
        console.error(`No default export found in ${file}`);
        return;
      }
      const route: Route = module.default;

      const methods: (keyof Pick<Route, "get" | "post" | "put" | "delete">)[] =
        ["get", "post", "put", "delete"];

      methods.forEach((method) => {
        const handler = route[method];
        if (handler) {
          console.log(
            `Registering ${method.toUpperCase()} route: ${route.route}`
          );
          if (route.protected) {
            app[method](route.route, verifyToken, handler);
          } else {
            app[method](route.route, handler);
          }
        }
      });
    });
  }

  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
