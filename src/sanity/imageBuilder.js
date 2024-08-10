import imageUrlBuilder from '@sanity/image-url'
import client from './api'

const builder = imageUrlBuilder(client)

export default function urlForImage(source){
    return builder.image(source)
}