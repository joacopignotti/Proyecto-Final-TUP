import { clienteController } from "../../controllers/clienteController";
import { createCrudRouter } from "../../utils/crudRouter";

// GET /, GET /:id, POST /, PUT|PATCH /:id y DELETE /:id.
// Las rutas propias de Clientes se agregan sobre este router.
const router = createCrudRouter(clienteController);

export default router;
