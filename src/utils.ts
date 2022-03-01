function makeid(length: number) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Ids of elements in JSON Schema, are split by "_" for every levels starting with root, such as root_section_field
function getCurrentSection(id: string): string {
  return id.split('_')[1];
}

function getCurrentField(id: string): string {
  return id.split('_').pop() || id;
}

export { makeid, getCurrentSection, getCurrentField };
