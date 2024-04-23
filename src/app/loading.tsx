import Loader from '@/components/ui/spinner'
import React from 'react'

type Props = {}

const Loading = (props: Props) => {
  return (
    <div className="h-full w-full flex justify-center items-center">
        <Loader />
    </div>
  )
}

export default Loading