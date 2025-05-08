import { SignupForm } from "@/components/signup-form"
import { useEffect } from "react"
import RegisterImage from "@/assets/registerPageImage.jpg"


export function SignupPage() {
  useEffect(() => {
    const rootElement = document.getElementById("root")
    if (rootElement) {
      rootElement.style.maxWidth = "100%"
      rootElement.style.padding = "0"

      return () => {
        rootElement.style.maxWidth = "1280px"
        rootElement.style.padding = "2rem"
      }
    }
  }, [])

  return (
    <div className="flex h-screen w-full">
      <div className="hidden md:flex w-1/2 items-center justify-center bg-white">
        <div className="text-center w-3/4">
          <img
            src={RegisterImage}
            alt="Project illustration"
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gray-50 p-4">
        <SignupForm />
      </div>
    </div>
  )
}
