import {createClient} from '@sanity/client'

const client = createClient({
    projectId: 'z49s437i',
    dataset: 'production',
    useCdn: true,
    // token: 'your_sanity_token_here',  // replace with your own token
    apiVersion: '2024-08-08'
})

export async function getAllGallery(){

    const gallery = await client.fetch(`*[_type == "gallery"]`)
    .catch(error => console.log(error))

    return gallery
}

export async function getAllInsights(){

    const insights = await client.fetch(`*[_type == "insights"]`)
    .catch(error => console.log(error))

    return insights
}

export default client