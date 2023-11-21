## js-carousel

Create a carousel to practice javascript using vanilla JS

### About

This repository was created to practice javascript with the new JS ES2023

### HTML Structure:

This carousel is independent of a specific HTML structure and simply needs a root element surrounding your HTML structure.

    <div id="carousel1">
        <div class="card">
            <div class="image">
                <img src="img/1.jpg" alt="image1">
            </div>
            <div class="body">
                <div class="title">Mon titre 1</div>
                <div class="description">Ici une petite description pour tester le carousel</div>
            </div>
        </div>
        <div class="card">
            <div class="image">
                <img src="img/2.jpg" alt="image2">
            </div>
            <div class="body">
                <div class="title">Mon titre 2</div>
                <div class="description">Ici une petite description pour tester le carousel</div>
            </div>
        </div>
        <div class="card">
            <div class="image">
                <img src="img/3.jpg" alt="image3">
            </div>
            <div class="body">
                <div class="title">Mon titre 3</div>
                <div class="description">Ici une petite description pour tester le carousel</div>
            </div>
        </div>
    </div>

Add css and script link to your HTML

    <link rel="stylesheet" href="css/carousel.css">
    <script src="Js/main.js" type="module" async></script>


### Main Javascript

Create a **new Carousel()** instance with a document selector and optional options.

    import Carousel from './modules/Carousel/Carousel.js'
    
    new Carousel(document.querySelector('#carousel1'), {
    slidesToScroll: 1,
    slidesVisible: 3,
    pagination: true,
    loop: true
    })

### Demo

![The carousel demo!](/demo.gif)