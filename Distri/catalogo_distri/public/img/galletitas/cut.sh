#!/bin/bash

#!/bin/bash

for file in *; do
  # Saltar si no es un archivo regular
  [ -f "$file" ] || continue

  # Obtener nombre base y extensión
  name="${file%.*}"
  ext="${file##*.}"

  # Si el archivo no tiene extensión, evitar confusión
  if [ "$name" = "$file" ]; then
    ext=""
  fi

  # Truncar nombre a 7 caracteres
  short_name="${name:0:7}"

  # Construir nuevo nombre
  if [ -n "$ext" ] && [ "$name" != "$file" ]; then
    new_name="${short_name}.${ext}"
  else
    new_name="${short_name}"
  fi

  # Evitar sobreescritura accidental
  if [ "$file" != "$new_name" ] && [ ! -e "$new_name" ]; then
    echo "Renombrando: $file → $new_name"
    mv -- "$file" "$new_name"
  fi
done

