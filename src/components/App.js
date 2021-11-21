import React, {useState, useEffect} from "react";

function App() {
  const [dogs, setDogs] = useState([])
  const [isFilterOn, setIsFilterOn] = useState(false)
  const [selectedDog, setSelectedDog] = useState(null)

  useEffect(() => {
    fetch("http://localhost:3001/pups")
      .then(resp => resp.json())
      .then(data => setDogs(data))
  }, [])

  const dogElements = 
    dogs
      .filter(dog => {
        if(isFilterOn){
          if(dog.isGoodDog){
            return dog
          } else{
            return null
          }
        } else{
          return dog
        }
      })
      .map(dog => <span key={dog.id} onClick={() => setSelectedDog(dog)}>{dog.name}</span>)
  

  function changeGoodDogStatus(){
    const updatedDog = {...selectedDog, isGoodDog: !selectedDog.isGoodDog} 
    setSelectedDog(updatedDog)
    fetch(`http://localhost:3001/pups/${selectedDog.id}`, {
      method: "PATCH",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({isGoodDog : !selectedDog.isGoodDog})
    })
      .then(resp => resp.json())
      .then(data => {
        setDogs(dogs.map(dog => {
          if(dog.id !== data.id){
            return dog
          } else{
            return data
          }
        }))
      })
  }
  
  return (
    <div className="App">
      <div id="filter-div" onClick={() => setIsFilterOn(!isFilterOn)}>
        {isFilterOn === false ? <button id="good-dog-filter">Filter good dogs: OFF</button> : <button id="good-dog-filter">Filter good dogs: ON</button>}
      </div>
      <div id="dog-bar">
        {dogElements}
      </div>
      <div id="dog-summary-container">
        <h1>DOGGO:</h1>
        <div id="dog-info">
          {selectedDog ? <>
            <img src={selectedDog.image}></img>
            <h2>{selectedDog.name}</h2>
            {selectedDog.isGoodDog ? <button onClick={changeGoodDogStatus}>Good Dog!</button> : <button onClick= {changeGoodDogStatus}>Bad Dog!</button>}
          </>
           : null}
        </div>
      </div>
    </div>
  );
}

export default App;
