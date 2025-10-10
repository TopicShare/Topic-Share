import { useState } from 'react'
import './App.css'
import { AudioCall } from './components/AudioCall'
import { Header } from './components/Header'

function App() {

  return (
    <>
      <div className="flex border-1 border-accent h-12 items-center">
        <Header />
      </div>
      <AudioCall>
      </AudioCall>
    </>
  )
}

export default App
