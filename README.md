#taskFlow Api 

##instalacion y ejecucion 

- Node.js v18 o superior
- Cuenta en MongoDB Atlas con un cluster activo

Endpoint

---Teams---
| `GET` | `/api/teams` | Listar todos los equipos |
| `GET` | `/api/teams/:id` | Obtener un equipo por ID |
| `POST` | `/api/teams` | Crear un equipo |
| `PUT` | `/api/teams/:id` | Actualizar un equipo |
| `DELETE` | `/api/teams/:id` | Eliminar un equipo |

---Users-

| `GET` | `/api/users` | Listar usuarios (con `populate` de team) |
| `GET` | `/api/users/:id` | Obtener un usuario por ID |
| `POST` | `/api/users` | Crear un usuario |
| `PUT` | `/api/users/:id` | Actualizar un usuario |
| `DELETE` | `/api/users/:id` | Eliminar un usuario |

---Tasks--

| `GET` | `/api/tasks` | Listar tareas con filtros, orden y paginación |
| `GET` | `/api/tasks/:id` | Obtener una tarea por ID |
| `POST` | `/api/tasks` | Crear una tarea |
| `PUT` | `/api/tasks/:id` | Actualizar una tarea |
| `DELETE` | `/api/tasks/:id` | Eliminar una tarea |
| `GET` | `/api/tasks/stats/by-team` | Aggregation: tareas agrupadas por team y status |
| `GET` | `/api/tasks/with-relations` | `$lookup` de Tasks con Teams y Users |


-----Estructuras de carpetas------

taskflow-api/
 config/
   └── db.js                  
 controllers/
   ├── teamController.js      # Lógica CRUD de Teams
   ├── userController.js      # Lógica CRUD de Users
   └── taskController.js      # Lógica CRUD + aggregation + $lookup
 middleware/
   ├── errorHandler.js        # Manejo centralizado de errores
   └── notFound.js            # Captura de rutas no encontradas
 models/
   ├── Team.js                # Esquema Mongoose Team
   ├── User.js                # Esquema Mongoose User
   └── Task.js                # Esquema Mongoose Task
    routes/
  teamRoutes.js
   ├── userRoutes.js
   └── taskRoutes.js
 utils/
   └── AppError.js
   

   ---Códigos de estado HTTP---

   | `200` | OK | Operación exitosa |
| `201` | Created | Recurso creado (POST) |
| `204` | No Content | Recurso eliminado (DELETE) |
| `400` | Bad Request | Datos inválidos o ID malformado |
| `404` | Not Found | Recurso no existe |
| `409` | Conflict | Registro duplicado (ej. email) |
| `500` | Internal Server Error | Error inesperado |


---Tecnologias--------

- **Node.js**
- **Express** — framework web
- **MongoDB Atlas** — base de datos en la nube
- **Mongoose** — ODM con validaciones y populate
- **dotenv** — variables de entorno
- **morgan** — logs HTTP
- **cors** — habilitar peticiones cross-origin
- **nodemon** — recarga automática en desarrollo