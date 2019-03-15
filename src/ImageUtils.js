import { convertProps } from './HelperUtils'


const imageCache = {}
/**
 * Cache if we've seen an image before so we don't both with
 * lazy-loading & fading in on subsequent mounts.
 *
 * @param props
 * @return {*|boolean}
 */
export const inImageCache = props => {
  const convertedProps = convertProps(props)
  // Find src
  const src = convertedProps.fluid
      ? convertedProps.fluid.src
      : convertedProps.fixed.src

  return imageCache[src] || false
}


/**
 * Adds an Image to imageCache.
 * @param props
 */
export const activateCacheForImage = props => {
  const convertedProps = convertProps(props)
  // Find src
  const src = convertedProps.fluid
      ? convertedProps.fluid.src
      : convertedProps.fixed.src

  imageCache[src] = true
}


/**
 * Creates a picture element for the browser to decide which image to load.
 *
 * @param props
 * @param onLoad
 * @return {HTMLImageElement|null}
 */
export const createPictureRef = (props, onLoad = () => {}) => {
  const convertedProps = convertProps(props)
  if (typeof window !== `undefined` &&
      (typeof convertedProps.fluid !== `undefined` ||
       typeof convertedProps.fixed !== `undefined`)) {
    const imageData = props.fluid
        ? props.fluid
        : props.fixed

    const img = new Image()
    const pic = document.createElement('picture')
    if (imageData.srcSetWebp) {
      const sourcesWebP = document.createElement('source')
      sourcesWebP.type = `image/webp`
      sourcesWebP.srcset = imageData.srcSetWebp
      sourcesWebP.sizes = imageData.sizes
      pic.appendChild(sourcesWebP)
    }
    pic.appendChild(img)

    img.onload = () => onLoad()
    if (!img.complete && typeof convertedProps.onLoad === `function`) {
      img.addEventListener('load', convertedProps.onLoad)
    }
    if (typeof convertedProps.onError === `function`) {
      img.addEventListener('error', convertedProps.onError)
    }
    img.srcset = imageData.srcSet ? imageData.srcSet : ``
    img.src = imageData.src ? imageData.srcSet : ``

    return img
  }
  return null
}


/**
 * Create basic image for a noscript event.
 *
 * @param props
 * @return {string}
 */
export const noscriptImg = props => {
  // Check if prop exists before adding each attribute to the string output below to prevent
  // HTML validation issues caused by empty values like width="" and height=""
  const src = props.src ? `src="${props.src}" ` : `src="" ` // required attribute
  const sizes = props.sizes ? `sizes="${props.sizes}" ` : ``
  const srcSetWebp = props.srcSetWebp
      ? `<source type='image/webp' srcset="${props.srcSetWebp}" ${sizes}/>`
      : ``
  const srcSet = props.srcSet ? `srcset="${props.srcSet}" ` : ``
  const title = props.title ? `title="${props.title}" ` : ``
  const alt = props.alt ? `alt="${props.alt}" ` : `alt="" ` // required attribute
  const width = props.width ? `width="${props.width}" ` : ``
  const height = props.height ? `height="${props.height}" ` : ``
  const opacity = props.opacity ? props.opacity : `1`
  const transitionDelay = props.transitionDelay ? props.transitionDelay : `0.5s`
  return `<picture>${srcSetWebp}<img ${width}${height}${sizes}${srcSet}${src}${alt}${title}style="position:absolute;top:0;left:0;transition:opacity 0.5s;transition-delay:${transitionDelay};opacity:${opacity};width:100%;height:100%;object-fit:cover;object-position:center"/></picture>`
}