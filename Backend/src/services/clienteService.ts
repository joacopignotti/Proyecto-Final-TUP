import { Cliente } from "../models/Cliente";
import { clienteRepository } from "../repositories/clienteRepository";
import { createCrudService, CrudService } from "../utils/crudService";
import { HttpError } from "../utils/httpError";

const base = createCrudService(clienteRepository, "Cliente");

const validarDniUnico = (dni: string, idExcluir?: number) => {
    const dniNormalizado = dni.trim();
    const { data } = clienteRepository.list({
        page: 1,
        limit: 10,
        order: "asc",
        filters: { dni: dniNormalizado },
    });
    const existente = data.find((c) => c.id !== idExcluir);
    if (existente) {
        throw new HttpError(409, `Ya existe un cliente registrado con el DNI ${dniNormalizado}`);
    }
};

export const clienteService: CrudService<Cliente> = {
    ...base,
    crear: (data) => {
    validarDniUnico(data.dni);
    return base.crear({
        ...data,
        nombre: data.nombre.trim(),
        apellido: data.apellido.trim(),
        dni: data.dni.trim(),
        telefono: data.telefono.trim(),
        email: data.email.trim(),
    });
    },
    actualizar: (id, data) => {
        base.obtener(id);
        if (data.dni !== undefined) {
        validarDniUnico(data.dni, id);
    }
    return base.actualizar(id, {
        ...data,
        ...(data.nombre !== undefined && { nombre: data.nombre.trim() }),
        ...(data.apellido !== undefined && { apellido: data.apellido.trim() }),
        ...(data.dni !== undefined && { dni: data.dni.trim() }),
        ...(data.telefono !== undefined && { telefono: data.telefono.trim() }),
        ...(data.email !== undefined && { email: data.email.trim() }),
        });
    },
};