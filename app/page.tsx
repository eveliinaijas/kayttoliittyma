import { LoginForm } from "@/components/login-form"

export default function HomePage() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">POISSAOLOSOVELLUS</h1>
          <p className="text-purple-100">Kirjaudu sisään käyttämällä sähköpostiosoitettasi</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
