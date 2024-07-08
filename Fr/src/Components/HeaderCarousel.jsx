import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import axios from "axios";
import Header from "./Header";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const HeaderCarousel = () => {
  const [services, setServices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:3000/services");
        setServices(res.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (services.length > 0) {
        setCurrentIndex((prevIndex) =>
          prevIndex === services.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [services]);

//   const handleNext = () => {
//     // Move to the next slide manually
//     setCurrentIndex((prevIndex) =>
//       prevIndex === services.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   const handlePrev = () => {
//     // Move to the previous slide manually
//     setCurrentIndex((prevIndex) =>
//       prevIndex === 0 ? services.length - 1 : prevIndex - 1
//     );
//   };

  return (
    <div>
      <Carousel
        autoPlay={false} // Disable autoPlay here
        infiniteLoop
        selectedItem={currentIndex}
        onChange={setCurrentIndex}
      >
        {services.map((service) => (
          <Header key={service._id} Ser={service} />
        ))}
      </Carousel>
      <div>
        {/* <button onClick={handlePrev}>Previous</button>
        <button onClick={handleNext}>Next</button> */}
      </div>
    </div>
  );
};

export default HeaderCarousel;
