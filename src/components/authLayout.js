'use client'

function AuthLayout({ children }) {
  return (
    <div className=" grid grid-cols-1 lg:grid-cols-2 overflow-y-auto">
      {/* Hero Image Section */}
      <div className="h-full relative hidden lg:block">
        <img
          src="/Qitt-Auth-Hero.jpg"
          alt="Hero Image"
          className="h-full w-full object-fit"
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
