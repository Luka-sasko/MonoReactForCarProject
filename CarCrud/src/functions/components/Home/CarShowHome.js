import React from 'react';

const CarShowHome = ({ cars, deleteCar, updateCar, showAllCars, hideAllCars,showFilter,sortBy}) => {
  return (
    <div>
      <h2>All Cars</h2>
      <button onClick={showAllCars}>Show All Cars</button>
      <button onClick={showFilter}>Filter</button>
      <button onClick={hideAllCars}>Hide All Cars</button>
      {cars.length === 0 ? (
        <p></p>
      ) : (
        <ul>
          {cars.map((car, index) => (
            <li key={index}>
              <br/><br/>
              {car.brand} {car.model} ({car.manufacturYear}  )
              <button onClick={() => deleteCar(car.id)}>Delete</button>
              <button onClick={() => updateCar(car.id)}>Update</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CarShowHome;
