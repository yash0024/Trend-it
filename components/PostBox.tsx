import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Avatar from './Avatar'
import { LinkIcon, PhotographIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import client from '../apollo-client'
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutations'
import { GET_SUBREDDIT_BY_TOPIC, GET_ALL_POSTS } from '../graphql/quries'
import toast from 'react-hot-toast'

type FormData = {
    postTitle: string
    postBody: string
    postImage: string
    subreddit: string
}

type Props = {
    subreddit?: string
}

function PostBox({ subreddit }: Props) {
    const {data: session} = useSession()
    const [addPost] = useMutation(ADD_POST, {
        refetchQueries: [
            GET_ALL_POSTS,
            'getPostList'
        ]
    })
    const [addSubreddit] = useMutation(ADD_SUBREDDIT)
    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>()

    const onSubmit = handleSubmit(async (formData) => {
        const notification = toast.loading('Creating new post...')
        console.log(formData)
        try {
            const {data: {
                getSubredditListByTopic
            },} = await client.query({
                query: GET_SUBREDDIT_BY_TOPIC,
                variables: {
                    topic: subreddit || formData.subreddit
                }
            })
            const subredditExists = getSubredditListByTopic.length > 0
            if (!subredditExists) {
                const {data: { insertSubreddit: newSubreddit }} = await addSubreddit({
                    variables: {
                        topic: formData.subreddit
                    }
                })
                console.log(newSubreddit.id)
                const image = formData.postImage || ''

                const {data: {insertPost: newPost}} = await addPost({
                    variables: {
                        body: formData.postBody,
                        image: image,
                        subreddit_id: newSubreddit.id,
                        title: formData.postTitle,
                        username: session?.user?.name
                    }
                })

                console.log('heyy')

                console.log('New post added', newPost)

            } else {
                const image = formData.postImage || ''

                const {data: {insertPost: newPost}} = await addPost({
                    variables: {
                        body: formData.postBody,
                        image: image,
                        subreddit_id: getSubredditListByTopic[0].id,
                        title: formData.postTitle,
                        username: session?.user?.name
                    }
                })

                console.log('New post added', newPost)
            }

            setValue('postBody', '')
            setValue('postImage', '')
            setValue('postTitle', '')
            setValue('subreddit', '')

            toast.success('New Post Created!', {
                id: notification
            })
        } catch(error) {
            console.log(error)
            toast.error('Something went wrong')
        }
    })

    const [imageBoxOpen, setImageBoxOpen] = useState<Boolean>(false)

    return (
        <form onSubmit={onSubmit} className="sticky top-20 z-50 rounded-md border border-gray-300 bg-whit
        p-2">
           <div className="flex items-center space-x-3">
             <Avatar/>
             <input
               {... register('postTitle',{required:true})}
               disabled={!session}
               className="flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none"
               type="text"
               placeholder={
                 session ? subreddit ? `Create a post in r/${subreddit}`: 'Create a post by entering a title!' : 'Sign in to post'
               }
             />
             <PhotographIcon
               onClick={()=>setImageBoxOpen(!imageBoxOpen)}
               className={`h-6 cursor-pointer text-gray-300 ${
                 imageBoxOpen &&'text-blue-300'}`}
             />
             <LinkIcon className="h-6 text-gray-300"/>
           </div>

           {!! watch('postTitle')&&(
            <div className="flex flex-col py-2">
               {/*Body*/}
                <div className="flex items-center px-2">
                    <p className="min-w-[90px]">Body:</p>
                    <input
                        className="m-2 flex-1 bg-blue-50 p-2 outline-none" 
                        {...register('postBody')}
                        type='text'
                        placeholder='Text (optional)'
                        />
                </div>

                {!subreddit && (
                    <div className="flex items-center px-2">
                        <p className="min-w-[90px]">Subreddit:</p>
                        <input
                            className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                            {... register('subreddit', { required: true })}
                            type="text"
                            placeholder="i.e. node.js"
                        />
                    </div>
                )}


                {imageBoxOpen && (
                    <div className="flex items-center px-2">
                        <p className="min-w-[90px]">Image:</p>
                        <input
                            className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                            {... register('postImage')}
                            type="text"
                            placeholder="Optional..."
                        />
                    </div>
                )}

                {Object.keys(errors).length > 0 && (
                    <div className='space-y-2 p-2 text-red-500'>
                        {
                            errors.postTitle?.type === 'required' && (
                                <p>A Post Title is required</p>
                            )
                        }
                        {
                            errors.subreddit?.type === 'required' && (
                                <p>A Subreddit is required</p>
                            )
                        }
                    </div>
                )}

                {!!watch('postTitle') && 
                <button
                type='submit' 
                className='w-full rounded-full bg-blue-400 p-2 text-white'>Create Post</button>}
            </div>
           )}
        </form>
        )
}
            

export default PostBox