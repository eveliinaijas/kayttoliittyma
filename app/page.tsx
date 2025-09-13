import { LoginForm } from "@/components/login-form"

export default function HomePage() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br flex items-center justify-center p-4">
      <div
        className="fixed bottom-0 right-2 w-130 h-100 opacity-90 pointer-events-none"
        style={{
          backgroundImage: "url(/images/background.png)",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="text-center mb-8 rounded-xl bg-purple-600">
        <h1 className="text-3xl font-bold text-white mb-2 ">POISSAOLOSOVELLUS</h1>
        <div className="inline-block px-4 py-2 ">
          <p className="text-purple-100 m-0">Kirjaudu sisään käyttämällä sähköpostiosoitettasi</p>
        </div>
     
        <LoginForm />
      </div>
    </div>
  )
}
