import htm from 'htm'
import vhtml from 'vhtml'
import {toHTML, uriLooksSafe} from '@portabletext/to-html'
import { urlForImage } from './imageBuilder'

const html = htm.bind(vhtml)

const myPortableTextComponents = {
types: {
    image: ({value}) => html`<img src="${value.imageUrl}" />`,
},
}

export function sanityPortableText(portabletext){
    console.log(portabletext)
    return toHTML(portabletext, {components: myPortableTextComponents})
}