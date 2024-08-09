import { sanityClient  } from "sanity:client"

export async function getAllGallery(){

    const gallery = await sanityClient.fetch(`*[_type == "gallery" && defined(slug)]`)
    .catch(error => console.log(error))

    return gallery
}