"use client"

export function SimpleHeader({ title, description }) {
  return (
    <div className="bg-green-5000 sticky top-0 z-10 bg-background px-3 lg:px-0 py-2 mb-0">
      <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
      {/* <p className="text-muted-foreground">{description}</p> */}
    </div>
  )
}
