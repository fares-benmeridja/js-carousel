import Carousel from './modules/Carousel/Carousel.js'

new Carousel(document.querySelector('#carousel1'), {
    slidesToScroll: 1,
    slidesVisible: 3,
    pagination: true,
    loop: true
})

new Carousel(document.querySelector('#carousel2'), {
    slidesToScroll: 2,
    slidesVisible: 2,
    pagination: true,
    loop: true
})

new Carousel(document.querySelector('#carousel3'))