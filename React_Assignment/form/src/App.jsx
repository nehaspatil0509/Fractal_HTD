import Form from "./components/Form"

function App() {
  return (
    <>
      <div className="container mt-5">
        <h1 className="text-center mb-4">Dynamic form builder</h1>
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">   {/* controls width */}
            <Form />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
