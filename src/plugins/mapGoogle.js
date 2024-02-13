import { Loader } from '@googlemaps/js-api-loader';

export function setupLoader(AppInstance) {
  AppInstance.provide('$Loader', Loader);
}
