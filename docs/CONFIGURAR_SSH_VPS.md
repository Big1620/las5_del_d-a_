# Configurar SSH para el VPS - Las 5 del día

Guía para conectarte a tu VPS (82.112.247.240) por SSH y configurar acceso sin contraseña.

---

## Paso 1: Comprobar si ya tienes clave SSH

Abre una terminal y ejecuta:

```bash
ls -la ~/.ssh/
```

Si ves archivos como `id_rsa` y `id_rsa.pub`, o `id_ed25519` y `id_ed25519.pub`, ya tienes una clave. Pasa al **Paso 3**.

Si no existe la carpeta o está vacía, continúa con el Paso 2.

---

## Paso 2: Crear una clave SSH (si no la tienes)

```bash
ssh-keygen -t ed25519 -C "las5deldia-vps"
```

Te preguntará:
- **Archivo donde guardar:** pulsa Enter (usa la ruta por defecto `~/.ssh/id_ed25519`)
- **Frase de contraseña:** opcional. Si la pones, tendrás que escribirla cada vez que uses la clave. Puedes dejarla vacía para el script de deploy.

---

## Paso 3: Conectarte al VPS (primera vez)

Necesitas algún tipo de acceso inicial. Suele ser:

### Si tienes usuario y contraseña

**Si SSH usa el puerto 22 (por defecto):**
```bash
ssh root@82.112.247.240
```

**Si SSH usa otro puerto (ej. 65002):**
```bash
ssh -p 65002 root@82.112.247.240
```

Te pedirá la contraseña del usuario `root`. Introdúcela.

### Si tu proveedor te dio otra forma de acceso

- **Panel web:** algunos VPS (Hetzner, DigitalOcean, etc.) tienen consola en el navegador
- **Clave proporcionada:** si te dieron un archivo `.pem` o similar:
  ```bash
  ssh -i /ruta/al/archivo.pem root@82.112.247.240
  ```

### Si no recuerdas la contraseña

Revisa el email de tu proveedor (Hetzner, OVH, etc.) o en el panel de control busca "contraseña root" o "reset password".

---

## Paso 4: Copiar tu clave pública al VPS

Cuando ya estés conectado al VPS (o desde otra terminal con acceso), ejecuta **en tu máquina local**:

**Puerto 22:**
```bash
ssh-copy-id root@82.112.247.240
```

**Puerto personalizado (ej. 65002):**
```bash
ssh-copy-id -p 65002 root@82.112.247.240
```

Te pedirá la contraseña del VPS **una última vez**. Después, no volverás a necesitarla para SSH.

**Alternativa manual** (si `ssh-copy-id` no funciona):

```bash
# En tu máquina local - mostrar tu clave pública
cat ~/.ssh/id_ed25519.pub

# Copia toda la línea que empieza con "ssh-ed25519 ..."

# Conéctate al VPS
ssh root@82.112.247.240

# En el VPS, crea la carpeta y pega la clave
mkdir -p ~/.ssh
echo "PEGA_AQUI_TU_CLAVE_PUBLICA" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
exit
```

---

## Paso 5: Probar la conexión sin contraseña

```bash
ssh root@82.112.247.240
```

Deberías entrar **sin que te pida contraseña**. Si funciona, ya tienes SSH configurado.

---

## Paso 6 (opcional): Configurar alias en ~/.ssh/config

Para no escribir la IP y el puerto cada vez, edita `~/.ssh/config`:

```bash
nano ~/.ssh/config
```

Añade (usa `Port 65002` si tu SSH no está en el 22):

```
Host las5vps
    HostName 82.112.247.240
    User root
    Port 65002
```

Guarda (Ctrl+O, Enter, Ctrl+X). A partir de entonces puedes conectarte con:

```bash
ssh las5vps
```

---

## Resumen rápido

| Paso | Comando |
|------|---------|
| 1 | `ls ~/.ssh/` → ¿hay `id_ed25519.pub` o `id_rsa.pub`? |
| 2 | Si no: `ssh-keygen -t ed25519 -C "las5deldia"` |
| 3 | `ssh root@82.112.247.240` (con contraseña) |
| 4 | `ssh-copy-id root@82.112.247.240` |
| 5 | `ssh root@82.112.247.240` (sin contraseña) ✓ |

---

## Problemas frecuentes

### "Connection refused" o "Connection timed out"
- El VPS puede estar apagado o el firewall bloqueando el puerto 22
- Revisa en el panel de tu proveedor que el servidor esté encendido

### "Permission denied (publickey,password)"
- La contraseña es incorrecta
- O no se ha copiado bien la clave con `ssh-copy-id`

### ¿Qué usuario usar: root u otro?
- Muchos VPS empiezan con `root`
- Si creaste un usuario (ej. `deploy`), usa: `ssh deploy@82.112.247.240`
- El script de deploy usa `root` por defecto; si usas otro usuario: `./scripts/deploy-to-vps.sh deploy@82.112.247.240`
- El script usa el puerto **65002** por defecto para SSH. Si usas el 22: `SSH_PORT=22 ./scripts/deploy-to-vps.sh`
