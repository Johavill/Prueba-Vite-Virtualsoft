<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useForm } from './useForm';
import { required, minLength, isEmail, isNumeric, isOfAge, isSameAs } from './validations';

const currentStep = ref(1);

const { formData, errors, validateField, validateStep } = useForm(
  {
    country: '',
    gender: '',
    firstName: '',
    secondName: '',
    birthDate: '',
    documentType: '',
    documentNumber: '',
    documentFront: null,
    documentBack: null,
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    cellphone: '',
    address: '',
    postalCode: '',
  },
  {
    country: [required],
    gender: [required],
    firstName: [required],
    secondName: [required],
    birthDate: [required, isOfAge],
    documentType: [required],
    documentNumber: [required, isNumeric, minLength(5)],
    documentFront: [required],
    documentBack: [required],
    email: [required, isEmail],
    password: [required, minLength(8)],
    confirmPassword: [required, isSameAs('password')],
    phone: [required, isNumeric],
    cellphone: [required, isNumeric],
    address: [required],
    postalCode: [required],
  }
);

// asi se queman los paises al hook ref... pendiente consumir api de paises 
// const countries = ref([]);

// onMounted(() => {
//   countries.value = ['Colombia', 'Argentina', 'Brasil', 'Chile', 'Perú'];
// });
const countries = ref([]);

onMounted(async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name')
    const data = await response.json()
    countries.value = data.map(country => country.name.common).sort()
  } catch (error) {
    console.error('Error al cargar países:', error)
  }
})

const nextStep = () => {
  const fieldsToValidate: any = {
    1: ['country', 'gender', 'firstName', 'secondName', 'birthDate', 'documentType', 'documentNumber', 'documentFront', 'documentBack'],
    2: ['email', 'password', 'confirmPassword', 'phone', 'cellphone'],
  }[currentStep.value];

  if (fieldsToValidate && validateStep(fieldsToValidate)) {
    if (currentStep.value < 3) {
      currentStep.value++;
    }
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const onFileChange = (event: Event, field: 'documentFront' | 'documentBack') => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    formData.value[field] = target.files[0] as any;
    validateField(field);
  }
};


const submitForm = () => {
  if (validateStep(['address', 'postalCode'])) {
    console.log(JSON.stringify(formData.value, null, 2));
    showModal.value = true;
  }
};

const showModal = ref(false);

const closeModal = () => {
  showModal.value = false;
  // Optionally reset form
};

const toggleDark = () => {
  document.documentElement.classList.toggle('dark')
}

// onMounted(() => {
// })
</script>

<template>

  <div class="bg-gray-100 dark:bg-gray-900 dark:text-white flex flex-col items-center justify-center p-4 text-center">
    <h1 class="text-2xl font-bold pb-5">Modo Oscuro con Tailwind Responsive</h1>
    <button @click="toggleDark"
      class="flex w-48 justify-content-center bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded">
      Cambiar modo
      <svg class="w-6 h-6 text-gray-800 dark:text-white ml-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
        fill="currentColor" viewBox="0 0 19 20">
        <path
          d="M16.025 15H14.91c.058-.33.088-.665.09-1v-1h2a1 1 0 0 0 0-2h-2.09a5.97 5.97 0 0 0-.26-1h.375a2 2 0 0 0 2-2V6a1 1 0 0 0-2 0v2H13.46a6.239 6.239 0 0 0-.46-.46V6a3.963 3.963 0 0 0-.986-2.6l.693-.693A1 1 0 0 0 13 2V1a1 1 0 0 0-2 0v.586l-.661.661a3.753 3.753 0 0 0-2.678 0L7 1.586V1a1 1 0 0 0-2 0v1a1 1 0 0 0 .293.707l.693.693A3.963 3.963 0 0 0 5 6v1.54a6.239 6.239 0 0 0-.46.46H3V6a1 1 0 0 0-2 0v2a2 2 0 0 0 2 2h.35a5.97 5.97 0 0 0-.26 1H1a1 1 0 0 0 0 2h2v1a6 6 0 0 0 .09 1H2a2 2 0 0 0-2 2v2a1 1 0 1 0 2 0v-2h1.812A6.012 6.012 0 0 0 8 19.907V10a1 1 0 0 1 2 0v9.907A6.011 6.011 0 0 0 14.188 17h1.837v2a1 1 0 0 0 2 0v-2a2 2 0 0 0-2-2ZM11 6.35a5.922 5.922 0 0 0-.941-.251l-.111-.017a5.52 5.52 0 0 0-1.9 0l-.111.017A5.924 5.924 0 0 0 7 6.35V6a2 2 0 1 1 4 0v.35Z">
        </path>
      </svg>
    </button>
  </div>


  <div class="min-h-screen bg-gray-100 flex items-center justify-center dark:bg-gray-900 dark:text-white">
    <div
      class="mt-5 mb-8 dark:bg-gray-900 dark:text-white p-8 rounded-lg shadow-md w-full max-w-3xl ring-2 dark:ring-gray-500">
      <h1 class="text-2xl font-bold mb-6 text-center">Formulario de Registro</h1>

      <!-- Timeline -->
      <div class="flex justify-between items-center mb-8 overflow-x-auto">
        <div class="flex items-center">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-white" :class="{
            'bg-blue-500': currentStep >= 1,
            'bg-gray-300': currentStep < 1,
          }">
            1
          </div>
          <span class="ml-2">Información Personal</span>
        </div>
        <div class="flex-1 h-1 bg-gray-300 mx-4">
          <div class="h-1 bg-blue-500" :style="{ width: currentStep > 1 ? '100%' : '0%' }"></div>
        </div>
        <div class="flex items-center">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-white" :class="{
            'bg-blue-500': currentStep >= 2,
            'bg-gray-300': currentStep < 2,
          }">
            2
          </div>
          <span class="ml-2">Cuenta</span>
        </div>
        <div class="flex-1 h-1 bg-gray-300 mx-4">
          <div class="h-1 bg-blue-500" :style="{ width: currentStep > 2 ? '100%' : '0%' }"></div>
        </div>
        <div class="flex items-center">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-white" :class="{
            'bg-blue-500': currentStep === 3,
            'bg-gray-300': currentStep < 3,
          }">
            3
          </div>
          <span class="ml-2">Dirección</span>
        </div>
      </div>

      <!-- Step 1 -->
      <div v-if="currentStep === 1">
        <h2 class="text-xl font-semibold mb-4 ">Paso 1: Información Personal</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          <div>
            <label for="country"
              class="block text-sm font-medium text-gray-700 dark:bg-gray-900 dark:text-white">País</label>
            <select id="country" v-model="formData.country" @blur="validateField('country')"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value="" disabled>Seleccione un país</option>
              <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
            </select>
            <span v-if="errors.country" class="text-red-500 text-xs">{{ errors.country }}</span>
            <span v-else-if="formData.country" class="text-green-500">✔</span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:bg-gray-900 dark:text-white">Género</label>
            <div class="flex items-center mt-2 space-x-4" @change="validateField('gender')">
              <div class="flex items-center">
                <input id="gender-male" type="radio" value="male" v-model="formData.gender"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                <label for="gender-male"
                  class="ml-2 text-sm font-medium text-gray-900 dark:text-white">Masculino</label>
              </div>
              <div class="flex items-center">
                <input id="gender-female" type="radio" value="female" v-model="formData.gender"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                <label for="gender-female"
                  class="ml-2 text-sm font-medium text-gray-900 dark:text-white">Femenino</label>
              </div>
            </div>
            <span v-if="errors.gender" class="text-red-500 text-xs">{{ errors.gender }}</span>
            <span v-else-if="formData.gender" class="text-green-500">✔</span>
          </div>
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-white">Primer Nombre</label>
            <input type="text" id="firstName" v-model="formData.firstName" @input="validateField('firstName')"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <span v-if="errors.firstName" class="text-red-500 text-xs">{{ errors.firstName }}</span>
            <span v-else-if="formData.firstName" class="text-green-500">✔</span>
          </div>
          <div>
            <label for="secondName" class="block text-sm font-medium text-gray-700 dark:text-white">Segundo
              Nombre</label>
            <input type="text" id="secondName" v-model="formData.secondName" @input="validateField('secondName')"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <span v-if="errors.secondName" class="text-red-500 text-xs">{{ errors.secondName }}</span>
            <span v-else-if="formData.secondName" class="text-green-500">✔</span>
          </div>
          <div>
            <label for="birthDate" class="block text-sm font-medium text-gray-700 dark:text-white">Fecha de
              Nacimiento</label>
            <input type="date" id="birthDate" v-model="formData.birthDate" @change="validateField('birthDate')"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <span v-if="errors.birthDate" class="text-red-500 text-xs">{{ errors.birthDate }}</span>
            <span v-else-if="formData.birthDate" class="text-green-500">✔</span>
          </div>
          <div>
            <label for="documentType" class="block text-sm font-medium text-gray-700 dark:text-white">Tipo de
              Documento</label>
            <select id="documentType" v-model="formData.documentType" @change="validateField('documentType')"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value="" disabled>Seleccione un tipo</option>
              <option value="cc">Cédula de ciudadanía</option>
              <option value="passport">Pasaporte</option>
              <option value="ce">Cédula de extranjería</option>
            </select>
            <span v-if="errors.documentType" class="text-red-500 text-xs">{{ errors.documentType }}</span>
            <span v-else-if="formData.documentType" class="text-green-500">✔</span>
          </div>
          <div>
            <label for="documentNumber" class="block text-sm font-medium text-gray-700 dark:text-white pb-2">Número de
              Documento</label>
            <input type="text" id="documentNumber" v-model="formData.documentNumber"
              @input="validateField('documentNumber')"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <span v-if="errors.documentNumber" class="text-red-500 text-xs">{{ errors.documentNumber }}</span>
            <span v-else-if="formData.documentNumber" class="text-green-500">✔</span>
          </div>
          <div></div>
          <div>
            <label for="documentFront" class="block text-sm font-medium text-gray-700 dark:text-white pb-2">Foto
              Documento - Frente</label>
            <img src="/public/docFrente.jpg" alt="Logo" class="mb-3" />
            <input type="file" id="documentFront" @change="onFileChange($event, 'documentFront')" accept="image/jpeg"
              class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
            <span v-if="errors.documentFront" class="text-red-500 text-xs">{{ errors.documentFront }}</span>
            <span v-else-if="formData.documentFront" class="text-green-500">✔</span>
          </div>
          <div>
            <label for="documentBack" class="block text-sm font-medium text-gray-700 dark:text-white pb-2">Foto
              Documento - Reverso</label>
            <img src="/public/docAtras.png" alt="Logo" class="mb-3" />
            <input type="file" id="documentBack" @change="onFileChange($event, 'documentBack')" accept="image/jpeg"
              class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
            <span v-if="errors.documentBack" class="text-red-500 text-xs">{{ errors.documentBack }}</span>
            <span v-else-if="formData.documentBack" class="text-green-500">✔</span>
          </div>
        </div>
      </div>

      <!-- Step 2 -->
      <div v-if="currentStep === 2">
        <h2 class="text-xl font-semibold mb-4">Paso 2: Cuenta</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-white pb-2">Correo
              Electrónico</label>
            <input type="email" id="email" v-model="formData.email" @input="validateField('email')"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <span v-if="errors.email" class="text-red-500 text-xs">{{ errors.email }}</span>
            <span v-else-if="formData.email" class="text-green-500">✔</span>
          </div>
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-white pb-2">Número de
              Teléfono</label>
            <input type="tel" id="phone" v-model="formData.phone" @input="validateField('phone')"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <span v-if="errors.phone" class="text-red-500 text-xs">{{ errors.phone }}</span>
            <span v-else-if="formData.phone" class="text-green-500">✔</span>
          </div>
          <div>
            <label for="password"
              class="block text-sm font-medium text-gray-700 dark:text-white pb-2">Contraseña</label>
            <input type="password" id="password" v-model="formData.password" @input="validateField('password')"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <span v-if="errors.password" class="text-red-500 text-xs">{{ errors.password }}</span>
            <span v-else-if="formData.password" class="text-green-500">✔</span>
          </div>
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-white pb-2">Confirmar
              Contraseña</label>
            <input type="password" id="confirmPassword" v-model="formData.confirmPassword"
              @input="validateField('confirmPassword')"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <span v-if="errors.confirmPassword" class="text-red-500 text-xs">{{ errors.confirmPassword }}</span>
            <span v-else-if="formData.confirmPassword" class="text-green-500">✔</span>
          </div>
          <div>
            <label for="cellphone" class="block text-sm font-medium text-gray-700 dark:text-white pb-2">Número de
              Celular</label>
            <input type="tel" id="cellphone" v-model="formData.cellphone" @input="validateField('cellphone')"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <span v-if="errors.cellphone" class="text-red-500 text-xs">{{ errors.cellphone }}</span>
            <span v-else-if="formData.cellphone" class="text-green-500">✔</span>
          </div>
        </div>
      </div>

      <!-- Step 3 -->
      <div v-if="currentStep === 3">
        <h2 class="text-xl font-semibold mb-4">Paso 3: Dirección</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700 dark:text-white pb-2">Dirección de
              Residencia</label>
            <input type="text" id="address" v-model="formData.address" @input="validateField('address')"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <span v-if="errors.address" class="text-red-500 text-xs">{{ errors.address }}</span>
            <span v-else-if="formData.address" class="text-green-500">✔</span>
          </div>
          <div>
            <label for="postalCode" class="block text-sm font-medium text-gray-700 dark:text-white pb-2">Código
              Postal</label>
            <input type="text" id="postalCode" v-model="formData.postalCode" @input="validateField('postalCode')"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <span v-if="errors.postalCode" class="text-red-500 text-xs">{{ errors.postalCode }}</span>
            <span v-else-if="formData.postalCode" class="text-green-500">✔</span>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between mt-8">
        <button @click="prevStep" :disabled="currentStep === 1"
          class="text-white bg-gray-400 hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 disabled:opacity-50">
          Anterior
        </button>
        <button v-if="currentStep < 3" @click="nextStep"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Siguiente
        </button>
        <button v-if="currentStep === 3" @click="submitForm"
          class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
          Enviar
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div class="dark:bg-gray-900 dark:text-white bg-white p-8 rounded-lg shadow-xl">
        <h2 class="text-xl font-bold mb-4">¡Éxito!</h2>
        <p>El formulario ha sido enviado correctamente.</p>
        <div class="mt-6 flex justify-end">
          <button @click="closeModal" class="bg-blue-500 text-white px-4 py-2 rounded-md">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>