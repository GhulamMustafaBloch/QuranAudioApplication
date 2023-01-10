let audio = document.querySelector(".quranPlayer"),
  surahsContainer = document.querySelector(".surahs"),
  ayah = document.querySelector(".ayah"),
  next = document.querySelector(".next"),
  play = document.querySelector(".play"),
  prev = document.querySelector(".prev");

getSurahs();
function getSurahs() {
  // fatch to Get Surahs data
  fetch(`https://api.alquran.cloud/v1/quran/ar.alafasy`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      for (const surah in data.data.surahs) {
        surahsContainer.innerHTML += `
      <div>
      <p>${data.data.surahs[surah].name}</p>
      <p>${data.data.surahs[surah].englishName}</p>
      </div>
      `;
      }
      // tamam suraton ko selct karin
      let allSurahs = document.querySelectorAll(".surahs div"),
        ayahsAudios,
        ayahsText;
      allSurahs.forEach((surah, index) => {
        surah.addEventListener("click", () => {
          fetch(`https://api.alquran.cloud/v1/quran/ar.alafasy`)
            .then((response) => response.json())
            .then((data) => {
              let verses = data.data.surahs[index].ayahs;
              ayahsAudios = [];
              ayahsText = [];
              verses.forEach((verse) => {
                ayahsAudios.push(verse.audio);
                ayahsText.push(verse.text);
              });
              let AyahIndex = 0;
              changeAyah(AyahIndex);
              audio.addEventListener("ended", () => {
                AyahIndex++;
                if (AyahIndex < ayahsAudios.length) {
                  changeAyah(AyahIndex);
                } else {
                  AyahIndex = 0;
                  changeAyah(AyahIndex);
                  audio.pause();
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Surah has been saved",
                    showConfirmButton: false,
                    timer: 1500
                  });
                  isPlaying = true;
                  togglePlay();
                }
              });
              //  handle next And previous

              next.addEventListener("click", () => {
                AyahIndex < ayahsAudios.length - 1
                  ? AyahIndex++
                  : (AyahIndex = 0);
                changeAyah(AyahIndex);
              });
              prev.addEventListener("click", () => {
                AyahIndex == 0
                  ? (AyahIndex = ayahsAudios.length - 1)
                  : AyahIndex--;
                changeAyah(AyahIndex);
              });
              // handle play And pause Audio

              let isPlaying = false;
              togglePlay();
              function togglePlay() {
                if (isPlaying) {
                  audio.pause();
                  play.innerHTML = `<i class="fas fa-play"></i>`;
                  isPlaying = false;
                } else {
                  audio.play();
                  play.innerHTML = `<i class="fas fa-pause"></i>`;
                  isPlaying = true;
                }
              }
              play.addEventListener("click", togglePlay);
              function changeAyah(index) {
                audio.src = ayahsAudios[index];
                ayah.innerHTML = ayahsText[index];
              }
            });
        });
      });
    });
}
