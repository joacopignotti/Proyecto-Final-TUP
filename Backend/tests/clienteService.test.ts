import { describe, expect, it } from "vitest";
import { clienteService } from "../services/clienteService";

describe("clienteService", () => {
    it("lista clientes paginados y permite buscar por DNI o nombre", () => {
    const res = clienteService.listar({ page: 1, limit: 5 });
    expect(res.data.length).toBeLessThanOrEqual(5);
    expect(res.meta.total).toBeGreaterThanOrEqual(12);

    const filtrado = clienteService.listar({ q: "30111222" });
    expect(filtrado.data.some((c) => c.dni === "30111222")).toBe(true);
    });

    it("crea, actualiza y elimina un cliente correctamente", () => {
    const creado = clienteService.crear({
        nombre: "Lucía",
        apellido: "Prueba",
        dni: "99888777",
        telefono: "291 4000000",
        email: "lucia.prueba@mail.com",
        activo: true,
        createdAt: new Date().toISOString(),
    });

    expect(creado.id).toBeDefined();
    expect(creado.dni).toBe("99888777");

    const actualizado = clienteService.actualizar(creado.id, { activo: false });
    expect(actualizado.activo).toBe(false);

    clienteService.eliminar(creado.id);
    expect(() => clienteService.obtener(creado.id)).toThrow("Cliente no encontrado");
    });

    it("rechaza crear un cliente con DNI duplicado", () => {
    expect(() =>
        clienteService.crear({
            nombre: "Duplicado",
            apellido: "Test",
            dni: "30111222",
            telefono: "291 4111111",
            email: "dup@mail.com",
            activo: true,
            createdAt: new Date().toISOString(),
        })
        ).toThrow("Ya existe un cliente registrado con el DNI 30111222");
    });
});