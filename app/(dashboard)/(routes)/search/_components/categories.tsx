'use client'

import React from 'react'
import { Category } from '@prisma/client'
import { FcGlobe, FcDataConfiguration, FcLock, FcDatabase, FcFlowChart, FcLinux, FcWiFiLogo, FcSettings, FcCurrencyExchange, FcIdea, FcCommandLine, FcMindMap } from 'react-icons/fc';
import { IconType } from 'react-icons'
import CategoryItem from './category-item';
import { CiCloud, CiMobile1 } from "react-icons/ci";



interface CategoriesProps {
  items: Category[]
}

const iconMap: Record<Category["name"], IconType> = {
  'Développement web': FcGlobe,
  'Data science': FcDataConfiguration,
  'Cybersecrity': FcLock,
  'Développement mobile': CiMobile1,
  'Intelligence Artificielle': FcMindMap,
  'Language de programmation': FcCommandLine,
  'Base de données': FcDatabase,
  'Algorithms and basics': FcFlowChart,
  'Systèmes d exploitation': FcLinux,
  'Réseaux et télécommunications': FcWiFiLogo,
  'Cloud computing': CiCloud,
  'DevOps': FcSettings,
  'Blockchain et cryptomonnaies': FcCurrencyExchange,
  'Design et UX/UI': FcIdea,
}
const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className='flex items-center gap-x-2 overflow-auto pb-2'>
      {items.map((item) => (
        <CategoryItem key={item.id} label={item.name} icon={iconMap[item.name]} value={item.id} />
      ))}
    </div>
  )
}

export default Categories


