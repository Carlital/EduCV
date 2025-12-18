$fecha = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

docker exec odoo-db pg_dump -U odoo_prod -Fc fiedev > "C:\odoo-docker\backups\educv_$fecha.dump"
