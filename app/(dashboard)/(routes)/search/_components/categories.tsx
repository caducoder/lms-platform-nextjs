"use client"

import { Category } from "@prisma/client"
import { Cog, Music, Camera, Dumbbell, Cpu, Videotape, type LucideIcon } from "lucide-react";
import React from 'react'
import CategoryItem from "./category-item";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], LucideIcon> = {
  "Música": Music,
  "Ciência da Computação": Cpu,
  "Musculação": Dumbbell,
  "Fotografia": Camera,
  "Edição de vídeo": Videotape,
}

const Categories = ({
  items
}: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  )
}

export default Categories