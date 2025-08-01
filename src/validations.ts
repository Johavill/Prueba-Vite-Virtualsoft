export const required = (value: string) => (value ? true : 'Este campo es requerido');

export const minLength = (length: number) => (value: string) =>
  value.length >= length ? true : `Debe tener al menos ${length} caracteres`;

export const isEmail = (value: string) =>
  /.+@.+\..+/.test(value) ? true : 'Debe ser un correo electrónico válido';

export const isNumeric = (value: string) =>
  /^\d+$/.test(value) ? true : 'Debe contener solo números';

export const isOfAge = (value: string) => {
  const birthDate = new Date(value);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18 ? true : 'Debe ser mayor de 18 años';
};

export const isSameAs = (otherField: string) => (value: string, formData: any) =>
  value === formData[otherField] ? true : 'Las contraseñas no coinciden';
