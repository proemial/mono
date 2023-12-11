import { authMiddleware } from "./utils/middleware/authMiddleware";
import { MiddlewareStack } from "./utils/middleware/middleware";

const middlewares = [authMiddleware];

export default MiddlewareStack(middlewares);
