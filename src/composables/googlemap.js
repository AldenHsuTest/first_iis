import { ref, inject } from 'vue';

/** @func 初始化googleAPI實例 */
function initMap() {
  const Loader = inject('$Loader');

  /** @func 存放初始化後的googleAPI實例 */
  const google = ref(null);

  /** @func 存放geocoderAPI實例 */
  const geocoder = ref(null);

  /** @func 存放AutocompleteServiceAPI實例 */
  const autocomplete = ref(null);

  /** @func googleAPI初始化設定 */
  const loader = new Loader({
    apiKey: 'AIzaSyCaJkAtzy1RV7AYt4wuLWRUcBvfnyKuckI',
    version: 'weekly',
    language: 'zh-TW',
    libraries: ['places', 'geometry'],
    mapIds: ['TTGO'],
  });

  (async () => {
    google.value = await loader.load();
    geocoder.value = new google.value.maps.Geocoder();
    autocomplete.value = new google.value.maps.places.AutocompleteService();
  })();

  return { google, geocoder, autocomplete };
}

/** @func autocomplete產生模糊查詢地址列表 */
function searchLocalList(autocomplete, address) {
  const googleSearchOption = {
    input: address,
    language: 'zh-TW',
    componentRestrictions: { country: 'TW' },
  };

  return new Promise((resolve, reject) => {
    autocomplete.value.getPlacePredictions(googleSearchOption, (results, status) => {
      if (status === 'OK') {
        resolve(results);
      } else {
        reject(status);
      }
    });
  });
}

/** @func 初始化地址轉經緯度的功能 */
function getGeocoder(geocoder, addressValue) {
  return new Promise((resolve, reject) => {
    geocoder.value.geocode({ address: addressValue, componentRestrictions: { country: 'TW' } }, (results, status) => {
      if (status === 'OK') {
        resolve(results);
      } else {
        reject(status);
      }
    });
  });
}

export {
  initMap, getGeocoder, searchLocalList,
};
