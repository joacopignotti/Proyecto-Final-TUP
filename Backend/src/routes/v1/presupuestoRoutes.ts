import { presupuestoController } from "../../controllers/presupuestoController";
import { createCrudRouter } from "../../utils/crudRouter";

// GET /, GET /:id, POST /, PUT|PATCH /:id y DELETE /:id.
// Las rutas propias de Presupuestos se agregan sobre este router.
const router = createCrudRouter(presupuestoController);

export default router;
