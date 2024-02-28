import React, { useEffect, useState } from 'react';
import CarFormHome from './components/Home/CarFormHome.js';
import CarShowHome from './components/Home/CarShowHome.js';
import UpdateForm from './components/Update/CarUpdateForm.js';
import axios from 'axios';
import CarFilterForm from './components/Home/CarFilterForm.js'

function Home() {
  const [updatedCar, setUpdatedCar] = useState(null);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [flagUpdate, setFlagUpdate] = useState(false);
  const [flagFilter, setFilter] = useState(false);
  const [sortOption, setSortOption] = useState('model');

  const [car, setCar] = useState({
    id : '',
    model : '',
    brand : '',
    manufacturYear : ''
  });
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get('https://localhost:44376/api/Car');
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };
    fetchCars();
  }, [sortOption]);

  useEffect(() => {
    const selectedCar = cars.find(car => car.id === selectedCarId);
    if (selectedCar) {
      setUpdatedCar(selectedCar);
    }
  }, [selectedCarId, cars]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCar(prevCar => ({
      ...prevCar,
      [name]: value
    }));
  };

  const addCar = async () => {
    try {
      console.log(car);
      if (car.brand === "" || car.model === "" || !(car.manufacturYear >= 1900 && car.manufacturYear <= 2024)) {
        alert("Please fill out all fields correctly.");
        return;
      }
      const response = await axios.post('https://localhost:44376/api/Car', car);
      const newCar = response.data;
      setCars([...cars, newCar]);
      setCar({
        id: '',
        brand: '',
        model: '',
        manufacturYear: ''
      });
    } catch (error) {
      console.error('Error adding car:', error);
    }
  };

  const deleteCar = async (id) => {
    try {
      await axios.delete(`https://localhost:44376/api/Car/${id}`);
      const updatedCars = cars.filter(car => car.id !== id);
      setCars(updatedCars);
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };
  
  const updateCar = (index) => {
    setFlagUpdate(true);
    setSelectedCarId(index);
  };

  const updateSelectedCar = async (updatedCar) => {
    try {
      if (!updatedCar.id) {
        console.error('Error updating car: Missing id property');
        return;
      }
      const response = await axios.put(`https://localhost:44376/api/Car/${updatedCar.id}`, updatedCar);
      showAllCars();
      console.log('Car updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating car:', error);
    }
    setFlagUpdate(false);
    setSelectedCarId(null);
  };


  const hideAllCars = () => {
    try{
    setCars([]);
    setFlagUpdate(false);
    setSelectedCarId(null);
    }
    catch(error){
      console.error('Error hiding all cars:',error);
    }
  };

  const showAllCars = async () => {
    try {
      const response = await axios.get('https://localhost:44376/api/Car');
      setCars(response.data);
      setFilter(false);
      setFlagUpdate(false);
      setSelectedCarId(null);
    } catch (error) {
      console.error('Error showing all cars:', error);
    }
  };
  
  const getFilteredCars = async (filters) => {
    try {

      let queryParams = new URLSearchParams();
      for (const key in filters) {
        if (filters[key] || filters[key]===false) {
          queryParams.append(key, filters[key]);
        }
      }
      const url = `https://localhost:44376/api/Car?${queryParams.toString()}`;
      console.log(url);
      const response = await axios.get(url);
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching filtered cars:', error);
    }
  };

  const showFilter = () =>{
    setFilter(!flagFilter);
  }

  const handleFilterSubmit = (filters) => {
    console.log(filters);
    getFilteredCars(filters);
  };

   const sortBy = (option) => {
    setSortOption(option);
  };
  
  return (
    <div className='CarFormContainer'>
      {flagFilter && <CarFilterForm onSubmit={handleFilterSubmit} sortBy={sortBy} />}
      <CarShowHome cars={cars} deleteCar={deleteCar} updateCar={updateCar} showAllCars={showAllCars} hideAllCars={hideAllCars} showFilter={showFilter}/>
      <CarFormHome car={car} handleInputChange={handleInputChange} addCar={addCar} />
      {flagUpdate && <UpdateForm car = {updatedCar} updateSelectedCar={updateSelectedCar}/>}
    </div>
  );
}
export default Home;
