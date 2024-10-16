# Verwenden eines offiziellen Nginx-Images als Basis
FROM nginx:alpine

# Entfernen der Standard-Nginx-Konfiguration
RUN rm -rf /usr/share/nginx/html/*

# Kopieren der Build-Dateien vom lokalen Dateisystem in das Image
COPY dist /usr/share/nginx/html

# Exponieren des Ports 4200 (zuvor 80), auf dem der Nginx-Server läuft
EXPOSE 4200

# Starten von Nginx
CMD ["nginx", "-g", "daemon off;"]
