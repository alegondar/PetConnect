import api from "../client";

export const veterinariasApi = {
  getVeterinarias: (zona?: string) =>
    api.get("/veterinarias", { params: zona ? { zona } : undefined }),
};
