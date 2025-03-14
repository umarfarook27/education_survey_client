import { Link } from "react-router-dom"

function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container mx-auto flex flex-col items-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Student Migration & Education Quality Survey
            </h1>
            <p className="text-xl text-gray-600 max-w-[800px] mb-8">
              Help us understand student migration patterns and improve educational quality by participating in our
              survey.
            </p>
            <Link to="/signup">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg font-medium flex items-center gap-2">
                Get Started
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </Link>
          </div>
        </section>

        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
                <p className="text-gray-600">Sign up with your email to get started with the survey.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Complete the Survey</h3>
                <p className="text-gray-600">Share details about your education history and current situation.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">View Insights</h3>
                <p className="text-gray-600">
                  Access personalized recommendations and contribute to educational improvements.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home

