// import { Github } from "@medusajs/icons"
// import { Button, Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <h1
            
            className="text-3xl leading-10 text-ui-fg-base font-normal"
          >
            Ecommerce Starter Template
          </h1>
          <h1
            
            className="text-3xl leading-10 text-ui-fg-subtle font-normal"
          >
            Powered by Medusa and Next.js
          </h1>
        </span>
        <a
          href="https://github.com/medusajs/nextjs-starter-medusa"
          target="_blank"
        >
          <button>
            View on GitHub
            {/* <Github /> */}
          </button>
        </a>
      </div>
    </div>
  )
}

export default Hero
