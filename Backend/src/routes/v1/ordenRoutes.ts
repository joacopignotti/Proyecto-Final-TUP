import { ordenController } from "../../controllers/ordenController";
import { createCrudRouter } from "../../utils/crudRouter";

// GET /, GET /:id, POST /, PUT|PATCH /:id y DELETE /:id.
// Las rutas propias de Órdenes se agregan sobre este router.
const router = createCrudRouter(ordenController);

export default router;
