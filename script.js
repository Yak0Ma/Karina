// Имя базы данных
const DB_NAME = 'galleryDB';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

// Открываем IndexedDB
let db;
const request = indexedDB.open(DB_NAME, DB_VERSION);

// Создание хранилища при первом запуске
request.onupgradeneeded = function (event) {
  db = event.target.result;
  db.createObjectStore(STORE_NAME, { autoIncrement: true });
};

// Успешное подключение к базе
request.onsuccess = function (event) {
  db = event.target.result;
  loadPhotos(); // Загружаем фото при старте
};

request.onerror = function (event) {
  console.error('Ошибка при открытии базы данных', event);
};

// Загрузка всех фото из базы
function loadPhotos() {
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);

  const request = store.openCursor();
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  request.onsuccess = function (event) {
    const cursor = event.target.result;
    if (cursor) {
      const img = document.createElement('img');
      img.src = cursor.value;
      gallery.prepend(img);
      cursor.continue();
    }
  };
}

// Загрузка нового фото
function uploadPhoto() {
  const input = document.getElementById('uploadInput');
  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const imgData = e.target.result;

      // Добавляем фото в базу
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.add(imgData);

      // Отображаем фото
      const img = document.createElement('img');
      img.src = imgData;
      document.getElementById('gallery').prepend(img);
    };

    reader.readAsDataURL(input.files[0]);
  }
}

// Очистка галереи и базы
function clearGallery() {
  if (confirm('Удалить все фотографии?')) {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.clear().onsuccess = function () {
      document.getElementById('gallery').innerHTML = '';
    };
  }
}
