\# Despliegue de Odoo en Producción con Docker



Este repositorio contiene la configuración completa para desplegar Odoo 17 en un entorno de producción utilizando Docker Compose, PostgreSQL y Nginx como reverse proxy. El despliegue está preparado para funcionar en el servidor institucional "uprocach" de la ESPOCH.



---



\## 1. Servicios incluidos



\- \*\*Odoo 17\*\* (`odoo:17.0`)

\- \*\*PostgreSQL 15\*\* (`postgres:15-alpine`)

\- \*\*Nginx 1.27\*\* (`nginx:1.27-alpine`)

\- \*\*Red interna segura (`odoo-net`)\*\*

\- \*\*Volúmenes persistentes\*\*



---



\## 2. Archivos principales



| Archivo | Descripción |

|--------|-------------|

| `.env` | Variables sensibles (DB, contraseñas, dominio). |

| `docker-compose.prod.yml` | Stack completo listo para producción. |

| `nginx/odoo.conf` | Configuración del reverse proxy. |

| `odoo/etc/odoo.conf` | Configuración de Odoo optimizada para producción. |

| `odoo/custom-addons/` | Módulos personalizados desarrollados en la tesis. |



---



\## 3. Despliegue en el servidor



Una vez que el servidor esté accesible:



```bash

git clone https://TU\_REPO.git

cd odoo-prod

docker compose -f docker-compose.prod.yml up -d

