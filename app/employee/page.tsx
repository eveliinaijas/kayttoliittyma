import { EmployeeDashboard } from "@/components/employee-dashboard"

export default function EmployeePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600/90 to-purple-800/90 relative">
      <div
        className="fixed bottom-0 right-2 w-130 h-100 opacity-90 pointer-events-none"
        style={{
          backgroundImage: "url(/images/background.png)",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <EmployeeDashboard />
    </div>
  )
}
