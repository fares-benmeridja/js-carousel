import {Pagination, Navigation, CarouselTouchPlugin as Touch, AnimationPlugin as Animation} from "./Plugins/CarouselPlugins.js";


export default class Carousel{

    /**
     * @callback moveCallback
     * @param {number} index
     */

    #CAROUSEL = 'carousel'
    #CAROUSEL_CONTAINER = 'carousel__container'
    #CAROUSEL_ITEM = 'carousel__item'

    /**
     * @param {HTMLElement} element
     * @param {object} options
     * @param {number} [options.slidesToScroll=1]
     * @param {number} [options.slidesVisible=1]
     * @param {boolean} [options.loop=false]
     * @param {boolean} [options.pagination=false]
     * @param {boolean} [options.navigation=true]
     * @param {boolean} [options.infinite=true]
     * @param {boolean} [options.animation=true]
     * @param {number} [options.responsive=800]
     */
    constructor(element, options = {}){
        this.element = element
        this.options = Object.assign({}, {
            slidesToScroll: 1,
            slidesVisible: 1,
            loop: false,
            pagination: false,
            navigation: true,
            infinite: false,
            responsive: 800,
            animation: {
                action: true,
                delay: 3000
            }
        }, options)

        this.currentItem = 0
        this.moveCallbacks = []
        this.isMobile = false

        // DOM's Modification
        this.carouselTemplate()
        this.itemDimensions()

        this.paginat = new Pagination(this)
        new Navigation(this)
        new Animation(this, this.options.animation)

        new Touch(this)

        // Events
        this.onWindowResize()
        window.addEventListener('resize', this.onWindowResize.bind(this))
    }

    /**
     * Define the template to be associated with the carousel
     */
    carouselTemplate() {
        const children = Array.from(this.element.children)
        this.root = this.createDivWithClassName(this.#CAROUSEL)
        this.root.setAttribute('tabindex', '0')
        this.container = this.createDivWithClassName(this.#CAROUSEL_CONTAINER)
        this.root.appendChild(this.container)
        this.element.appendChild(this.root)

        const itemsLength = children.length

        this.items = children.map(child=> {
            let item = this.createDivWithClassName(this.#CAROUSEL_ITEM)
            item.appendChild(child)
            this.container.appendChild(item)

            return item
        })

        this.linkedItems = this.items.map( (item, i )=> {
            return {
                prev: i === 0 ? this.items[itemsLength - 1] : this.items[i - 1],
                current: item,
                next: i === itemsLength - 1 ? this.items[0] : this.items[i + 1]
            }
        })

    }

    /**
     * Apply the correct dimensions to the carousel elements
     */
    itemDimensions(){
        let ratio = this.items.length / this.slidesVisible
        this.container.style.width = (ratio * 100) + '%'
        this.items.forEach( item => item.style.width = ((100 / this.slidesVisible) / ratio) + "%")
    }

    /**
     * Add a 3D translation to the container
     * @param {number} percent
     */
    translate(percent){
        this.container.style.transform = 'translate3d('+ percent + '%, 0, 0)'
    }

    /** @param {moveCallback} cb ...*/
    onMove(cb){
        this.moveCallbacks.push(cb)
    }

    onWindowResize(){
        let mobile = window.innerWidth < this.options.responsive

        if(mobile !== this.isMobile){
            this.isMobile = mobile
            this.itemDimensions()
        }
        this.moveCallbacks.forEach(cb => cb(this.currentItem))
    }

    /**
     * 
     * @param {string} className 
     * @returns {HTMLElement}
     */
    createDivWithClassName(className){
        let div = document.createElement('div')
        div.setAttribute('class', className)
        return div
    }

    /**
     * @returns {number}
     */
    get containerWidth() {
        return this.container.offsetWidth
    }

    /**
     * @returns {number}
     */
    get carouselWidth(){
        return this.root.offsetWidth
    }

    disableTransition(){
        this.container.style.transition = 'none'
    }

    enableTransition(){
        this.container.style.transition = ''
    }

    /**
     * Moves the carousel to the targeted item
     * @param {number} index
     */
    goToItem(index){

        if( index < 0){
            if(!this.options.loop )
                return

            index = this.options.slidesToScroll % this.items.length === 0 ? this.items.length - this.slidesVisible : this.items.length - this.slidesVisible + 1
        }

        else if (
            index >= this.items.length
            || (
                this.items[this.currentItem + this.slidesVisible ] === undefined
                && index > this.currentItem
            )
        ) {

            if (!this.options.loop)
                return

            index = 0
        }

        this.translate(index * -100 / this.items.length)
        this.currentItem = index
        this.moveCallbacks.forEach(cb => cb(this.currentItem))

    }

    /**
     * @returns {number}
     */
    get slidesToScroll(){
        return this.isMobile ? 1 : this.options.slidesToScroll
    }

    /**
     * @returns {number}
     */
    get slidesVisible(){
        return this.isMobile ? 1 : this.options.slidesVisible
    }
}