import { ref, reactive } from 'vue';

export function useForm(initialValues: any, validationRules: any) {
  const formData = ref(initialValues);
  const errors = reactive({} as any);

  const validateField = (field: string) => {
    const rules = validationRules[field];
    if (rules) {
      for (const rule of rules) {
        const result = rule(formData.value[field], formData.value);
        if (result !== true) {
          errors[field] = result;
          return;
        }
      }
    }
    delete errors[field];
  };

  const validateStep = (fields: string[]) => {
    fields.forEach(validateField);
    return fields.every((field) => !errors[field]);
  };

  return {
    formData,
    errors,
    validateField,
    validateStep,
  };
}
