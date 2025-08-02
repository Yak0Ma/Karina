// Загружаем сохраненные фото при старте
window.onload = function () {
  const savedPhotos = JSON.parse(localStorage.getItem('photos')) || [];
  const gallery = document.getElementById('gallery');

  savedPhotos.forEach(photo => {
    const img = document.createElement('img');
    img.src = photo;
    gallery.prepend(img);
  });
};

// Функция добавления фото
function uploadPhoto() {
  const input = document.getElementById('uploadInput');
  const gallery = document.getElementById('gallery');

  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const imgData = e.target.result;

      // Отображаем фото
      const img = document.createElement('img');
      img.src = imgData;
      gallery.prepend(img);

      // Сохраняем в localStorage
      const savedPhotos = JSON.parse(localStorage.getItem('photos')) || [];
      savedPhotos.unshift(imgData); // новое фото в начало
      localStorage.setItem('photos', JSON.stringify(savedPhotos));
    };

    reader.readAsDataURL(input.files[0]);
  }
}

// Очистка галереи и localStorage
function clearGallery() {
  if (confirm("Удалить все фотографии?")) {
    localStorage.removeItem('photos');
    document.getElementById('gallery').innerHTML = '';
  }
}
