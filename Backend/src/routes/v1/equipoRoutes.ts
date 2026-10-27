import { equipoController } from "../../controllers/equipoController";
import { createCrudRouter } from "../../utils/crudRouter";

// GET /, GET /:id, POST /, PUT|PATCH /:id y DELETE /:id.
// Las rutas propias de Equipos se agregan sobre este router.
const router = createCrudRouter(equipoController);

export default router;
