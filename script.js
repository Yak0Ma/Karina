async function uploadPhoto() {
  const input = document.getElementById('uploadInput');
  const file = input.files[0];
  if (!file) return;

  const storageRef = firebase.storage().ref('photos/' + Date.now() + '_' + file.name);
  const snapshot = await storageRef.put(file);
  const downloadURL = await snapshot.ref.getDownloadURL();

  // Сохраняем ссылку на фото в Firestore
  await firebase.firestore().collection('photos').add({
    url: downloadURL,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  input.value = '';
  loadPhotos(); // Обновим галерею
}

function loadPhotos() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  firebase.firestore()
    .collection('photos')
    .orderBy('createdAt', 'desc')
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const data = doc.data();
        const img = document.createElement('img');
        img.src = data.url;
        gallery.appendChild(img);
      });
    });
}

window.onload = loadPhotos;
