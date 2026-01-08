import {useState, React } from 'react'
import SearchBar from '../Components/SearchBar'
import ImageGrid from '../Components/ImageGrid'

function HomePage() {
    
const [searchQuery, setSearchQuery] = useState("");
    
  return (
    <div>
      <SearchBar onSearch={setSearchQuery}/>
      <ImageGrid searchItem={searchQuery}/>
    </div>
  )
}

export default HomePage