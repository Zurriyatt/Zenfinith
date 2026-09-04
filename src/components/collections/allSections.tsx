import { collections } from "@/app/collections/collectionData";
import Image from "next/image";
import SelectItems from "../SettingsComponents/selectItems";
import { Inter } from "next/font/google";
import { useState,useEffect } from "react";
const inter = Inter({
  weight : ["400" , "500"]})
export function AllSections(): React.ReactNode {
  
  return<>
  <h2 className ={`text-3xl font-semibold ${inter.className} pb-8 pt-2 text-textPrimary `}>All Collections</h2>
  <div className = "flex max-w-[95vw] overflow-x-auto gap-2">
    
    {collections.map((item,idx)=>{
      return (<div  
      key = {item.id}
      
      className = {`min-w-60 max-w-60 h-70 sm:w-80 sm:h-90 md:min-w-[23vw] md:h-[27vw] relative overflow-hidden rounded-lg  hover:rounded-[50%/40%] transition-all duration-200 ease-in hover:cursor-pointer  flex flex-col group`}
      > 
      <Image 
      src={item.image}
      width = {450}
      height={450}
      className="absolute inset-0 h-full w-full bg-cover object-center z-0 pointer-events-none"
      alt = {item.badge}
      />
     
      <h4 className ={` text-xl sm:text-3xl ${(item.id==="new-arrivals" || item.id ==="sale"||item.id ==="accessories") ?"text-bgPrimary":"text-textPrimary"}  absolute z-1 mt-[5%] ml-[5%] font-bold ${inter.className} `}>{item.title}</h4>
       <button className ={`border-[2px] text-white border-white self-center absolute flex p-1.5 font-semibold rounded-2xl opacity-0 group-hover:opacity-100  mt-0 group-hover:mt-[25%] text-md transition-all duration-200 ease-in z-3 cursor-pointer hover:bg-[oklch(0.269_0_0)]  hover:text-white`}>{item.badge}</button>

      </div>)
    })
  }
  </div>
  </> 
}
