import { BootstrapVariantType } from './component-props'
import { UserType } from './auth'

export type IdType = string

export type ReviewType = {
  count: number
  stars: number
}

export type PropertyType = {
  id: IdType
  icon: string
  image: string
  name: string
  propertyType: string
  location: string
  beds: number
  bath: number
  flor: number
  size: number
  price: string
  country: string
  type: 'Rent' | 'Sold' | 'Sale'
  variant: string
  save?: boolean
}

export type CustomerType = {
  id: IdType
  propertyType: string
  interestedProperties: string
  customerStatus: 'Interested' | 'Under Review' | 'Follow-up'
  date: Date
  status: 'Available' | 'Unavailable'
  propertyView: number
  propertyOwn: number
  invest: string
}

export type CustomerReviewsType = {
  id: IdType
  rating: number
  propertyId: PropertyType['id']
  property?: PropertyType
  review: {
    title: string
    description: string
  }
  reviewStatus: 'Published' | 'Pending'
  date: Date
}

export type FileType = Partial<File> & {
  preview?: string
}

export type ActivityType = {
  title: string
  icon?: string
  variant?: BootstrapVariantType
  status?: 'completed' | 'latest'
  files?: FileType[]
  time: Date
  type?: 'task' | 'design' | 'achievement'
  content?: string
}

export type SocialEventType = {
  id: IdType
  title: string
  venue: string
  type: 'togetherness' | 'celebration' | 'professional'
  image: string
  startsAt: Date
}

export type TimelineType = {
  [key: string]: {
    title: string
    description: string
    important?: boolean
  }[]
}

export type TodoType = {
  id: IdType
  task: string
  createdAt: Date
  dueDate: Date
  status: 'Pending' | 'In-Progress' | 'Completed'
  priority: 'High' | 'Medium' | 'Low'
  employeeId: SellerType['id']
  employee?: SellerType
}

export type SellerType = {
  id: IdType
  name: string
  image: string
  storeName: string
  review: ReviewType
  productsCount: number
  walletBalance: number
  createdAt: Date
  revenue: number
}
