## fix-feed-routes — Ajustes delete comment y update post

### Delete Comment

FastAPI solo permite al autor del comentario eliminarlo:
```python
if result.data["user_id"] != user_id:
    raise HTTPException(403, "No eres el autor de este comentario")
```

Hono actualmente permite también al autor del post. **Corregir**: solo el autor del comentario puede eliminar.

### Update Post

FastAPI valida que haya campos para actualizar:
```python
if not update_data:
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No hay campos para actualizar")
```

**Agregar**: si `updateData` está vacío después del filtro, retornar 400.

### Verificación

- Solo el autor del comentario puede eliminarlo (403 si otro usuario lo intenta)
- Update post con body vacío `{}` retorna 400
