// import { button, Heading, p } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="bg-white flex items-center justify-between">
      <div>
        <h2 className="txt-xlarge">
          Already have an account?
        </h2>
        <p className="txt-medium text-ui-fg-subtle mt-2">
          Sign in for a better experience.
        </p>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <button  className="h-10" data-testid="sign-in-button">
            Sign in
          </button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
