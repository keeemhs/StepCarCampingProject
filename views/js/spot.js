const wrapper = document.querySelector('.wrapper'),
    carousel = document.querySelector('.carousel'),
    buttons = document.querySelectorAll('.fa-solid.button');
let imageIndex = 1,
    intervalId;
var windowsize = 0;
$(window).resize(() => {
    imageIndex = 0;
    console.log(imageIndex, window.innerWidth);
    carousel.style.transform = `translate(-${imageIndex * 100}%)`;
});
const slideImage = () => {
    //인덱스==length 면 0,
    const images = document.querySelectorAll('.spot-image');
    windowsize = window.innerWidth;

    const divisor = windowsize > 800 ? 4 : windowsize > 600 ? 3 : 2;
    ('');
    var length = Math.ceil(images.length / divisor);

    imageIndex = imageIndex < 0 ? 0 : imageIndex;
    imageIndex = imageIndex == length ? 0 : imageIndex;

    console.log(imageIndex, length, images.length, window.innerWidth);
    carousel.style.transform = `translate(-${imageIndex * 100}%)`;
};

const updateClick = (e) => {
    clearInterval(intervalId);
    imageIndex += e.target.id === 'next' ? 1 : -1;
    slideImage(imageIndex);
};

buttons.forEach((button) => button.addEventListener('click', updateClick));

wrapper.addEventListener('mouseover', () => clearInterval(intervalId));
