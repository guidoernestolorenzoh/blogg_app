import { z } from "zod";

export const postSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio"),
  content: z.string().trim().min(100, "El contenido debe tener al menos 100 caracteres"),
  tags: z.array(z.string()).optional(),
  category: z.string().trim().min(1, "La categoría es obligatoria"),
});
