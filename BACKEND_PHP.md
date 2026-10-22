# Contrato para el backend PHP

El frontend de la revista vive en React/Vite y el backend se desarrolla y despliega por separado. Configura `VITE_API_BASE_URL` en `.env.local` con la URL base de la API, incluyendo `/api/v1`, por ejemplo `http://localhost:8000/api/v1`. En producción debe ser una URL HTTPS.

## Rutas que consume el frontend

Todas las respuestas correctas deben ser JSON con este envoltorio:

```json
{ "data": {} }
```

Los errores deben usar un estado HTTP adecuado y devolver un mensaje legible:

```json
{ "error": "Credenciales no válidas" }
```

| Método | Ruta | Acceso | Resultado |
| --- | --- | --- | --- |
| `POST` | `/auth/login` | Público | Valida las credenciales y devuelve `data.token` y `data.user`. |
| `GET` | `/auth/me` | Bearer | Devuelve `data.user` para validar y restaurar una sesión. |
| `POST` | `/auth/logout` | Bearer | Invalida el token y devuelve `{ "data": null }`. |
| `GET` | `/articles?status=published` | Público | Devuelve artículos publicados de todas las secciones, ordenados por fecha descendente. |
| `GET` | `/articles/mine` | Bearer | Devuelve todas las publicaciones del usuario autenticado, también borradores si se implementan. |
| `POST` | `/articles` | Bearer | Valida y publica una entrada en la sección elegida; devuelve `data.article`. |
| `PUT` | `/articles/{id}` | Bearer | Actualiza una entrada propia, incluida la sección; devuelve `data.article`. |
| `DELETE` | `/articles/{id}` | Bearer | Elimina una entrada propia y devuelve `{ "data": null }`. |
| `GET` | `/site-config` | Público | Devuelve `data.config`, la configuración visual publicada. |
| `PUT` | `/site-config` | Solo administrador | Valida y guarda la configuración de tema, textos, imágenes y módulos; devuelve `data.config`. |

Ejemplo de inicio de sesión:

```json
// POST /auth/login
{ "email": "redaccion@centro.es", "password": "..." }

// 200
{
  "data": {
    "token": "token-aleatorio-de-sesion",
    "user": { "id": "1", "name": "Redacción", "email": "redaccion@centro.es", "role": "admin" }
  }
}
```

El frontend envía el token en `Authorization: Bearer <token>` en las rutas protegidas. No devuelve contraseñas ni hashes.

Ejemplo de publicación:

```json
// POST /articles
{
  "section": "magazine",
  "title": "Control de consistencia del mortero",
  "category": "TECNOLOGÍA DE MEZCLAS",
  "excerpt": "Resumen visible en la portada de la revista.",
  "heroImage": "https://centro.es/media/mortero.jpg",
  "blocks": [
    { "id": "paragraph-1", "type": "text", "content": "Primer párrafo." },
    { "id": "paragraph-2", "type": "text", "content": "Segundo párrafo." }
  ]
}

// 201
{
  "data": {
    "article": {
      "id": "post-123",
      "section": "magazine",
      "tag": "TECNOLOGÍA DE MEZCLAS",
      "category": "TECNOLOGÍA DE MEZCLAS",
      "title": "Control de consistencia del mortero",
      "excerpt": "Resumen visible en la portada de la revista.",
      "author": "Redacción",
      "readTime": "2 MIN LECTURA",
      "heroImage": "https://centro.es/media/mortero.jpg",
      "blocks": [
        { "id": "paragraph-1", "type": "text", "content": "Primer párrafo." },
        { "id": "paragraph-2", "type": "text", "content": "Segundo párrafo." }
      ],
      "publishedAt": "2026-10-22T08:16:00Z"
    }
  }
}
```

El servidor determina el autor a partir de la sesión, genera el identificador y la fecha, calcula el tiempo de lectura y marca el artículo como publicado. No confíes en valores de autor o estado enviados por el navegador. En `PUT`, comprueba que el artículo pertenece al usuario o que la cuenta tiene permiso de administración. No aceptes autorización basada solamente en que el botón de edición no aparezca en la interfaz.

## Secciones y categorías

Cada publicación debe tener una sección. El editor permite publicar y mover entradas entre estas secciones:

- `magazine`: Revista técnica.
- `notebook`: Bitácora de prácticas.
- `project`: Proyecto de taller.

Categorías ofrecidas actualmente por el formulario (valida sección y categoría de forma conjunta):

| Sección | Categorías |
| --- | --- |
| `magazine` | `TECNOLOGÍA DE MEZCLAS`, `SEGURIDAD EN OBRA`, `SALIDAS PROFESIONALES` |
| `notebook` | `TALLER PRÁCTICO`, `SEGURIDAD Y SALUD`, `TOPOGRAFÍA` |
| `project` | `AVANCE DE OBRA`, `MATERIALES`, `RESULTADO FINAL` |

La web muestra artículos `magazine` en la revista, `notebook` en la bitácora y `project` como actualizaciones en la sección de taller. La respuesta pública necesita incluir `section`, `category`, `title`, `excerpt`, `author`, `readTime`, `heroImage`, `blocks` y `publishedAt`.

## Tablas sugeridas

Un esquema MySQL mínimo puede partir de estas tablas. Ajusta nombres o tipos a tu proyecto manteniendo el contrato JSON anterior.

```sql
CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor') NOT NULL DEFAULT 'editor',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE auth_tokens (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE articles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  section ENUM('magazine', 'notebook', 'project') NOT NULL,
  title VARCHAR(180) NOT NULL,
  category VARCHAR(80) NOT NULL,
  excerpt VARCHAR(500) NOT NULL,
  hero_image TEXT NULL,
  blocks JSON NOT NULL,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'published',
  published_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX articles_publication (status, section, published_at),
  INDEX articles_author (user_id, updated_at)
);

CREATE TABLE site_config (
  id TINYINT UNSIGNED PRIMARY KEY,
  config JSON NOT NULL,
  updated_by BIGINT UNSIGNED NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT site_config_singleton CHECK (id = 1),
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);
```

Guarda la contraseña con `password_hash()` y compruébala con `password_verify()`. Para sesiones, genera un valor aleatorio criptográficamente seguro, devuelve el valor original una sola vez, persiste solo su SHA-256 y aplica caducidad/revocación. Usa PDO con consultas preparadas y valida campos, longitud, tipo de bloque y categoría en el servidor.

No hace falta exponer un endpoint público de registro para este caso: crea el usuario redactor inicial mediante un script de instalación o comando CLI que guarde la contraseña con `password_hash()`. Si permites más cuentas en el futuro, asigna explícitamente quién tiene permiso para publicar.

## Configuración del editor visual

`GET /site-config` debe ser público y devolver la configuración actual. Si todavía no existe, crea o devuelve una configuración inicial con el tema del frontend. `PUT /site-config` requiere Bearer y rol `admin`; valida los colores hexadecimales, el grosor de borde, la tipografía permitida, URLs de imagen HTTP/HTTPS, número máximo de módulos y tamaños de texto. No aceptes escritura de configuración a usuarios con rol `editor`.

Ejemplo de respuesta:

```json
{
  "data": {
    "config": {
      "version": 1,
      "theme": {
        "primary": "#ef4444",
        "secondary": "#facc15",
        "accent": "#2563eb",
        "background": "#ffffff",
        "borderWidth": 3,
        "fontFamily": "Inter"
      },
      "content": {},
      "images": {},
      "modules": {},
      "customModules": {
        "home": [],
        "notebook": [],
        "project": []
      }
    }
  }
}
```

El `PUT` recibe `{ "config": { ... } }` con la misma estructura. `content` guarda las modificaciones de texto por clave, `images` guarda URLs por clave, `modules` controla orden/visibilidad/ancho y `customModules` contiene módulos adicionales de texto e imagen por página. Trata las claves de contenido como identificadores opacos: no las derives de HTML ni las interpretes como SQL. El frontend también permite cargar una imagen con una URL; esta versión no recibe ni almacena archivos subidos. Cada guardado actualiza `updated_by` y `updated_at`.

Los usuarios devueltos por login y `/auth/me` deben incluir `role`. El panel visual solo se muestra a `admin`, pero la comprobación decisiva de permisos siempre debe hacerse también en PHP.

## Qué contenido hacer editable

El editor ya permite crear, editar, cambiar de sección y eliminar publicaciones. Para que el contenido estático actual también se pueda administrar, migra los artículos de ejemplo y los registros de bitácora a `articles`, y conviértelos en semillas iniciales; deja de tratarlos como contenido de producción del frontend. Las actualizaciones nuevas se gestionan desde el mismo listado «Mis publicaciones».

El modo visual permite editar los textos simples visibles, cambiar URLs de imágenes, cambiar colores/tipografía/grosor de bordes, reordenar módulos mediante arrastrar o controles, ocultar/mostrar y ajustar su ancho. También permite crear y eliminar módulos de texto adicionales en portada, bitácora y proyecto. Los artículos siguen editándose desde el panel editorial, no mediante el editor de diseño.

Las claves de texto visuales se calculan a partir de la estructura de módulos del frontend. Si una futura versión cambia marcadores o estructura de página, conserva la compatibilidad o migra las claves guardadas antes de desplegarla.

## CORS y despliegue

- Permite únicamente el origen real del frontend; en local añade el origen de Vite (normalmente `http://localhost:5173`).
- Responde correctamente al preflight `OPTIONS` y permite `Content-Type`, `Authorization` y los métodos usados.
- El diseño usa tokens Bearer, no cookies; no habilites credenciales CORS de forma global.
- Exige HTTPS en producción, limita intentos de login y no registres contraseñas ni tokens.
- Devuelve solo artículos publicados en la ruta pública. Protege cada operación de escritura en PHP aunque el editor esté oculto en el frontend.

## Alcance actual del editor

El formulario publica artículos en cualquiera de las tres secciones con título, categoría, resumen, URL opcional de portada y párrafos. El autor es el usuario autenticado. Las publicaciones se pueden editar y eliminar desde «Mis publicaciones». La URL de portada se almacena en `heroImage`; por ahora el navegador no sube archivos. Para gestionar imágenes locales, añade una ruta autenticada de medios y adapta el formulario para enviar `multipart/form-data`.
