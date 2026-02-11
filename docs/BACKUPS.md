# 💾 Estrategia de Backups - Las 5 del día

Este proyecto es un **frontend headless** que consume datos de WordPress. La estrategia de backups se centra en:

1. **Código** – Git
2. **Datos** – WordPress (CMS)
3. **Configuración** – Variables de entorno, secrets

---

## 1. Código fuente

- **Git**: Todo el código está en control de versiones
- **Recomendación**: Repositorio remoto (GitHub, GitLab, etc.) con ramas protegidas
- Backup adicional: mirror o export periódico del repo

```bash
git push origin main
```

---

## 2. WordPress (fuente de datos)

El contenido (posts, categorías, autores, etc.) vive en **WordPress**. Debes tener:

- **Backup de base de datos**: mysqldump o plugin (UpdraftPlus, BackWPup, etc.)
- **Backup de medios**: `/wp-content/uploads/`
- **Frecuencia**: Diario o según volumen de publicaciones

---

## 3. Variables de entorno

- No versionar `.env` ni `.env.production` (secretos)
- Mantener copia segura en gestor de secretos (1Password, Vault, AWS Secrets Manager)
- Documentar variables en `.env.production.example` (sin valores reales)

---

## 4. Build y artefactos

- El build (`npm run build`) se regenera desde el código
- En CI/CD: artefactos opcionales para rollback rápido
- No es crítico hacer backup de `.next/` si el build es reproducible

---

## 5. Checklist rápido

| Elemento | Dónde | Frecuencia |
|----------|--------|------------|
| Código | Git remoto | En cada push |
| WordPress DB | Backup automático | Diario |
| WordPress uploads | Backup automático | Semanal |
| Secrets | Gestor de secretos | Tras cambios |

---

## 6. Recuperación ante fallos

1. **Frontend caído**: Redeploy desde Git (Vercel, Netlify, Docker)
2. **WordPress caído**: Restaurar DB y uploads desde backup
3. **Secrets comprometidos**: Rotar en gestor de secretos y redeploy
