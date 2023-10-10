const slides = document.querySelectorAll('.slideshow-image');
let current = 0;

slideShow();

function slideShow() {
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove('on');
  }
  current++;
  if (current > slides.length) {
    current = 1;
  }
  slides[current - 1].classList.add('on');
  setTimeout(slideShow, 3000);
}
