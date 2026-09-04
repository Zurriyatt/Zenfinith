"use client"
import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Field as fieldType } from '@/lib/settingsConfig'

const SelectItems = ({socials,current}:{socials: fieldType,current:string}) => {
  const [value, setValue] = useState(current)
  const options =socials.options as string[]
  const icons = socials.icon as React.ElementType[]
  return (
    <div className="w-full max-w-xs space-y-2">
      <Select value={value} onValueChange={(val) => val && setValue(val)}>
        <SelectTrigger id="Socials" className="w-full">
          <div className="flex items-center gap-2">
          {value}
          </div>
        </SelectTrigger>

        <SelectContent align="start" alignItemWithTrigger={false} className="data-[state=open]:slide-in-from-bottom-8 data-[state=open]:zoom-in-100 duration-400">
          {options.map((item,itr) => {
           const IconComponent = icons[itr];

            return (
            <SelectItem key={item} value={item}>
              {IconComponent && <IconComponent className="w-5 h-5" /> }
              <span className="truncate">{item}</span>
            </SelectItem>
          )})}
        </SelectContent>
      </Select>
    </div>
  )
}

export default SelectItems
