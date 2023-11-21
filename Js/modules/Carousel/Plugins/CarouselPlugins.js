
/**
 * Add touch navigation for the carousel
 */
export class CarouselTouchPlugin{

    /** @type {number} The minimum ratio to accept drag as a percentage */
    #DRAG_RATIO = 0.2

    /**
     * @param {Carousel} carousel
     */
    constructor(carousel) {
        this.carousel = carousel

        carousel.container.addEventListener('dragstart', e => e.preventDefault())
        carousel.container.addEventListener('mousedown', this.startDrag.bind(this))
        carousel.container.addEventListener('touchstart', this.startDrag.bind(this))

        window.addEventListener('mousemove', this.drag.bind(this))
        window.addEventListener('touchmove', this.drag.bind(this))

        window.addEventListener('touchend', this.endDrag.bind(this))
        window.addEventListener('mouseup', this.endDrag.bind(this))
        window.addEventListener('touchcancel', this.endDrag.bind(this))
    }

    /**
     * Start moving on touch
     * @param {MouseEvent|TouchEvent} e
     */
    startDrag(e){
        if (e.touches){
            if (e.touches.length > 1)
                return
            else
                e = e.touches[0]
        }

        this.origin = {x: e.screenX, y: e.screenY}
        this.width = this.carousel.containerWidth
        this.carousel.disableTransition()
    }

    /**
     *
     * @param {MouseEvent|TouchEvent} e
     */
    drag(e){
        if(this.origin){
            const point = e.touches ? e.touches[0] : e
            this.lastTranslate = {x: point.screenX - this.origin.x, y: point.screenY -this.origin.y}

            if ( e.touches && Math.abs(this.lastTranslate.x) > Math.abs(this.lastTranslate.y) ){
                e.stopPropagation()
            }

            const baseTranslate = this.carousel.currentItem * -100 / this.carousel.items.length
            this.carousel.translate(baseTranslate + (100 * this.lastTranslate.x / this.width))
        }
    }

    /**
     * End moving on touch
     * @param {MouseEvent|TouchEvent} e
     */
    endDrag(e){
        if (this.origin && this.lastTranslate){
            this.carousel.enableTransition()

            if (Math.abs(this.lastTranslate.x / this.carousel.carouselWidth) > this.#DRAG_RATIO){
                this.lastTranslate.x < 0 ? this.carousel.paginat.next() : this.carousel.paginat.prev()
            }

        }
        this.carousel.goToItem(this.carousel.currentItem)
        this.origin = null // Drag cancel

    }
}

class AbstractNavigation {

    /**
     *
     * @param {Carousel} carousel
     */
    constructor(carousel) {
        this._carousel = carousel
    }

    /**
     * Go to next item of the carousel.
     */
    next(){
        this._carousel.goToItem(this._carousel.currentItem + this._carousel.slidesToScroll)
    }

    /**
     * Go to the previous item of the carousel.
     */
    prev (){
        this._carousel.goToItem(this._carousel.currentItem - this._carousel.slidesToScroll)
    }
}

/**
 * Add navigation arrows for the carousel
 */
export class Navigation extends AbstractNavigation{

    /**
     * Css Selectors
     * @type {string}
     */

    #CAROUSEL_PAGINATION_PREV = 'carousel__prev'
    #CAROUSEL_PAGINATION_PREV_HIDDEN = 'carousel__prev--hidden'
    #CAROUSEL_PAGINATION_NEXT = 'carousel__next'
    #CAROUSEL_PAGINATION_NEXT_HIDDEN = 'carousel__next--hidden'

    constructor(carousel) {
        super(carousel);

        if (this._carousel.options.navigation)
            this.createNavigation()
    }

    /**
     * Create navigation arrows in the DOM
     */
    createNavigation(){
        let nextButton = this._carousel.createDivWithClassName(this.#CAROUSEL_PAGINATION_NEXT)
        let prevButton = this._carousel.createDivWithClassName(this.#CAROUSEL_PAGINATION_PREV)

        this._carousel.root.appendChild(nextButton)
        this._carousel.root.appendChild(prevButton)



        nextButton.addEventListener('click', this.next.bind(this))
        prevButton.addEventListener('click', this.prev.bind(this))

        if (this._carousel.options.loop === true){
            return
        }

        this._carousel.onMove(index => {

            if (index === 0){
                prevButton.classList.add(this.#CAROUSEL_PAGINATION_PREV_HIDDEN)
            }
            else{
                prevButton.classList.remove(this.#CAROUSEL_PAGINATION_PREV_HIDDEN)
            }

            if(this._carousel.items[this._carousel.currentItem + this._carousel.slidesVisible ] === undefined){
                nextButton.classList.add(this.#CAROUSEL_PAGINATION_NEXT_HIDDEN)
            }
            else{
                nextButton.classList.remove(this.#CAROUSEL_PAGINATION_NEXT_HIDDEN)
            }
        })
    }



}

/**
 * Add pagination buttons for the carousel
 */
export class Pagination extends AbstractNavigation {

    #CAROUSEL_PAGINATION = 'carousel__pagination'
    #CAROUSEL_PAGINATION_BTN = 'carousel__pagination__button'
    #CAROUSEL_PAGINATION_BTN_ACTIVE = 'carousel__pagination__button--active'


    constructor(carousel) {
        super(carousel);

        this._carousel.root.addEventListener('keyup', this.onArrow.bind(this))

        if (this._carousel.options.pagination)
            this.createPagination()
    }


    /**
     * Create pagination in the DOM
     */
    createPagination(){
        const pagination = this._carousel.createDivWithClassName(this.#CAROUSEL_PAGINATION)
        const buttons = []
        this._carousel.root.appendChild(pagination)
        for (let i = 0; i < this._carousel.items.length; i = i + this._carousel.options.slidesVisible){
            let button = this._carousel.createDivWithClassName(this.#CAROUSEL_PAGINATION_BTN)
            button.addEventListener('click', () => this._carousel.goToItem(i))
            pagination.appendChild(button)
            buttons.push(button)
        }

        this._carousel.onMove(index => {
            let activeButton = buttons[Math.round(index / this._carousel.options.slidesVisible)]
            if (activeButton){
                buttons.forEach(button => button.classList.remove(this.#CAROUSEL_PAGINATION_BTN_ACTIVE))
                activeButton.classList.add(this.#CAROUSEL_PAGINATION_BTN_ACTIVE)
            }
        })
    }

    /**
     *
     * @param {IDBCursor} e
     */
    onArrow(e){
        if(e.key === 'ArrowRight' || e.key === 'Right')
            this.next()

        else if (e.key === 'ArrowLeft' || e.key === 'Left')
            this.prev()
    }
}

/**
 * Auto animations for the carousel
 */
export class AnimationPlugin extends AbstractNavigation{

    constructor(carousel, animation) {
        super(carousel)

        if (animation)
            this.animate(animation.delay)
    }

    animate(delay) {
        setInterval(this.next.bind(this), delay)
    }
}