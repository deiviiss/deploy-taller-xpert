"use client"

import Image from "next/image"
import { Select } from "./select/Select"
import { useEffect, useState } from "react";
import { Button } from "../button/Button";
import { SectionResults } from "./section-results/SectionResults";

export const SectionSearch = () => {

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
 
  const optionsCity = [
   {value: '', label: ''},
   {value: 'Lanús', label: 'Lanús'},
   {value: 'La Plata', label: 'La Plata'},
   {value: 'Lomas de Zamora', label: 'Lomas de Zamora'},
   {value: 'Moreno', label: 'Moreno'},
   {value: 'Pilar', label: 'Pilar'},
   {value: 'Quilmes', label: 'Quilmes'},
   {value: 'Tigre', label: 'Tigre'},
   {value: 'Vicente López', label: 'Vicente López'},
  ]
 
  const optionsItem = [
   {value: '', label: ''},
   {value: 'Electricidad', label: 'Electricidad'},
   {value: 'Mecánica', label: 'Mecánica'},
   {value: 'Carpintería', label: 'Carpintería'},
   {value: 'Plomería', label: 'Plomería'},
   {value: 'Jardinería', label: 'Jardinería'},
   {value: 'Informática', label: 'Informática'},
   {value: 'Telefonía', label: 'Telefonía'},
   {value: 'Electrónica', label: 'Electrónica'},
   {value: 'Varios', label: 'Varios'},
  ]
  
  const handleSelectCity = (event: React.ChangeEvent<HTMLSelectElement>) => {
   setSelectedCity(event.target.value)
  }
 
  const handleSelectItem = (event: React.ChangeEvent<HTMLSelectElement>) => {
   setSelectedItem(event.target.value)
  }
 
  const handleSearch = () =>{
   console.log('busqueda')
  }

  return (
    <>
      <section className=" py-7 px-5 md:py-14 md:px-10 justify-center">
        <div className="flex flex-col justify-center items-center lg:flex-row bg-secondary px-2 py-6 md:px-8 md:py-6">
          <div className="lg:mb-0 mb-8  lg:w-2/4 hidden md:block">
            <div className="relative h-80" >
              <Image src={'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 20vw" priority style={{ objectFit: "cover" }} />
            </div>
          </div>
          <div className="lg:w-2/4 flex flex-col justify-center items-center px-4 py-6 md:px-8 md:py-16">
            <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-4xl font-black text-center mb-2.5 lg:leading-[42px]">¿Buscas un Taller que se adapte a tu necesidad?</h2>
            {/* <div className="flex flex-wrap justify-evenly pt-6 pb-8 gap-x-4 gap-y-6"> */}
            <div className="flex flex-col md:flex-row justify-evenly pt-6 pb-8 gap-x-4 gap-y-6">
              <Select options={optionsCity} value={selectedCity} onChange={handleSelectCity} title={'Ciudad'}/>
              <Select options={optionsItem} value={selectedItem} onChange={handleSelectItem} title={'Rubro'}/>
            </div>
            <Button title='Buscar' onClick={handleSearch} />
          </div>
        </div>
      </section>
      <SectionResults city={selectedCity} item={selectedItem}/>
    </>
  )
}