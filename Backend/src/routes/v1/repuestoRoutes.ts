import { repuestoController } from "../../controllers/repuestoController";
import { createCrudRouter } from "../../utils/crudRouter";

// GET /, GET /:id, POST /, PUT|PATCH /:id y DELETE /:id.
// Las rutas propias de Repuestos se agregan sobre este router.
const router = createCrudRouter(repuestoController);

export default router;
