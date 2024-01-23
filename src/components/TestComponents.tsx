/** @jsxImportSource @emotion/react */
'use client'
import 'twin.macro'

import { useState } from 'react'
import { Button } from '@/components'

export default function TestComponent() {
  const [count, setCount] = useState(0)
  return (
    <div tw="flex justify-center items-center h-screen flex-col">
      <p tw="mb-8">count: {count}</p>
      <div tw="w-60 flex justify-between">
        <Button variant="primary" onClick={() => setCount(count + 1)}>
          plus
        </Button>
        <Button variant="primary" onClick={() => setCount(count - 1)}>
          minus
        </Button>
      </div>
    </div>
  )
}
