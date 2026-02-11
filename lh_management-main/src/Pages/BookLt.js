import React from "react";
import Navbar from "../Components/Navbar/Navbar";
import Form from "../Components/BookLt/BookingForm";
import Footer from "../Components/Footer/Footer";

function BookLt() {
  return (
    <div className="overflow-y-hidden">
      <Navbar />
      <section className="p-2 flex flex-col items-center overflow-y-auto  h-full max-h-[90%]">

      <h4 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-6xl dark:text-white">Book an LT</h4>
      <Form />
      </section>
      <Footer/>
    </div>
  );
}

export default BookLt;
