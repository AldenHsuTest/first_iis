import Swal from 'sweetalert2';

export function setupSwal(AppInstance) {
  AppInstance.provide('$swal', Swal);
}

export { Swal };
