import Image from 'next/image'
import React from 'react'
import { MenuIcon, ChevronDownIcon, HomeIcon, SearchIcon } from '@heroicons/react/solid'
import { 
    BellIcon,
    ChatIcon,
    GlobeIcon,
    PlusIcon,
    SparklesIcon,
    SpeakerphoneIcon,
    VideoCameraIcon 
    } from '@heroicons/react/outline'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

const Header = () => {
    const { data: session } = useSession()

    return (
    <div className='sticky top-0 z-50 flex bg-white px-4 py-2 shadow-sm items-center'>
        <div className="relative h-10 w-20 flex-shrink-0 cursor-pointer">
            <Link href='/'>
                <Image 
                    src="https://links.papareact.com/fqy" 
                    layout="fill"
                    objectFit="contain"
                />
            </Link>
        </div>

        <div className='mx-7 flex items-center xl:min-w-[300px]'>
            <HomeIcon className='h-5 w-5'/>
            <p className='ml-2 hideen flex-1 lg:inline'>Home</p>
            <ChevronDownIcon className='h-5 w-5'/>
        </div>

        <form className='flex flex-1 items-center space-x-2
         rounded-sm border border-gray-200 bg-gray-100 px-3 py-1'>
            <SearchIcon className='h-6 w-6 text-gray-400' />
            <input 
             className='flex-1 bg-transparent outline-none'
             type='text'
             placeholder='Search Reddit' 
             />
            <button type="submit" hidden />
        </form>

        <div className='mx-5 text-gray-500 hidden lg:inline-flex
        items-center space-x-2'>
            <SparklesIcon className='icon'/>
            <GlobeIcon className='icon'/>
            <VideoCameraIcon className='icon'/>
            <hr className='h-10 border border-gray-100' />
            <ChatIcon className='icon'/>
            <BellIcon className='icon'/>
            <PlusIcon className='icon'/>
            <SpeakerphoneIcon className='icon'/>
        </div>

        <div className='ml-5 flex items-center lg:hidden'>
            <MenuIcon className='icon'/>
        </div>

        {session ? (
            <div onClick={() => signOut()} className='hidden items-center space-x-2
            border border-gray-100 p-2  lg:flex'>
                <div className='relative h-5 w-5 flex-shrink-0'>
                <Image
                    objectFit='contain' 
                    src="https://links.papareact.com/23l" 
                    layout='fill'
                    alt=""
                />
                </div>

                <div className='flex-1 text-xs'>
                    <p className='truncate'>{session?.user?.name}</p>
                    <p className='text-gray-400'>Sign Out</p>
                </div>

                <ChevronDownIcon className='h-5 flex-shrink-0 text-gray-400'/>
            </div>
        ) : (
            <div onClick={() => signIn()} className='hidden items-center space-x-2
        border border-gray-100 p-2  lg:flex'>
            <div className='relative h-5 w-5 flex-shrink-0'>
            <Image
                objectFit='contain' 
                src="https://links.papareact.com/23l" 
                layout='fill'
                alt=""
            />
            </div>

            <p className='text-gray-400'>Sign In</p>
        </div>
        )}

        
    </div>
    )
}

export default Header