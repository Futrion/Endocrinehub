export function exportToJSON(data, filename = "data.json") {
  if (!data) return;

  const idStrippedData = data.map(({ id, ...rest }) => rest ); // remove id field from export

  const jsonString = JSON.stringify(idStrippedData, null, 2); // pretty format

  const blob = new Blob([jsonString], {
    type: "application/json;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export async function importToJSON(JSONschema, file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject('No se ha seleccionado ningun archivo');
  
    if (file.size > 1000000) {
      return reject('El archivo debe ser menor a 1MB');
    }
    if (file.type !== 'application/json') {
      return reject('El archivo debe ser de tipo JSON');
    }
    
    const reader = new FileReader();
  
    reader.onload = (e) => {
      try{
          const parsedData = JSON.parse(e.target.result);
           
          const validatedJSON = JSONschema.parse(parsedData);
  
          const dataWithIds = validatedJSON.map((item, index) => ({
              id: index + 1,
              ...item
          }));
  
          resolve(dataWithIds);
      }catch(e){
          console.log(e);
          reject(e);
      }
  
    };

    reader.onerror = (e) => reject(e);

    reader.readAsText(file);
  })


}