import React from 'react'
import { Navbar, Welcome, Dock } from '#components'

const App = () => {
  return (
    <main>
      <div>
        <Navbar />
        <Welcome />
        <Dock />
      </div>
    </main>
  )
}

export default App;
