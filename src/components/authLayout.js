'use client'

import Image from 'next/image'

function AuthLayout({ children }) {
  return (
    <div className=" grid grid-cols-1 lg:grid-cols-2 overflow-y-auto">
      {/* Hero Image Section */}
      <div className="h-full relative hidden lg:block">
        <Image
          src="/Qitt-Auth-Hero.jpg"
          alt="Hero Image"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Form Section */}
      <div className="">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
